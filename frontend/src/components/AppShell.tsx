import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit3, FiGrid, FiUser } from 'react-icons/fi';

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden transition-colors duration-200">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
            className="min-h-full max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-gray-100 dark:border-zinc-800 pb-5 z-50">
        <div className="flex items-center justify-around h-full max-w-lg mx-auto">
          <NavButton 
            icon={<FiEdit3 className="w-5 h-5 sm:w-6 sm:h-6" />} 
            label="Create" 
            isActive={activeTab === 'create'} 
            onClick={() => onTabChange('create')} 
          />
          <NavButton 
            icon={<FiGrid className="w-5 h-5 sm:w-6 sm:h-6" />} 
            label="Library" 
            isActive={activeTab === 'library'} 
            onClick={() => onTabChange('library')} 
          />
          <NavButton 
            icon={<FiUser className="w-5 h-5 sm:w-6 sm:h-6" />} 
            label="Profile" 
            isActive={activeTab === 'profile'} 
            onClick={() => onTabChange('profile')} 
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-20 sm:w-24 h-16 sm:h-20 rounded-xl transition-all duration-200 active:scale-95 group ${
        isActive ? 'text-blue-600 dark:text-white' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
      }`}
    >
      <div className={`p-1.5 rounded-xl transition-all duration-200 ${
        isActive ? 'bg-blue-50 dark:bg-zinc-800 -translate-y-1' : 'group-hover:bg-gray-50 dark:group-hover:bg-zinc-900'
      }`}>
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center child:w-full child:h-full">
           {icon}
        </div>
      </div>
      <span className={`text-[10px] sm:text-xs font-medium transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>
        {label}
      </span>
    </button>
  );
}
