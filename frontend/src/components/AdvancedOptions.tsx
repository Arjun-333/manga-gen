import { motion } from 'framer-motion';

interface AdvancedOptionsProps {
  enhance: boolean;
  setEnhance: (val: boolean) => void;
  artStyle: string;
  setArtStyle: (val: string) => void;
}

const STYLES = [
  { id: 'manga', name: 'Classic Manga', desc: 'Standard B&W' },
  { id: 'shonen', name: 'Shonen', desc: 'Action, Bold' },
  { id: 'shojo', name: 'Shojo', desc: 'Delicate, Sparkle' },
  { id: 'seinen', name: 'Seinen', desc: 'Gritty, Realistic' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon, Tech' },
  { id: 'horror', name: 'Horror', desc: 'Creepy, Dark' },
  { id: 'watercolor', name: 'Watercolor', desc: 'Soft, Artistic' },
];

export default function AdvancedOptions({ enhance, setEnhance, artStyle, setArtStyle }: AdvancedOptionsProps) {
  return (
    <div className="space-y-6 pt-2">
      {/* Enhance Toggle */}
      <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl flex items-center justify-between transition-colors">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            AI Story Enhancer
            {enhance && <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">Active</span>}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Automatically expands simple ideas into detailed plots</p>
        </div>
        <button
          type="button"
          onClick={() => setEnhance(!enhance)}
          className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 ${
            enhance ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-600'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all transform ${enhance ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Art Style Grid */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          Visual Style
        </label>
        <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
          {STYLES.map((style) => (
            <button
              type="button"
              key={style.id}
              onClick={() => setArtStyle(style.id)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                artStyle === style.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' 
                  : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 shadow-sm'
              }`}
            >
              <div className="relative z-10">
                <div className={`font-semibold text-sm mb-0.5 ${
                  artStyle === style.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {style.name}
                </div>
                <div className={`text-[11px] ${
                  artStyle === style.id ? 'text-blue-600/80 dark:text-blue-300/80' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {style.desc}
                </div>
              </div>
              {artStyle === style.id && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
