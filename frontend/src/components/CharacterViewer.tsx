import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Edit2, Check, X } from "lucide-react";

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
  onUpdateCharacters?: (characters: Character[]) => void;
}

export default function CharacterViewer({ characterSheet, onUpdateCharacters }: CharacterViewerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCharacter, setEditedCharacter] = useState<Character | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedCharacter({ ...characterSheet.characters[index] });
  };

  const handleSave = (index: number) => {
    if (editedCharacter && onUpdateCharacters) {
      const updatedCharacters = [...characterSheet.characters];
      updatedCharacters[index] = editedCharacter;
      onUpdateCharacters(updatedCharacters);
    }
    setEditingIndex(null);
    setEditedCharacter(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedCharacter(null);
  };

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
        <p className="text-sm text-gray-500 dark:text-gray-400">Generated Characters (Click to Edit)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {characterSheet.characters.map((char, index) => {
          const isEditing = editingIndex === index;
          const displayChar = isEditing && editedCharacter ? editedCharacter : char;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {displayChar.name.charAt(0)}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayChar.name}
                      onChange={(e) => setEditedCharacter({ ...editedCharacter!, name: e.target.value })}
                      className="text-xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 border-green-500 focus:outline-none"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{displayChar.name}</h3>
                  )}
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(index)}
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Description</span>
                  {isEditing ? (
                    <textarea
                      value={displayChar.description}
                      onChange={(e) => setEditedCharacter({ ...editedCharacter!, description: e.target.value })}
                      className="w-full text-gray-700 dark:text-gray-300 mt-1 leading-relaxed bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 focus:outline-none focus:border-green-500"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{displayChar.description}</p>
                  )}
                </div>
                
                <div>
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Personality</span>
                  {isEditing ? (
                    <textarea
                      value={displayChar.personality}
                      onChange={(e) => setEditedCharacter({ ...editedCharacter!, personality: e.target.value })}
                      className="w-full text-gray-700 dark:text-gray-300 mt-1 leading-relaxed bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 focus:outline-none focus:border-green-500"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{displayChar.personality}</p>
                  )}
                </div>
                
                <div>
                  <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Appearance</span>
                  {isEditing ? (
                    <textarea
                      value={displayChar.appearance}
                      onChange={(e) => setEditedCharacter({ ...editedCharacter!, appearance: e.target.value })}
                      className="w-full text-gray-700 dark:text-gray-300 mt-1 leading-relaxed bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 focus:outline-none focus:border-green-500"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{displayChar.appearance}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
