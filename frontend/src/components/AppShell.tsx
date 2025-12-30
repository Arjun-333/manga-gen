import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit3, FiGrid, FiUser, FiMessageSquare } from 'react-icons/fi';

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-mn-offwhite dark:bg-mn-navy text-mn-navy dark:text-mn-offwhite overflow-hidden transition-colors duration-200">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
            className="min-h-full max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-mn-navy border-t-2 border-mn-blue pb-5 pt-3 z-50">
        <div className="flex items-center justify-around h-full max-w-lg mx-auto px-4">
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
            icon={<FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />} 
            label="Forum" 
            isActive={activeTab === 'forum'} 
            onClick={() => onTabChange('forum')} 
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
      className={`flex flex-col items-center justify-center gap-1 w-20 sm:w-24 h-full rounded-xl transition-all duration-200 active:scale-95 group ${
        isActive ? 'text-mn-teal' : 'text-gray-400 hover:text-mn-offwhite'
      }`}
    >
      <div className={`p-1.5 rounded-xl transition-all duration-200 ${
        isActive ? 'bg-mn-blue/20 -translate-y-1' : ''
      }`}>
        <div className="w-6 h-6 flex items-center justify-center child:w-full child:h-full">
           {icon}
        </div>
      </div>
      <span className={`text-[10px] sm:text-xs font-bold transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>
        {label}
      </span>
    </button>
  );
}
