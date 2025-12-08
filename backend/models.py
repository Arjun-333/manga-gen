from pydantic import BaseModel
from typing import List, Optional

class StoryRequest(BaseModel):
    prompt: str

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

class CharacterSheetResponse(BaseModel):
    characters: List[CharacterProfile]

class ImageRequest(BaseModel):
    panel_id: int
    description: str
    characters: List[str]
    style: str
    art_style: Optional[str] = "manga"

class ImageResponse(BaseModel):
    panel_id: int
    image_url: str
    status: str
