import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InterstitialAdProps {
  onComplete: () => void;
}

export default function InterstitialAd({ onComplete }: InterstitialAdProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-4 bg-gray-100 dark:bg-zinc-800 flex justify-between items-center text-sm font-medium text-gray-500">
          <span>Advertisement</span>
          <span>{timeLeft > 0 ? `Reward in ${timeLeft}s` : 'Ready'}</span>
        </div>

        {/* Ad Container */}
        <div className="bg-gray-200 dark:bg-zinc-800 w-full aspect-video flex items-center justify-center relative overflow-hidden">
          
          {/* Placeholder for actual AdSense Unit */}
          <div className="text-center p-6">
            <p className="text-gray-400 mb-2">Google AdSense Display Ad</p>
            <p className="text-xs text-gray-500">(Configure Slot ID in code)</p>
          </div>

          {/* 
            TODO: Replace the above div with your actual AdSense code:
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-6023239200845388"
                 data-ad-slot="YOUR_AD_SLOT_ID"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          */}
        </div>

        {/* Action Button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={onComplete}
            disabled={timeLeft > 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-zinc-700 text-white rounded-lg font-bold transition-all"
          >
            {timeLeft > 0 ? `Skip in ${timeLeft}...` : 'Skip Ad & Continue >'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
