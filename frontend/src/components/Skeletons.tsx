import React from 'react';
import { motion } from 'framer-motion';

export const ScriptSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Script Header Skeleton */}
      <div className="h-10 bg-mn-blue/20 dark:bg-mn-teal/10 rounded-lg w-1/3 mb-8" />
      
      {/* Panel Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-mn-blue p-6 rounded-xl border border-gray-100 dark:border-mn-teal/20 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 dark:bg-mn-navy/50 rounded w-1/4" />
            <div className="h-6 bg-gray-200 dark:bg-mn-navy/50 rounded w-16" />
          </div>
          <div className="h-20 bg-gray-100 dark:bg-mn-navy/30 rounded-lg w-full" />
        </div>
      ))}
    </div>
  );
};

export const PanelSkeleton = () => {
    return (
        <div className="relative aspect-[2/3] bg-mn-blue/10 dark:bg-mn-navy/50 rounded-lg overflow-hidden flex items-center justify-center border border-mn-teal/10">
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-mn-teal/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
            <div className="flex flex-col items-center gap-2 text-mn-teal/40">
                <div className="w-8 h-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider">Generating Art...</span>
            </div>
        </div>
    );
}

export const ProjectCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-mn-blue border border-gray-200 dark:border-mn-teal/20 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 dark:bg-mn-navy/50 w-full" />
            <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-mn-navy/50 rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-mn-navy/30 rounded w-1/2" />
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-mn-navy/20 flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-mn-navy/50 rounded w-12" />
                    <div className="h-8 bg-gray-200 dark:bg-mn-navy/50 rounded-full w-20" />
                </div>
            </div>
        </div>
    );
}
