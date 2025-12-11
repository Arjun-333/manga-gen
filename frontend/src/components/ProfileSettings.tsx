import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiCreditCard, FiLogOut, FiTrash2, FiKey, FiImage } from 'react-icons/fi';

interface ProfileSettingsProps {
  name: string;
  email: string;
  onLogout: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  hfToken: string; // If we wanted to manage this on frontend, but currently server-side env
}

export default function ProfileSettings({ name, email, onLogout, apiKey, setApiKey }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'api' | 'preferences'>('account');
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [newKey, setNewKey] = useState(apiKey);

  const handleUpdateKey = () => {
    setApiKey(newKey);
    setIsEditingKey(false);
    // Ideally validate again here
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <FiUser /> },
    { id: 'api', label: 'API Keys', icon: <FiKey /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings /> },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4 h-full flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-2">
        <div className="mb-8 px-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">Manage your workspace</p>
        </div>
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === tab.id
                ? 'bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800 mt-8">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-[500px] bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-8">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.2 }}
           className="h-full"
        >
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{email}</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Manga Pro Plan (Free)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <StatCard label="Stories Created" value="12" icon={<FiImage />} />
                 <StatCard label="Panels Generated" value="84" icon={<FiCreditCard />} />
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Gemini Project Key</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Used for story and character generation.</p>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Current Key</label>
                  {!isEditingKey && (
                    <button 
                      onClick={() => { setIsEditingKey(true); setNewKey(apiKey); }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Change Key
                    </button>
                  )}
                </div>
                
                {isEditingKey ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      className="flex-1 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono"
                    />
                    <button 
                      onClick={handleUpdateKey}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditingKey(false)}
                      className="text-gray-500 px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
                    {apiKey.substring(0, 8)}...{apiKey.substring(apiKey.length - 8)}
                  </div>
                )}
              </div>
              
               <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Status: Active</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Your connection to Google AI Studio is operational.</p>
               </div>
            </div>
          )}

          {activeTab === 'preferences' && (
             <div className="space-y-6">
               <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Application Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your local storage</p>
               </div>
               
               <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group text-left">
                     <div>
                        <div className="font-semibold text-red-600 group-hover:text-red-700">Clear Local Cache</div>
                        <div className="text-xs text-gray-500">Removes temporary images and drafts</div>
                     </div>
                     <FiTrash2 className="text-red-500" />
                  </button>
               </div>
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center gap-4">
      <div className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
