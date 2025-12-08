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
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">AI Story Enhancer</h3>
          <p className="text-xs text-neutral-400">Expand simple ideas into detailed plots</p>
        </div>
        <button
          onClick={() => setEnhance(!enhance)}
          className={`w-12 h-6 rounded-full transition-colors relative ${enhance ? 'bg-purple-600' : 'bg-neutral-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enhance ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      {/* Art Style Grid */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300 ml-1">Art Style</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setArtStyle(style.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                artStyle === style.id 
                  ? 'bg-purple-500/20 border-purple-500 text-white' 
                  : 'bg-white/5 border-transparent text-neutral-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-sm">{style.name}</div>
              <div className="text-[10px] opacity-70">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
