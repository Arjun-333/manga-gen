import google.generativeai as genai
from models import ScriptResponse, Panel, CharacterSheetResponse, CharacterProfile, ImageResponse
import json
import asyncio
import base64
import os
import re
import httpx
from huggingface_hub import AsyncInferenceClient
from typing import Dict, Optional, List
from PIL import Image

class ScriptGenerator:
    def __init__(self):
        # Create static directory for images
        os.makedirs("static/images", exist_ok=True)

    async def validate_api_key(self, api_key: str) -> bool:
        """Validate API key using Regex (fast) and Flash (authoritative)"""
        # 1. Fast Local Check
        if not api_key or not api_key.startswith("AIza") or len(api_key) < 35:
            print(f"Validation failed: Invalid format. Length: {len(api_key) if api_key else 0}")
            return False

        self._configure_genai(api_key)
        try:
            # 2. Authoritative Check (List Models)
            print(f"Validating key via list_models()...")
            # Run in thread to prevent blocking
            models = await asyncio.to_thread(list, genai.list_models())
            available_names = [m.name for m in models]
            print(f"Validation successful! Found models: {available_names}")
            
            # Check if we have at least one model
            if not models:
                 print("Warning: Key valid but no models found.")
            return True
        except Exception as e:
            print(f"Validation failed during API call: {e}")
            return False

    def _configure_genai(self, api_key: str):
        genai.configure(api_key=api_key)

    def _clean_json(self, text: str) -> str:
        """Remove markdown code blocks from JSON string"""
        cleaned = re.sub(r"```json\s*", "", text)
        cleaned = re.sub(r"```\s*", "", cleaned)
        return cleaned.strip()

    async def generate_script(self, prompt: str, api_key: str) -> ScriptResponse:
        """Generate a manga script using Gemini Pro"""
        self._configure_genai(api_key)
        # Using gemini-2.5-flash
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        system_prompt = """
        You are an expert manga story writer. Create a structured manga script based on the user's prompt.
        Return ONLY valid JSON with this structure:
        {
            "title": "Story Title",
            "panels": [
                {
                    "id": 1,
                    "description": "Visual description of the panel",
                    "dialogue": "Character dialogue (or null if none)",
                    "characters": ["Char1", "Char2"]
                }
            ],
            "characters": [
                 { "name": "Char1", "description": "Role", "personality": "Traits", "appearance": "Visual description" }
            ]
        }
        """
        # Note: Added "characters" field to system prompt so we get them in one shot for consistency!
        
        try:
            response = await model.generate_content_async(
                contents=[system_prompt, f"Story Idea: {prompt}"],
                generation_config={"response_mime_type": "application/json"}
            )
            
            cleaned_json = self._clean_json(response.text)
            data = json.loads(cleaned_json)
            return ScriptResponse(**data)
        except Exception as e:
            print(f"Error generating script: {e}")
            raise e

    async def generate_characters(self, prompt: str, api_key: str) -> CharacterSheetResponse:
        """Generate character sheets using Gemini Pro"""
        self._configure_genai(api_key)
        # Using gemini-2.5-flash
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        system_prompt = """
        Create detailed character profiles for a manga based on this story idea.
        Return ONLY valid JSON with this structure:
        {
            "characters": [
                {
                    "name": "Name",
                    "description": "Short role description",
                    "personality": "Personality traits",
                    "appearance": "Visual description"
                }
            ]
        }
        """
        
        try:
            response = await model.generate_content_async(
                contents=[system_prompt, f"Story Idea: {prompt}"],
                generation_config={"response_mime_type": "application/json"}
            )
            
            cleaned_json = self._clean_json(response.text)
            data = json.loads(cleaned_json)
            return CharacterSheetResponse(**data)
        except Exception as e:
            print(f"Error generating characters: {e}")
            raise e

    async def enhance_story_prompt(self, prompt: str, api_key: str) -> str:
        """Enhance a simple story idea into a detailed prompt"""
        self._configure_genai(api_key)
        # Using gemini-2.5-flash
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        system_prompt = """
        You are an expert manga editor. Take the user's simple story idea and expand it into a compelling, 
        detailed plot summary suitable for a one-shot manga. 
        Focus on visual details, dramatic stakes, and character motivations.
        Keep it under 150 words.
        """
        
        try:
            response = await model.generate_content_async([system_prompt, f"Idea: {prompt}"])
            return response.text.strip()
        except Exception as e:
            print(f"Error enhancing prompt: {e}")
            return prompt  # Fallback to original

    async def generate_image(
        self, 
        panel_id: int, 
        description: str, 
        style: str, 
        art_style: str, 
        api_key: str, 
        character_profiles: Optional[Dict[str, str]] = None
    ) -> ImageResponse:
        """Generate panel images using Hugging Face (SDXL)"""
        
        # NOTE: For this architecture, we use the Server's HF Token
        # You must set HUGGING_FACE_TOKEN in backend/.env
        hf_token = os.getenv("HUGGING_FACE_TOKEN")
        if not hf_token:
            print("Error: HUGGING_FACE_TOKEN not set in backend environment.")
            return ImageResponse(
                panel_id=panel_id,
                image_url="https://via.placeholder.com/400x600?text=Missing+HF+Token",
                status="failed"
            )

        # Style Definitions for SDXL
        style_prompts = {
            "manga": "manga style, black and white, japanese manga, screentones, ink illustration",
            "shonen": "shonen manga style, dynamic action, high contrast, impact frames, bold lines",
            "shojo": "shojo manga style, delicate lines, emotional, flowers, sparkle, soft shading",
            "seinen": "seinen manga style, gritty, realistic proportions, detailed background, dark atmosphere",
            "cyberpunk": "cyberpunk manga style, neon accents (monochrome), tech wear, messy wires, futuristic",
            "watercolor": "watercolor manga style, soft artistic, dreamlike, wet media",
            "horror": "junji ito style, horror manga, linework, creepypasta, scary, spiral"
        }
        
        selected_style_prompt = style_prompts.get(art_style.lower(), style_prompts["manga"])

        # --- Contextual Prompting Logic ---
        # 1. Identify characters mentioned in description (simple heuristic)
        #    Wait, we don't need heuristic if frontend passes character names?
        #    Better: Just inject ALL character descriptions provided in the Map.
        #    BUT we want to be targeted. 
        #    Let's stick to the simplest effective method: Inject descriptions for ALL characters in the story context.
        #    The prompt length limit of SDXL is generous.
        
        character_context = ""
        if character_profiles:
            character_context = "Characters: " + ", ".join([f"{name}: {desc}" for name, desc in character_profiles.items()])
            # Limit context length to avoid token spill
            if len(character_context) > 300:
                character_context = character_context[:300] + "..."

        # Prompt Engineering for SDXL
        # Structure: Style + Characters + Action/Description + Quality Modifiers
        image_prompt = f"{selected_style_prompt}. {character_context}. {description}, monochromatic, manga page, high quality, masterpiece, 4k"
        
        print(f"Generating Image for Panel {panel_id}")
        print(f"  > Prompt: {image_prompt}")
        
        negative_prompt = "color, realistic photo, 3d render, bad anatomy, bad hands, text, watermark, blurry, low quality, extra limbs"

        try:
            print(f"Connecting to HF Hub as Async Client...")
            client = AsyncInferenceClient(
                model="stabilityai/stable-diffusion-xl-base-1.0", 
                token=hf_token
            )
            
            # Generate Image (Async)
            image = await client.text_to_image(
                image_prompt,
                negative_prompt=negative_prompt
            )
            
            # Save locally
            filename = f"panel_{panel_id}_{hash(description)}.png"
            
            # Ensure directory exists (Robust fix)
            os.makedirs("static/images", exist_ok=True)
            
            filepath = os.path.join("static/images", filename)
            abs_path = os.path.abspath(filepath)
            print(f"Saving image to: {abs_path}")
            
            image.save(filepath)
            
            # Return URL
            image_url = f"http://localhost:8000/static/images/{filename}"
            
            return ImageResponse(
                panel_id=panel_id,
                image_url=image_url,
                status="completed"
            )
            
        except Exception as e:
            print(f"Error generating image: {e}")
            return ImageResponse(
                panel_id=panel_id,
                image_url="https://via.placeholder.com/400x600?text=Generation+Failed",
                status="failed"
            )

script_generator = ScriptGenerator()
