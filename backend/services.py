import asyncio
from models import ScriptResponse, Panel, CharacterSheetResponse, CharacterProfile, ImageResponse

class ScriptGenerator:
    def __init__(self):
        pass

    async def generate_script(self, prompt: str) -> ScriptResponse:
        """Generate a manga script - using mock data for now"""
        print(f"Generating script for: {prompt}")
        
        # Simulate some processing time
        await asyncio.sleep(0.5)
        
        return ScriptResponse(
            title="Mars Battle",
            panels=[
                Panel(
                    id=1,
                    description="A space marine in powered armor stands on the red Martian surface, weapon ready",
                    dialogue="Command, this is Alpha-1. I've got visual on the alien hive.",
                    characters=["Alpha-1"]
                ),
                Panel(
                    id=2,
                    description="Alien creatures emerge from underground tunnels, their chitinous bodies gleaming",
                    dialogue=None,
                    characters=["Aliens"]
                ),
                Panel(
                    id=3,
                    description="The marine opens fire, plasma bolts lighting up the Martian dust",
                    dialogue="Engaging hostiles!",
                    characters=["Alpha-1", "Aliens"]
                ),
                Panel(
                    id=4,
                    description="An explosion rocks the battlefield as the marine throws a grenade",
                    dialogue="Fire in the hole!",
                    characters=["Alpha-1", "Aliens"]
                )
            ]
        )

    async def generate_characters(self, prompt: str) -> CharacterSheetResponse:
        """Generate character sheets - using mock data for now"""
        print(f"Generating characters for: {prompt}")
        
        await asyncio.sleep(0.3)
        
        return CharacterSheetResponse(
            characters=[
                CharacterProfile(
                    name="Alpha-1",
                    description="Elite space marine, squad leader",
                    personality="Brave, tactical, protective of civilians",
                    appearance="Tall, muscular, wearing advanced powered armor with battle scars"
                ),
                CharacterProfile(
                    name="Alien Hive Queen",
                    description="Leader of the Martian alien colony",
                    personality="Intelligent, ruthless, protective of her hive",
                    appearance="Massive chitinous creature with multiple limbs and glowing eyes"
                )
            ]
        )

    async def generate_image(self, panel_id: int, description: str, style: str) -> ImageResponse:
        """Generate panel images - using placeholder for now"""
        print(f"Generating image for panel {panel_id}: {description}")
        
        await asyncio.sleep(1)
        
        # Use picsum.photos for placeholder images
        width = 400 if style == "preview" else 800
        height = 600 if style == "preview" else 1200
        import random
        seed = random.randint(1, 1000)
        image_url = f"https://picsum.photos/seed/{seed}/{width}/{height}"
        
        return ImageResponse(
            panel_id=panel_id,
            image_url=image_url,
            status="completed"
        )

script_generator = ScriptGenerator()
