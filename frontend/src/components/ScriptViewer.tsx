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
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          {script.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generated Script</p>
      </div>

      <div className="grid gap-6">
        {script.panels.map((panel, index) => (
          <div 
            key={panel.id}
            className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 hover:border-blue-500/50 transition-colors"
          >
            <div className="absolute -left-3 -top-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
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
                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-100 dark:border-zinc-700/50">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dialogue</h4>
                    <p className="font-serif italic text-gray-700 dark:text-gray-300">
                      "{panel.dialogue}"
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Characters</h4>
                <div className="flex flex-wrap gap-2">
                  {panel.characters.length > 0 ? (
                    panel.characters.map((char) => (
                      <span 
                        key={char}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md"
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
          </div>
        ))}
      </div>
    </div>
  );
}
