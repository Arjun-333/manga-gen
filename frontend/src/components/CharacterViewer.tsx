import { motion } from "framer-motion";
import { Users } from "lucide-react";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-4xl mx-auto mt-12 space-y-8"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-600">
          Character Sheet
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generated Characters</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {characterSheet.characters.map((char, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {char.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{char.name}</h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Description</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{char.description}</p>
              </div>
              
              <div>
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Personality</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{char.personality}</p>
              </div>
              
              <div>
                <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Appearance</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{char.appearance}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
