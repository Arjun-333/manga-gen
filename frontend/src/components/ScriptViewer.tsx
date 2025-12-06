import { motion } from "framer-motion";
import { Scroll, User } from "lucide-react";

interface Panel {
  id: number;
  description: string;
  dialogue: string | null;
  characters: string[];
}

interface ScriptResponse {
  title: string;
  panels: Panel[];
}

interface ScriptViewerProps {
  script: ScriptResponse;
}

export default function ScriptViewer({ script }: ScriptViewerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto mt-12 space-y-8"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
          <Scroll className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          {script.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generated Script</p>
      </div>

      <div className="grid gap-6">
        {script.panels.map((panel, index) => (
          <motion.div 
            key={panel.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
              {index + 1}
            </div>
            
            <div className="grid md:grid-cols-[1fr_200px] gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Visual Description</h4>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {panel.description}
                  </p>
                </div>
                
                {panel.dialogue && (
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-100 dark:border-zinc-700/50 relative">
                    <div className="absolute -left-1 top-4 w-1 h-8 bg-blue-500 rounded-full"></div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 pl-2">Dialogue</h4>
                    <p className="font-serif italic text-gray-700 dark:text-gray-300 pl-2">
                      "{panel.dialogue}"
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3" /> Characters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {panel.characters.length > 0 ? (
                    panel.characters.map((char) => (
                      <span 
                        key={char}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800"
                      >
                        {char}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">None</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
