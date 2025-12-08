import { useState } from 'react';
import TrueFocus from './TrueFocus';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface LoginScreenProps {
  onLogin: (name: string, apiKey: string) => void;
}

// Inner component to use the hook context
function LoginContent({ onLogin, step, setStep, setAuthMode, authMode, name, setName, email, setEmail, password, setPassword, apiKey, setApiKey, isLoading, setIsLoading, isValidatingKey, setIsValidatingKey, error, setError, handleKeySubmit }: any) {
  
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
      // For implicit flow/user info, we might need a different approach or verify the token. 
      // But typically with useGoogleLogin (implicit), we get an access token to fetch user info.
      // Alternatively, we can use the credential flow. Let's fetch user info with the access token.
      setIsLoading(true);
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${codeResponse.access_token}` },
      })
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setEmail(data.email);
        setStep(2); // Proceed to Key Setup
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <div className="w-full max-w-md z-10 flex flex-col items-center gap-8">
        <div className="w-full scale-90 md:scale-100 transition-transform">
          <TrueFocus 
            sentence="Manga Gen"
            manualMode={false}
            blurAmount={5}
            borderColor="#a855f7"
            glowColor="rgba(168, 85, 247, 0.4)"
            animationDuration={0.8}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl">
                  <button 
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    Register
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="hello@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl mt-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/40 px-2 text-neutral-500">Or continue with</span></div>
                </div>

                <button 
                  onClick={() => login()}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-all group"
                >
                  <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-neutral-200">Google</span>
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
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    Connect Intelligence
                  </h3>
                  <p className="text-sm text-neutral-400">
                     Hello <span className="text-white font-bold">{name}</span>! Link your AI account.
                  </p>
                </div>

                <form onSubmit={handleKeySubmit} className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-500 ml-1 uppercase">Gemini API Key</label>
                      <input 
                        type="password" 
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="Paste AIza... key here"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                        autoFocus
                      />
                      {error && (
                        <p className="text-xs text-red-400 font-bold px-1 animate-pulse">{error}</p>
                      )}
                      
                      <div className="flex justify-end">
                        <a 
                          href="https://aistudio.google.com/app/apikey" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                        >
                          Don't have a key? Get one from Google →
                        </a>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={!apiKey || isValidatingKey}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                      {isValidatingKey ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Verifying Key...
                         </>
                      ) : (
                         'Launch Studio'
                      )}
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="w-full text-xs text-neutral-500 hover:text-neutral-300 py-2"
                    >
                      ← Back to Login
                    </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-xs text-neutral-600">
           By continuing, you agree to our Terms of Service.
        </p>
        <p className="text-[10px] text-neutral-800 font-mono mt-2">
           DEBUG ID: {(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Mock-Client-ID").substring(0, 15)}...
        </p>
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
  
  // Re-define key submit handler here since it depends on props & state
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
        setError('Invalid API Key. Please check your Gemini key.');
      }
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    } finally {
      setIsValidatingKey(false);
    }
  };

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "Mock-Client-ID"; 
  console.log("DEBUG: Loaded Google Client ID:", CLIENT_ID); // Debugging line
  // If no client ID, the provider might warn, but user has been notified to add it.

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 z-50 text-white overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <GoogleOAuthProvider clientId={CLIENT_ID}>
         <LoginContent 
            {...props} 
            {...{authMode, setAuthMode, step, setStep, email, setEmail, password, setPassword, name, setName, apiKey, setApiKey, isLoading, setIsLoading, isValidatingKey, setIsValidatingKey, error, setError, handleKeySubmit}} 
         />
      </GoogleOAuthProvider>
    </div>
  );
}
