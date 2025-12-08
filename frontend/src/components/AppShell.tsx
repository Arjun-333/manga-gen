import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit3, FiGrid, FiUser } from 'react-icons/fi';

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-hide pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-900/80 backdrop-blur-xl border-t border-white/5 pb-4 px-6 z-40">
        <div className="flex items-center justify-around h-full max-w-md mx-auto">
          <NavButton 
            icon={<FiEdit3 size={24} />} 
            label="Create" 
            isActive={activeTab === 'create'} 
            onClick={() => onTabChange('create')} 
          />
          <NavButton 
            icon={<FiGrid size={24} />} 
            label="Library" 
            isActive={activeTab === 'library'} 
            onClick={() => onTabChange('library')} 
          />
          <NavButton 
            icon={<FiUser size={24} />} 
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
      className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${isActive ? 'text-white' : 'text-neutral-500'}`}
    >
      <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-white/10 scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
