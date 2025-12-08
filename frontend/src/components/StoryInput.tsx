import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedOptions from './AdvancedOptions';

interface StoryInputProps {
  onSubmit: (prompt: string, enhance: boolean, artStyle: string) => void;
  isLoading: boolean;
}

export default function StoryInput({ onSubmit, isLoading }: StoryInputProps) {
  const [prompt, setPrompt] = useState('');
  const [step, setStep] = useState(1);
  const [enhance, setEnhance] = useState(true);
  const [artStyle, setArtStyle] = useState('manga');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    if (step === 1) {
      setStep(2);
    } else {
      onSubmit(prompt, enhance, artStyle);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-neutral-900 border border-neutral-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4"
              >
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your manga idea (e.g. 'A cybernetic samurai fighting in a neon rain city')..."
                  className="w-full h-32 bg-transparent text-white placeholder-neutral-500 resize-none focus:outline-none text-lg"
                  autoFocus
                />
              </motion.div>
            ) : (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    ← Back to Prompt
                  </button>
                  <span className="text-xs text-neutral-600">|</span>
                  <span className="text-xs text-white truncate max-w-[200px]">{prompt}</span>
                </div>
                <AdvancedOptions 
                  enhance={enhance} 
                  setEnhance={setEnhance} 
                  artStyle={artStyle} 
                  setArtStyle={setArtStyle} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-3 bg-neutral-950/50 border-t border-white/5 flex justify-between items-center">
             <div className="text-xs text-neutral-500 px-2">
               {step === 1 ? 'Step 1: Idea' : 'Step 2: Style'}
             </div>
             <button
               type="submit"
               disabled={!prompt.trim() || isLoading}
               className={`px-6 py-2 rounded-xl font-medium transition-all ${
                 isLoading 
                   ? 'bg-neutral-800 text-neutral-500 cursor-wait' 
                   : 'bg-white text-black hover:bg-neutral-200'
               }`}
             >
               {isLoading ? 'Generating...' : step === 1 ? 'Next' : 'Create Manga'}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}
