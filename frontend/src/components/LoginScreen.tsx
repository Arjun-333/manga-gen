import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

interface LoginScreenProps {
  onLogin: (name: string, apiKey: string) => void;
}

// Inner component to use the hook context
function LoginContent({ onLogin, step, setStep, authMode, setAuthMode, name, setName, email, setEmail, password, setPassword, apiKey, setApiKey, isLoading, setIsLoading, isValidatingKey, setIsValidatingKey, error, setError, handleKeySubmit }: any) {
  
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (authMode === 'register' && !name)) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulating email login
    setIsLoading(false);
    if (authMode === 'login' && !name) setName(email.split('@')[0]); 
    setStep(2);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setIsLoading(true);
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${codeResponse.access_token}` },
      })
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setEmail(data.email);
        setStep(2); 
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <div className="w-full max-w-md p-6">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Manga Gen
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Professional Storyboarding & Visualization Platform
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                      authMode === 'login' 
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                      authMode === 'register' 
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : (authMode === 'login' ? 'Continue' : 'Create Account')}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-zinc-700"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-2 text-gray-400">Or continue with</span></div>
                </div>

                <button 
                  onClick={() => login()}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <FcGoogle className="text-xl" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">Google</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636 11.364 8.364 9.636 6.636 8.364 6.828 5.743 2.257A6 6 0 114 4h1.5M12 4v20m8-12v.01M8 8v.01M12 16l4-5h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Connect API Key
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     Welcome, <span className="font-semibold text-gray-900 dark:text-white">{name}</span>. configure your access key to properly initialize the workspace.
                  </p>
                </div>

                <form onSubmit={handleKeySubmit} className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">Gemini Project Key</label>
                      <input 
                        type="password" 
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="Paste key here..."
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                        autoFocus
                      />
                      {error && (
                        <p className="text-xs text-red-500 font-semibold px-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {error}
                        </p>
                      )}
                      
                      <div className="flex justify-end pt-1">
                        <a 
                          href="https://aistudio.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Get API credentials →
                        </a>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={!apiKey || isValidatingKey}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isValidatingKey ? (
                         <>
                           <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Validating...
                         </>
                      ) : (
                         'Initialize Workspace'
                      )}
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="w-full text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 py-2 font-medium"
                    >
                      ← Back to Login
                    </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
           © 2024 Manga Gen Enterprise. All rights reserved.
        </div>
    </div>
  );
}

export default function LoginScreen(props: LoginScreenProps) {
  // Lifted state to pass to inner component
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [error, setError] = useState('');
  
  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;
    setIsValidatingKey(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/auth/validate', {
        headers: { 'x-gemini-api-key': apiKey }
      });
      if (res.ok) {
        props.onLogin(name, apiKey);
      } else {
        setError('Invalid API Key provided.');
      }
    } catch (err) {
      setError('Connection failed. Service unavailable.');
    } finally {
      setIsValidatingKey(false);
    }
  };

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Mock-Client-ID"; 

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-black flex flex-col items-center justify-center font-sans">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
         <LoginContent 
            {...props} 
            {...{authMode, setAuthMode, step, setStep, email, setEmail, password, setPassword, name, setName, apiKey, setApiKey, isLoading, setIsLoading, isValidatingKey, setIsValidatingKey, error, setError, handleKeySubmit}} 
         />
      </GoogleOAuthProvider>
    </div>
  );
}
