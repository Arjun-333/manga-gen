import asyncio
from models import ScriptResponse, Panel, CharacterSheetResponse, CharacterProfile

class ScriptGenerator:
    async def generate_script(self, prompt: str) -> ScriptResponse:
        # Simulate LLM processing time
        await asyncio.sleep(2)
        
        # Mock response based on prompt
        return ScriptResponse(
            title=f"The Legend of {prompt[:10]}...",
            panels=[
                Panel(
                    id=1, 
                    description="A dark alleyway, rain pouring down. A hooded figure stands in the shadows.", 
                    dialogue="...", 
                    characters=["Hooded Figure"]
                ),
                Panel(
                    id=2, 
                    description="Close up on the figure's eyes. They are glowing red.", 
                    dialogue="It begins tonight.", 
                    characters=["Hooded Figure"]
                ),
                Panel(
                    id=3, 
                    description="Lightning strikes, illuminating a massive castle in the distance.", 
                    dialogue=None, 
                    characters=[]
                )
            ]
        )

    async def generate_characters(self, prompt: str) -> CharacterSheetResponse:
        await asyncio.sleep(1.5)
        return CharacterSheetResponse(
            characters=[
                CharacterProfile(
                    name="Hooded Figure",
                    description="A mysterious individual hiding their face.",
                    personality="Stoic, determined, dangerous.",
                    appearance="Black cloak, glowing red eyes, silver amulet."
                ),
                CharacterProfile(
                    name="The Detective",
                    description="A weary lawman who has seen too much.",
                    personality="Cynical but moral.",
                    appearance="Trench coat, fedora, stubble, smoking a cigarette."
                )
            ]
        )

script_generator = ScriptGenerator()
