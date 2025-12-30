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
        <div className="relative bg-white dark:bg-mn-blue border-2 border-transparent dark:border-mn-teal/30 focus-within:border-mn-teal rounded-xl shadow-lg transition-all duration-300">
          
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
                  <label htmlFor="prompt" className="block text-sm font-bold text-gray-700 dark:text-mn-offwhite uppercase tracking-wider">
                    Story Concept
                  </label>
                </div>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your manga idea..."
                  className="w-full h-32 bg-transparent text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 resize-none focus:outline-none text-lg leading-relaxed font-medium z-10 relative"
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
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-mn-navy/30">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-mn-teal hover:text-mn-offwhite hover:underline uppercase tracking-wider"
                  >
                    ← Back
                  </button>
                  <span className="text-gray-300 dark:text-mn-navy/50">|</span>
                  <span className="text-xs text-gray-500 dark:text-mn-offwhite/70 truncate max-w-[200px] font-medium italic">"{prompt}"</span>
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
          <div className="p-4 bg-gray-50 dark:bg-mn-navy/30 border-t border-gray-100 dark:border-mn-navy/30 flex justify-between items-center rounded-b-xl">
             <div className="flex gap-2">
               <div className={`h-2 w-2 rounded-full transition-colors ${step === 1 ? 'bg-mn-teal' : 'bg-gray-300 dark:bg-mn-navy'}`} />
               <div className={`h-2 w-2 rounded-full transition-colors ${step === 2 ? 'bg-mn-teal' : 'bg-gray-300 dark:bg-mn-navy'}`} />
             </div>
             
             <button
               type="submit"
               disabled={!prompt.trim() || isLoading}
               className={`px-8 py-3 rounded-lg text-sm font-bold transition-all shadow-md active:transform active:scale-95 uppercase tracking-wide ${
                 isLoading 
                   ? 'bg-gray-200 text-gray-500 dark:bg-mn-navy dark:text-gray-500 cursor-wait' 
                   : 'bg-mn-teal text-white hover:bg-mn-teal/90 hover:shadow-lg dark:hover:shadow-mn-teal/20'
               }`}
             >
               {isLoading ? (
                 <span className="flex items-center gap-2">
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                   Crafting...
                 </span>
               ) : step === 1 ? (
                 'Continue' 
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
