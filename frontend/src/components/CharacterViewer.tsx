interface Character {
  name: string;
  description: string;
  personality: string;
  appearance: string;
}

interface CharacterSheetResponse {
  characters: Character[];
}

interface CharacterViewerProps {
  characterSheet: CharacterSheetResponse;
}

export default function CharacterViewer({ characterSheet }: CharacterViewerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-600">
          Character Sheet
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generated Characters</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {characterSheet.characters.map((char, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:border-green-500/50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                {char.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{char.name}</h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Description</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{char.description}</p>
              </div>
              
              <div>
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Personality</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{char.personality}</p>
              </div>
              
              <div>
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Appearance</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{char.appearance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
