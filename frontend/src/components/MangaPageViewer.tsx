import Image from "next/image";
import { useState } from "react";
import { FiRefreshCw, FiEdit2, FiCheck } from "react-icons/fi";

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
  const [editingPanelId, setEditingPanelId] = useState<number | null>(null);

  // If we are regenerating, we should close the edit mode? Or keep it open?
  // Let's close it when generation starts in parent (via useEffect) or just manually here.
  
  const handleGenerate = (panelId: number) => {
    onGenerateImage(panelId, selectedStyle);
    setEditingPanelId(null);
  };

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
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            {/* Panel Header */}
            <div className="px-6 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Panel {index + 1}
              </span>
              <div className="flex items-center gap-2">
                 {images[panel.id] && !editingPanelId && (
                    <button 
                       onClick={() => setEditingPanelId(panel.id)}
                       className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                       <FiEdit2 size={12} /> Edit Prompt
                    </button>
                 )}
                 <span className={`text-xs ${images[panel.id] ? "text-green-500" : "text-gray-400"}`}>
                   {images[panel.id] ? "Generated" : "Pending"}
                 </span>
              </div>
            </div>

            <div className="p-0">
              {images[panel.id] && editingPanelId !== panel.id ? (
                /* Generated Image - Clean View */
                <div className="relative bg-gray-100 dark:bg-black group">
                  {/* Aspect Ratio Container */}
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src={images[panel.id]}
                      alt={panel.description}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                     {/* Hover Overlay for Quick Actions */}
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button 
                           onClick={() => setEditingPanelId(panel.id)}
                           className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                           <FiEdit2 /> Refine
                        </button>
                     </div>
                  </div>
                  
                  {panel.dialogue && (
                    <div className="border-t border-gray-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center italic">
                        "{panel.dialogue}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Edit & Generate View */
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                         Visual Description
                       </label>
                       {/* Cancel Button if we have an image to go back to */}
                       {images[panel.id] && (
                          <button 
                             onClick={() => setEditingPanelId(null)}
                             className="text-xs text-gray-400 hover:text-gray-600"
                          >
                             Cancel
                          </button>
                       )}
                    </div>
                    
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
                      onClick={() => handleGenerate(panel.id)}
                      disabled={isGenerating[panel.id]}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedStyle === "preview" 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {isGenerating[panel.id] ? (
                        <span className="flex items-center justify-center gap-2">
                          <FiRefreshCw className="animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                           {images[panel.id] ? <FiRefreshCw /> : <FiCheck />}
                           {images[panel.id] ? "Regenerate Image" : `Generate Image (${selectedStyle === "preview" ? "Draft" : "HD"})`}
                        </span>
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
