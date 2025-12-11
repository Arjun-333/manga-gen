from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class StoryRequest(BaseModel):
    prompt: str
    enhance: bool = True
    art_style: str = "manga"

class EnhanceRequest(BaseModel):
    prompt: str

class EnhanceResponse(BaseModel):
    enhanced_prompt: str

class Panel(BaseModel):
    id: int
    description: str
    dialogue: Optional[str] = None
    characters: List[str]

class CharacterProfile(BaseModel):
    name: str
    description: str
    personality: str
    appearance: str

class ScriptResponse(BaseModel):
    title: str
    panels: List[Panel]
    characters: Optional[List[CharacterProfile]] = []

class CharacterSheetResponse(BaseModel):
    characters: List[CharacterProfile]

class ImageRequest(BaseModel):
    panel_id: int
    description: str
    characters: List[str]
    style: str
    art_style: Optional[str] = "manga"
    character_profiles: Optional[Dict[str, str]] = None 
    hf_token: Optional[str] = None # User Provided Token

class ImageResponse(BaseModel):
    panel_id: int
    image_url: str
    status: str
    # Quota Stats
    rate_limit_remaining: Optional[int] = None
    rate_limit_reset: Optional[int] = None
    rate_limit_total: Optional[int] = None

# --- Library Models ---
class Project(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    script: ScriptResponse
    images: Dict[str, str] # panel_id -> image_url
    art_style: str

class ProjectSummary(BaseModel):
    id: str
    title: str
    updated_at: str
    thumbnail_url: Optional[str] = None
    panel_count: int = 0
