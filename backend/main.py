from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from models import StoryRequest, ScriptResponse, CharacterSheetResponse, EnhanceRequest, EnhanceResponse, ImageRequest, ImageResponse
from services import script_generator
from google.api_core.exceptions import ResourceExhausted

app = FastAPI(title="Manga Chapter Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    print("Health check endpoint called!")
    return {"status": "ok", "message": "Manga Generator Backend is running"}

@app.get("/auth/validate")
async def validate_auth(x_gemini_api_key: str = Header(None)):
    if not x_gemini_api_key:
        raise HTTPException(status_code=401, detail="Missing API Key")
    
    is_valid = await script_generator.validate_api_key(x_gemini_api_key)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid API Key")
        
    return {"status": "valid"}

@app.post("/enhance-prompt", response_model=EnhanceResponse)
async def enhance_prompt(request: EnhanceRequest, authorization: str = Header(None), x_gemini_api_key: str = Header(None)):
    final_key = x_gemini_api_key
    if not final_key and authorization and authorization.startswith("Bearer "):
        final_key = authorization.replace("Bearer ", "")
    
    if not final_key:
        raise HTTPException(status_code=401, detail="API Key required")
    enhanced_text = await script_generator.enhance_story_prompt(request.prompt, final_key)
    return EnhanceResponse(enhanced_prompt=enhanced_text)

@app.post("/generate/script", response_model=ScriptResponse)
async def generate_script(request: StoryRequest, authorization: str = Header(None), x_gemini_api_key: str = Header(None)):
    # Try both headers
    final_key = x_gemini_api_key
    if not final_key and authorization and authorization.startswith("Bearer "):
        final_key = authorization.replace("Bearer ", "")
    
    print(f"Generate Script Request.")
    print(f"  - Auth Header: {bool(authorization)}")
    print(f"  - X-Key Header: {bool(x_gemini_api_key)}")
    print(f"  - Final Key resolved: {bool(final_key)}")
    
    if not final_key:
        raise HTTPException(status_code=401, detail="API Key required")
    
    try:
        return await script_generator.generate_script(request.prompt, final_key)
    except ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=f"Quota Exceeded: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/characters", response_model=CharacterSheetResponse)
async def generate_characters(request: StoryRequest, authorization: str = Header(None), x_gemini_api_key: str = Header(None)):
    final_key = x_gemini_api_key
    if not final_key and authorization and authorization.startswith("Bearer "):
        final_key = authorization.replace("Bearer ", "")

    if not final_key:
        raise HTTPException(status_code=401, detail="API Key required")
        
    try:
        return await script_generator.generate_characters(request.prompt, final_key)
    except ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=f"Quota Exceeded: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/image", response_model=ImageResponse)
async def generate_image(request: ImageRequest, authorization: str = Header(None), x_gemini_api_key: str = Header(None)):
    final_key = x_gemini_api_key
    if not final_key and authorization and authorization.startswith("Bearer "):
        final_key = authorization.replace("Bearer ", "")

    if not final_key:
        raise HTTPException(status_code=401, detail="API Key required")
        
    try:
        return await script_generator.generate_image(
            request.panel_id, 
            request.description, 
            request.style, 
            request.art_style,
            final_key
        )
    except ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=f"Quota Exceeded: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to Manga Chapter Generator API"}
