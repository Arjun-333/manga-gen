"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import HealthCheck from "@/components/HealthCheck";
import StoryInput from "@/components/StoryInput";
import ScriptViewer from "@/components/ScriptViewer";
import CharacterViewer from "@/components/CharacterViewer";
import MangaPageViewer from "@/components/MangaPageViewer";

// Dynamically import Konva component to avoid SSR issues
const ChapterEditor = dynamic(() => import("@/components/ChapterEditor"), {
  ssr: false,
});

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

interface Character {
  name: string;
  description: string;
  personality: string;
  appearance: string;
}

interface CharacterSheetResponse {
  characters: Character[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [characterSheet, setCharacterSheet] = useState<CharacterSheetResponse | null>(null);
  const [panelImages, setPanelImages] = useState<Record<number, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState<Record<number, boolean>>({});
  const [mode, setMode] = useState<"preview" | "editor">("preview");

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setScript(null);
    setCharacterSheet(null);
    setPanelImages({});
    setMode("preview");
    
    try {
      // Generate Script
      const scriptRes = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!scriptRes.ok) throw new Error("Failed to generate script");
      const scriptData = await scriptRes.json();
      setScript(scriptData);

      // Generate Characters
      const charRes = await fetch("/api/generate/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!charRes.ok) throw new Error("Failed to generate characters");
      const charData = await charRes.json();
      setCharacterSheet(charData);

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (panelId: number, style: "preview" | "final") => {
    if (!script) return;
    const panel = script.panels.find(p => p.id === panelId);
    if (!panel) return;

    setIsGeneratingImage(prev => ({ ...prev, [panelId]: true }));

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panel_id: panelId,
          description: panel.description,
          characters: panel.characters,
          style: style
        }),
      });

      if (!response.ok) throw new Error("Failed to generate image");
      const data = await response.json();
      setPanelImages(prev => ({ ...prev, [panelId]: data.image_url }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate image");
    } finally {
      setIsGeneratingImage(prev => ({ ...prev, [panelId]: false }));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50 dark:bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <HealthCheck />
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Manga Chapter Generator
        </p>
      </div>

      <div className="relative flex place-items-center mb-16 z-10">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 tracking-tight">
          Create Your Manga
        </h1>
      </div>

      <div className="z-10 w-full">
        <StoryInput onSubmit={handleGenerate} isLoading={isLoading} />

        {characterSheet && <CharacterViewer characterSheet={characterSheet} />}
        
        {script && (
          <>
            <div className="w-full max-w-4xl mx-auto mt-12 flex justify-center gap-4 bg-white/50 dark:bg-zinc-900/50 p-2 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-zinc-800">
              <button
                onClick={() => setMode("preview")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  mode === "preview" 
                    ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-md transform scale-105" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Script & Preview
              </button>
              <button
                onClick={() => setMode("editor")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  mode === "editor" 
                    ? "bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-md transform scale-105" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Chapter Editor
              </button>
            </div>

            {mode === "preview" ? (
              <>
                <ScriptViewer script={script} />
                <MangaPageViewer 
                  panels={script.panels} 
                  images={panelImages} 
                  onGenerateImage={handleGenerateImage}
                  isGenerating={isGeneratingImage}
                />
              </>
            ) : (
              <ChapterEditor panels={script.panels} images={panelImages} />
            )}
          </>
        )}

        {!script && !isLoading && (
          <div className="mt-24 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-2 gap-8 mx-auto">
            <div className="group rounded-xl border border-gray-200 dark:border-zinc-800 px-5 py-8 transition-all hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:shadow-xl hover:shadow-blue-500/10">
              <h2 className="mb-3 text-2xl font-semibold">
                Preview Mode{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 text-sm opacity-50">
                Fast generation for quick iteration. Perfect for storyboarding.
              </p>
            </div>

            <div className="group rounded-xl border border-gray-200 dark:border-zinc-800 px-5 py-8 transition-all hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 hover:shadow-xl hover:shadow-purple-500/10">
              <h2 className="mb-3 text-2xl font-semibold">
                Final Mode{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 text-sm opacity-50">
                High quality output with consistent characters and layouts.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
