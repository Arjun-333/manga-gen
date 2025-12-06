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
}

export default function MangaPageViewer({ panels, images, onGenerateImage, isGenerating }: MangaPageViewerProps) {
  const [selectedStyle, setSelectedStyle] = useState<"preview" | "final">("preview");

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600">
            Manga Preview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Generated Panels</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setSelectedStyle("preview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedStyle === "preview"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Preview Mode (Fast)
          </button>
          <button
            onClick={() => setSelectedStyle("final")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedStyle === "final"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Final Mode (High Quality)
          </button>
        </div>
      </div>

      <div className="space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800">
        {panels.map((panel) => (
          <div key={panel.id} className="relative group">
            {images[panel.id] ? (
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border-4 border-black dark:border-zinc-700 shadow-lg">
                <Image
                  src={images[panel.id]}
                  alt={panel.description}
                  fill
                  className="object-cover"
                />
                {panel.dialogue && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 p-3 rounded-lg border-2 border-black text-center">
                    <p className="font-anime text-sm font-bold text-black dark:text-white">
                      {panel.dialogue}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <p className="text-sm text-gray-500">{panel.description}</p>
                <button
                  onClick={() => onGenerateImage(panel.id, selectedStyle)}
                  disabled={isGenerating[panel.id]}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    selectedStyle === "preview" 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {isGenerating[panel.id] ? "Generating..." : `Generate (${selectedStyle})`}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
