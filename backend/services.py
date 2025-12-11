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
import io

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
        CRITICAL INSTRUCTION: Ensure characters are VISUALLY DISTINCT. 
        - Give them different hair colors, eye shapes, and clothing styles. 
        - Vary their heights and silhouettes (e.g. one tall/thin, one short/stocky).
        - NOT everyone should look like a standard anime protagonist.
        
        Return ONLY valid JSON with this structure:
        {
            "characters": [
                {
                    "name": "Name",
                    "description": "Short role description",
                    "personality": "Personality traits",
                    "appearance": "Visual description (Focus on: Hair Color, Hairstyle, Distinctive Clothing, Accessories)"
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
        character_profiles: Optional[Dict[str, str]] = None,
        panel_characters: Optional[List[str]] = None,
        hf_token: Optional[str] = None
    ) -> ImageResponse:
        """Generate panel images using Hugging Face Inference API"""
        
        # 1. Token Usage Strategy: User > Server > None
        token = hf_token or os.getenv("HUGGING_FACE_TOKEN")
        
        if not token:
            print("Error: No HF Token provided (User or Server).")
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

        # Contextual Prompting Logic
        character_context = ""
        if character_profiles:
            relevant_descriptions = []
            def normalize(n): return n.lower().strip()
            target_chars = panel_characters if panel_characters else character_profiles.keys()
            
            for char_name in target_chars:
                matched_desc = None
                if char_name in character_profiles:
                    matched_desc = character_profiles[char_name]
                else:
                    for key, desc in character_profiles.items():
                        if normalize(key) == normalize(char_name):
                            matched_desc = desc
                            break
                            
                if matched_desc:
                    relevant_descriptions.append(f"{char_name}: {matched_desc}")
            
            if relevant_descriptions:
                character_context = "Featured Characters: " + "; ".join(relevant_descriptions)
            if len(character_context) > 400:
                character_context = character_context[:400] + "..."

        image_prompt = f"{selected_style_prompt}. {character_context}. {description}, monochromatic, manga page, high quality, masterpiece, 4k"
        
        print(f"Generating Image for Panel {panel_id} [Token Source: {'User' if hf_token else 'Server'}]")
        print(f"  > Prompt: {image_prompt}")
        
        negative_prompt = "color, realistic photo, 3d render, bad anatomy, bad hands, text, watermark, blurry, low quality, extra limbs"

        # Direct HTTP usage to capture headers
        API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "inputs": image_prompt, 
            "parameters": {"negative_prompt": negative_prompt}
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(API_URL, headers=headers, json=payload, timeout=60.0)
                
                # Check for Quota/Rate Limit Headers
                # x-ratelimit-remaining: The number of requests left for the time window
                # x-ratelimit-reset: The remaining window before the rate limit resets, in seconds
                # x-ratelimit-limit: The rate limit ceiling for that given timestamp
                
                rl_remaining = response.headers.get("x-ratelimit-remaining")
                rl_reset = response.headers.get("x-ratelimit-reset")
                rl_total = response.headers.get("x-ratelimit-limit")
                
                stats = {
                    "rate_limit_remaining": int(rl_remaining) if rl_remaining else None,
                    "rate_limit_reset": int(rl_reset) if rl_reset else None,
                    "rate_limit_total": int(rl_total) if rl_total else None,
                }
                
                if response.status_code == 200:
                    image_bytes = response.content
                    image = Image.open(io.BytesIO(image_bytes))
                    
                    filename = f"panel_{panel_id}_{hash(description)}.png"
                    os.makedirs("static/images", exist_ok=True)
                    filepath = os.path.join("static/images", filename)
                    image.save(filepath)
                    
                    image_url = f"http://localhost:8000/static/images/{filename}"
                    
                    return ImageResponse(
                        panel_id=panel_id,
                        image_url=image_url,
                        status="completed",
                        **stats
                    )
                else:
                    error_msg = response.text
                    print(f"HF API Error: {response.status_code} - {error_msg}")
                    
                    if response.status_code == 429 or response.status_code == 402:
                         # Rate Limited
                         return ImageResponse(
                             panel_id=panel_id,
                             image_url="https://via.placeholder.com/400x600?text=Rate+Limit+Exceeded",
                             status="failed",
                             **stats
                         )
                    
                    return ImageResponse(
                        panel_id=panel_id,
                        image_url="https://via.placeholder.com/400x600?text=Generation+Error",
                        status="failed",
                         **stats
                    )

        except Exception as e:
            print(f"Error generating image: {e}")
            return ImageResponse(
                panel_id=panel_id,
                image_url="https://via.placeholder.com/400x600?text=System+Error",
                status="failed"
            )

script_generator = ScriptGenerator()
