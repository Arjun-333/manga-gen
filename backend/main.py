from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from models import StoryRequest, ScriptResponse, CharacterSheetResponse, EnhanceRequest, EnhanceResponse, ImageRequest, ImageResponse, Project, ProjectSummary
from services import script_generator
from library import ProjectManager
from google.api_core.exceptions import ResourceExhausted
from dotenv import load_dotenv
import os
from typing import List

# Load environment variables (HF Token etc)
load_dotenv()

app = FastAPI(title="Manga Chapter Generator API")

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize Library
library = ProjectManager()

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
            final_key,
            request.character_profiles # Pass context for consistency
        )
    except ResourceExhausted as e:
        raise HTTPException(status_code=429, detail=f"Quota Exceeded: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Library Endpoints ---

@app.post("/projects", response_model=str)
async def save_project(project: Project):
    try:
        project_id = library.save_project(project)
        return project_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save project: {str(e)}")

@app.get("/projects", response_model=List[ProjectSummary])
async def list_projects():
    try:
        return library.get_all_projects()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list projects: {str(e)}")

@app.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = library.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    success = library.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted"}

@app.get("/")
async def root():
    return {"message": "Welcome to Manga Chapter Generator API"}
