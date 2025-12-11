import Image from "next/image";
import { useState } from "react";

interface Panel {
  id: number;
  description: string;
  dialogue: string | null;
  characters: string[];
}

interface MangaPageViewerProps {
  panels: Panel[];
  images: Record<number, string>;
  onGenerateImage: (panelId: number, style: "preview" | "final") => void;
  isGenerating: Record<number, boolean>;
  onPanelUpdate?: (id: number, newDescription: string) => void;
}

export default function MangaPageViewer({ panels, images, onGenerateImage, isGenerating, onPanelUpdate }: MangaPageViewerProps) {
  const [selectedStyle, setSelectedStyle] = useState<"preview" | "final">("preview");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-32">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Panel Generation
          </h2>
          <p className="text-sm text-gray-500 mt-1">Review descriptions and generate visuals</p>
        </div>

        {/* Professional Segmented Control */}
        <div className="inline-flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setSelectedStyle("preview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedStyle === "preview"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Draft Mode
          </button>
          <button
            onClick={() => setSelectedStyle("final")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedStyle === "final"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            High Quality
          </button>
        </div>
      </div>

      {/* Panels List */}
      <div className="space-y-6">
        {panels.map((panel, index) => (
          <div 
            key={panel.id} 
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Panel Header */}
            <div className="px-6 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Panel {index + 1}
              </span>
              <span className="text-xs text-gray-400">
                {images[panel.id] ? "Generated" : "Pending"}
              </span>
            </div>

            <div className="p-0">
              {images[panel.id] ? (
                /* Generated Image - Clean View */
                <div className="relative bg-gray-100 dark:bg-black">
                  {/* Aspect Ratio Container */}
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src={images[panel.id]}
                      alt={panel.description}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  
                  {panel.dialogue && (
                    <div className="border-t border-gray-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center italic">
                        "{panel.dialogue}"
                      </p>
                    </div>
                  )}

                  {/* Re-generate Overlay (appears on hover) */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     {/* Could add regenerate button here later */}
                  </div>
                </div>
              ) : (
                /* Edit & Generate View */
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Visual Description
                    </label>
                    {onPanelUpdate ? (
                      <textarea 
                        value={panel.description}
                        onChange={(e) => onPanelUpdate(panel.id, e.target.value)}
                        className="w-full h-32 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-black border border-gray-300 dark:border-zinc-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder:text-gray-400 transition-all font-mono"
                        placeholder="Describe the scene..."
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                        {panel.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <button
                      onClick={() => onGenerateImage(panel.id, selectedStyle)}
                      disabled={isGenerating[panel.id]}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedStyle === "preview" 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {isGenerating[panel.id] ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Generate Image (${selectedStyle === "preview" ? "Draft" : "HD"})`
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Est. time: {selectedStyle === "preview" ? "~5s" : "~12s"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
