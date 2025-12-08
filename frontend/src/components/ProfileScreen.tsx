import { FiUser, FiCode, FiImage, FiSettings, FiLogOut, FiActivity } from 'react-icons/fi';

interface ProfileScreenProps {
  userName: string;
  isPremium: boolean;
  onLogout: () => void;
  onUpgrade: () => void;
  usageStats: { images: number; scripts: number };
}

export default function ProfileScreen({ userName, isPremium, onLogout, onUpgrade, usageStats }: ProfileScreenProps) {
  const IMAGE_LIMIT = 50;
  const imagePercentage = Math.min((usageStats.images / IMAGE_LIMIT) * 100, 100);

  return (
    <div className="p-6 space-y-8 pt-12 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{userName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${isPremium ? 'bg-amber-400 text-black' : 'bg-neutral-700 text-neutral-300'}`}>
              {isPremium ? 'PREMIUM' : 'FREE MODEL'}
            </span>
          </div>
        </div>
      </div>

      {/* Credit Card (Safety Limits) */}
      <div className="rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-5 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <FiActivity size={80} />
        </div>
        
        <h3 className="text-sm font-bold text-neutral-400 uppercase mb-4 tracking-wider">Daily Usage Quota</h3>
        
        <div className="space-y-4 relative z-10">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-300">Images Generated</span>
              <span className="text-neutral-400">{usageStats.images} / {isPremium ? '∞' : IMAGE_LIMIT}</span>
            </div>
            <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-500 ${isPremium ? 'bg-amber-500' : 'bg-blue-500'}`} 
                style={{ width: `${isPremium ? 100 : imagePercentage}%` }}
              />
            </div>
            {!isPremium && (
               <p className="text-[10px] text-neutral-500 mt-1">
                 *Limit set to prevent accidental billing on your API key.
               </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
          <FiCode className="text-purple-400" size={24} />
          <span className="text-2xl font-bold">12</span>
          <span className="text-sm text-neutral-400">Chapters Created</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
          <FiImage className="text-blue-400" size={24} />
          <span className="text-2xl font-bold">48</span>
          <span className="text-sm text-neutral-400">Images Generated</span>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-neutral-500 uppercase px-1">Account</h3>
        
        {!isPremium && (
          <button 
            onClick={onUpgrade}
            className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/50 p-4 rounded-xl hover:bg-amber-500/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center">
                <span className="font-bold">★</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-amber-500">Upgrade to Premium</div>
                <div className="text-xs text-amber-300/80">Remove ads & unlock features</div>
              </div>
            </div>
          </button>
        )}

        <button className="w-full flex items-center gap-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors text-neutral-300">
          <FiSettings size={20} />
          <span>API Key Settings</span>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 bg-white/5 p-4 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors text-neutral-300"
        >
          <FiLogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
