from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import StoryRequest, ScriptResponse, CharacterSheetResponse
from services import script_generator

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
    return {"status": "ok", "message": "Manga Generator Backend is running"}

@app.post("/generate/script", response_model=ScriptResponse)
async def generate_script(request: StoryRequest):
    return await script_generator.generate_script(request.prompt)

@app.post("/generate/characters", response_model=CharacterSheetResponse)
async def generate_characters(request: StoryRequest):
    return await script_generator.generate_characters(request.prompt)

@app.get("/")
async def root():
    return {"message": "Welcome to Manga Chapter Generator API"}
