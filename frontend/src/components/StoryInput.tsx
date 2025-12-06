"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function StoryInput({ onSubmit, isLoading }: StoryInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
        <div className="relative bg-white dark:bg-zinc-900 rounded-xl p-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your manga story here... (e.g. A cyberpunk detective hunting a rogue android in Neo-Tokyo)"
            className="w-full h-32 p-4 rounded-lg border-0 bg-transparent focus:ring-0 resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            disabled={isLoading}
          />
          <div className="flex justify-end p-2 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-white shadow-lg",
                isLoading || !prompt.trim() 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 hover:shadow-pink-500/25"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Script
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
