from pydantic import BaseModel
from typing import List, Optional, Literal

class ImageRequest(BaseModel):
    panel_id: int
    description: str
    characters: List[str]
    style: Literal["preview", "final"] = "preview"

class ImageResponse(BaseModel):
    panel_id: int
    image_url: str
    status: str

class StoryRequest(BaseModel):
    prompt: str
    genre: Optional[str] = "Action"
    style: Optional[str] = "Manga"

class Panel(BaseModel):
    id: int
    description: str
    dialogue: Optional[str] = None
    characters: List[str] = []

class ScriptResponse(BaseModel):
    title: str
    panels: List[Panel]

class CharacterProfile(BaseModel):
    name: str
    description: str
    personality: str
    appearance: str

class CharacterSheetResponse(BaseModel):
    characters: List[CharacterProfile]
