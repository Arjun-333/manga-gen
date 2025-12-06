from pydantic import BaseModel
from typing import List, Optional

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
