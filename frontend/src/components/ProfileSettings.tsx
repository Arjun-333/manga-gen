import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiKey, FiLogOut, FiDatabase, FiTrash2, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from "../config";

interface ProfileSettingsProps {
  name: string;
  email: string;
  onLogout: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  hfToken: string; 
  setHfToken: (token: string) => void;
}

export default function ProfileSettings({ name, email, onLogout, apiKey, setApiKey, hfToken, setHfToken }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'workspace'>('account');
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [newKey, setNewKey] = useState(apiKey);
  
  // Real Stats
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPanels, setTotalPanels] = useState(0);

  useEffect(() => {
     // Fetch stats on mount
     const fetchStats = async () => {
        try {
           const res = await fetch(`${API_BASE_URL}/projects`);
           if (res.ok) {
              const projects = await res.json();
              setTotalProjects(projects.length);
              const panels = projects.reduce((acc: number, p: any) => acc + (p.panel_count || 0), 0);
              setTotalPanels(panels);
           }
        } catch (err) {
           console.error("Failed to fetch stats", err);
        }
     };
     fetchStats();
  }, []);

  const handleUpdateKey = () => {
    setApiKey(newKey);
    setIsEditingKey(false);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <FiUser /> },
    { id: 'workspace', label: 'Workspace Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="max-w-5xl mx-auto pt-10 px-6 h-full flex flex-col md:flex-row gap-10">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
           <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Manga Gen Studio</p>
        </div>
        
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl space-y-8">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.3, ease: "easeOut" }}
           className="space-y-8"
        >
          {activeTab === 'account' && (
            <div className="space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-6 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-500 border-4 border-white dark:border-zinc-900 box-content shadow-lg">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{email}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Active Developer
                  </p>
                </div>
              </div>

               {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Projects Created</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalProjects}</p>
                 </div>
                 <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Panels</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPanels}</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-8">
               
               {/* API Key Section */}
               <section>
                 <div className="flex items-center gap-2 mb-4">
                    <FiKey className="text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">API Configuration</h3>
                 </div>
                 
                 <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">Gemini Project Key</label>
                          <p className="text-xs text-gray-500 mt-1">Required for LLM inference (Script & Character gen).</p>
                       </div>
                       {!isEditingKey && (
                          <button 
                             onClick={() => { setIsEditingKey(true); setNewKey(apiKey); }}
                             className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                          >
                             Rotate Key
                          </button>
                       )}
                    </div>

                    {isEditingKey ? (
                      <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <input 
                          type="text" 
                          value={newKey}
                          onChange={(e) => setNewKey(e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 outline-none"
                          placeholder="Paste new API key..."
                          autoFocus
                        />
                        <button 
                          onClick={handleUpdateKey}
                          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setIsEditingKey(false)}
                          className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
                         <code className="text-sm font-mono text-gray-600 dark:text-gray-400">
                            {apiKey.substring(0, 12)}••••••••••••••••
                         </code>
                         <span className="flex items-center gap-2 text-xs text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Connected
                         </span>
                      </div>
                    )}
                 </div>
               </section>

               {/* Hugging Face Token Section */}
               <section>
                 <div className="flex items-center gap-2 mb-4">
                    <FiKey className="text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Image Generation Token</h3>
                 </div>
                 
                 <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">Hugging Face Token</label>
                          <p className="text-xs text-gray-500 mt-1">Required for generating images. Your own usage quota applies.</p>
                       </div>
                       <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:text-blue-500 underline">
                          Get Free Token
                       </a>
                    </div>
                    
                    <input 
                       type="password" 
                       value={hfToken}
                       onChange={(e) => setHfToken(e.target.value)}
                       className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500/20 outline-none"
                       placeholder="hf_..."
                    />
                    <p className="text-xs text-gray-400 mt-2">
                       Saved locally to your browser. Not stored on our servers.
                    </p>
                 </div>
               </section>

               {/* Data Management Section */}
               <section>
                 <div className="flex items-center gap-2 mb-4">
                    <FiDatabase className="text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Data Management</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:border-gray-300 dark:hover:border-zinc-700 transition-colors group text-left shadow-sm">
                       <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg mb-3 group-hover:bg-blue-100">
                          <FiDownload size={20} />
                       </div>
                       <div className="font-bold text-gray-900 dark:text-white text-sm">Export Workspace Data</div>
                       <div className="text-xs text-gray-500 mt-1">Download all projects as JSON archive</div>
                    </button>

                    <button className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl hover:border-red-200 dark:hover:border-red-900/50 transition-colors group text-left shadow-sm">
                       <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg mb-3 group-hover:bg-red-100">
                          <FiTrash2 size={20} />
                       </div>
                       <div className="font-bold text-gray-900 dark:text-white text-sm">Clear Application Cache</div>
                       <div className="text-xs text-gray-500 mt-1">Freshen up local storage and drafts</div>
                    </button>
                 </div>
               </section>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
