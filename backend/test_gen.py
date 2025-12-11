from huggingface_hub import InferenceClient
from PIL import Image
import io
import os
from dotenv import load_dotenv

def test_generation():
    print("--- Starting Image Generation Test (Official Client) ---")
    
    # 1. Load Env
    load_dotenv()
    hf_token = os.getenv("HUGGING_FACE_TOKEN")
    
    print(f"1. Checking Token...")
    if not hf_token:
        print("❌ HUGGING_FACE_TOKEN not found!")
        return
    print(f"✅ Token found (starts with: {hf_token[:5]}...)")
    
    # 2. Use InferenceClient
    model_id = "stabilityai/stable-diffusion-xl-base-1.0"
    print(f"2. Calling Hugging Face Client ({model_id})...")
    
    try:
        client = InferenceClient(model=model_id, token=hf_token)
        
        # text_to_image returns a PIL Image
        image = client.text_to_image(
            "manga style, samurai, black and white, masterpiece",
            negative_prompt="blurry, color"
        )
        
        print("✅ Success! Image object received.")
        
        # 3. Save Image
        os.makedirs("static/images", exist_ok=True)
        filepath = "static/images/test_image_client.png"
        image.save(filepath)
        print(f"✅ Image saved to: {os.path.abspath(filepath)}")
                
    except Exception as e:
        print(f"❌ Exception occurred: {e}")

if __name__ == "__main__":
    test_generation()
