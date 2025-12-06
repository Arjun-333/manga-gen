"use client";

import { useState } from "react";
import Image from "next/image";
import HealthCheck from "@/components/HealthCheck";
import StoryInput from "@/components/StoryInput";
import ScriptViewer from "@/components/ScriptViewer";
import CharacterViewer from "@/components/CharacterViewer";

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

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setScript(null);
    setCharacterSheet(null);
    
    try {
      // Generate Script
      const scriptRes = await fetch("http://127.0.0.1:8000/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!scriptRes.ok) throw new Error("Failed to generate script");
      const scriptData = await scriptRes.json();
      setScript(scriptData);

      // Generate Characters (Parallel or sequential, sequential for now to show progress)
      const charRes = await fetch("http://127.0.0.1:8000/generate/characters", {
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

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-50 dark:bg-zinc-950">
      <HealthCheck />
      
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Manga Chapter Generator
        </p>
      </div>

      <div className="relative flex place-items-center mb-16 before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-0">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500">
          Create Your Manga
        </h1>
      </div>

      <StoryInput onSubmit={handleGenerate} isLoading={isLoading} />

      {characterSheet && <CharacterViewer characterSheet={characterSheet} />}
      {script && <ScriptViewer script={script} />}

      {!script && !isLoading && (
        <div className="mt-24 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-2 gap-8">
          <div className="group rounded-xl border border-gray-200 dark:border-zinc-800 px-5 py-8 transition-colors hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
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

          <div className="group rounded-xl border border-gray-200 dark:border-zinc-800 px-5 py-8 transition-colors hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/20">
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
    </main>
  );
}
