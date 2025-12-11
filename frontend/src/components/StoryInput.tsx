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
        <div className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
          
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <div className="mb-3">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    What story do you want to create?
                  </label>
                </div>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. A cybernetic samurai fighting in a neon rain city..."
                  className="w-full h-32 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 resize-none focus:outline-none text-lg leading-relaxed"
                  autoFocus
                />
              </motion.div>
            ) : (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    ← Edit Prompt
                  </button>
                  <span className="text-gray-300 dark:text-zinc-700">|</span>
                  <span className="text-xs text-gray-500 dark:text-zinc-400 truncate max-w-[200px] font-medium">"{prompt}"</span>
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

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
             <div className="flex gap-2">
               <div className={`h-1.5 w-1.5 rounded-full transition-colors ${step === 1 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`} />
               <div className={`h-1.5 w-1.5 rounded-full transition-colors ${step === 2 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`} />
             </div>
             
             <button
               type="submit"
               disabled={!prompt.trim() || isLoading}
               className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98] ${
                 isLoading 
                   ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-wait' 
                   : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
               }`}
             >
               {isLoading ? (
                 <span className="flex items-center gap-2">
                   <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                   Creating...
                 </span>
               ) : step === 1 ? (
                 'Next: Style' 
               ) : (
                 'Generate Script'
               )}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}
