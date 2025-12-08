import google.generativeai as genai
from models import ScriptResponse, Panel, CharacterSheetResponse, CharacterProfile, ImageResponse
import json
import asyncio
import base64
import os
import re

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
        # Using gemini-2.0-flash as it is available to user
        model = genai.GenerativeModel('gemini-2.0-flash')
        
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
            return ScriptResponse(**data)
        except Exception as e:
            print(f"Error generating script: {e}")
            raise e

    async def generate_characters(self, prompt: str, api_key: str) -> CharacterSheetResponse:
        """Generate character sheets using Gemini Pro"""
        self._configure_genai(api_key)
        # Using gemini-2.0-flash
        model = genai.GenerativeModel('gemini-2.0-flash')
        
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
        # Using gemini-2.0-flash
        model = genai.GenerativeModel('gemini-2.0-flash')
        
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

    async def generate_image(self, panel_id: int, description: str, style: str, art_style: str, api_key: str) -> ImageResponse:
        """Generate panel images using Imagen 3"""
        self._configure_genai(api_key)
        
        # Style Definitions
        style_prompts = {
            "manga": "Classic manga style, black and white ink, screentones",
            "shonen": "Shonen jump style, dynamic action, bold lines, high contrast, impact frames",
            "shojo": "Shojo manga style, delicate lines, flowers, sparkly eyes, emotional atmosphere",
            "seinen": "Seinen manga style, gritty, realistic proportions, detailed backgrounds, dark atmosphere",
            "cyberpunk": "Cyberpunk manga style, heavy machinery, neon accents (in bw), tech wear, wires",
            "watercolor": "Watercolor manga cover style, soft blending, artistic, dreamlike",
            "horror": "Junji ito style horror manga, detailed shading, creepy atmosphere, spiraling lines"
        }
        
        selected_style_prompt = style_prompts.get(art_style.lower(), style_prompts["manga"])

        # Enhanced prompt for Manga style
        image_prompt = f"""
        {selected_style_prompt}.
        A single manga panel showing: {description}.
        Professional manga illustration, detailed line art, dramatic composition, monochrome.
        """
        
        if style == "final":
            image_prompt += " High quality, masterwork, detailed background."
        else:
            image_prompt += " Sketchy, storyboard style."

        try:
            # Using Imagen 4.0 model (available to user)
            model = genai.ImageGenerationModel("imagen-4.0-fast-generate-001")
            
            result = await model.generate_images_async(
                prompt=image_prompt,
                number_of_images=1,
                aspect_ratio="3:4",
                safety_filter_level="block_only_high",
                person_generation="allow_adult"
            )
            
            if not result.images:
                raise ValueError("No image generated")
            
            img = result.images[0]
            
            # Save locally
            filename = f"panel_{panel_id}_{hash(description)}.png"
            filepath = os.path.join("static/images", filename)
            img.save(filepath)
            
            # Return URL
            image_url = f"http://localhost:8000/static/images/{filename}"
            
            return ImageResponse(
                panel_id=panel_id,
                image_url=image_url,
                status="completed"
            )
            
        except Exception as e:
            print(f"Error generating image: {e}")
            # Fallback for errors to prevent app crash
            return ImageResponse(
                panel_id=panel_id,
                image_url="https://via.placeholder.com/400x600?text=Generation+Failed",
                status="failed"
            )

script_generator = ScriptGenerator()
