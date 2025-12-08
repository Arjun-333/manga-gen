import { useState, useEffect } from 'react';
import TrueFocus from './TrueFocus';
import { motion } from 'framer-motion';

interface LoginScreenProps {
  onLogin: (name: string, apiKey: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [step, setStep] = useState(1);

  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && apiKey) {
      setIsValidating(true);
      setError('');
      
      try {
        const res = await fetch('http://localhost:8000/auth/validate', {
          headers: { 'x-gemini-api-key': apiKey }
        });
        
        if (res.ok) {
          onLogin(name, apiKey);
        } else {
          setError('Invalid API Key. Please check and try again.');
        }
      } catch (err) {
        setError('Connection failed. Is the backend running?');
      } finally {
        setIsValidating(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 z-50 text-white overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center gap-12">
        <div className="w-full">
          <TrueFocus 
            sentence="Manga Gen"
            manualMode={false}
            blurAmount={5}
            borderColor="#a855f7"
            glowColor="rgba(168, 85, 247, 0.4)"
            animationDuration={0.8}
          />
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-center mb-6">
              {step === 1 ? 'Welcome Creator' : 'Connect AI'}
            </h2>
            
            {step === 1 ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-neutral-400 ml-1">What should we call you?</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-neutral-600"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => name && setStep(2)}
                  disabled={!name}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-neutral-400 ml-1">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="paste your key here"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-neutral-600"
                    autoFocus
                  />
                  <p className="text-xs text-neutral-500 px-1">
                    Your key is stored locally on your device properly.
                  </p>
                  {error && (
                    <p className="text-xs text-red-400 px-1 font-bold animate-pulse">
                      {error}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isValidating}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!apiKey || isValidating}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                  >
                    {isValidating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Checking...
                      </>
                    ) : (
                      'Enter App'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
