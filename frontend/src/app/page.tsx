"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoginScreen from "@/components/LoginScreen";
import AppShell from "@/components/AppShell";
import ProfileScreen from "@/components/ProfileScreen";
import StoryInput from "@/components/StoryInput";
import ScriptViewer from "@/components/ScriptViewer";
import CharacterViewer from "@/components/CharacterViewer";
import MangaPageViewer from "@/components/MangaPageViewer";

// Dynamically import Konva component
const ChapterEditor = dynamic(() => import("@/components/ChapterEditor"), { ssr: false });

export default function Home() {
  // App State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [isPremium, setIsPremium] = useState(false);

  // Content State
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<any>(null);
  const [characterSheet, setCharacterSheet] = useState<any>(null);
  const [panelImages, setPanelImages] = useState<Record<number, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Check for saved credentials
    const savedName = localStorage.getItem("manga_user_name");
    const savedKey = localStorage.getItem("manga_api_key");
    const savedPremium = localStorage.getItem("manga_is_premium") === "true";

    if (savedName && savedKey) {
      setUserName(savedName);
      setApiKey(savedKey);
      setIsPremium(savedPremium);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (name: string, key: string) => {
    localStorage.setItem("manga_user_name", name);
    localStorage.setItem("manga_api_key", key);
    setUserName(name);
    setApiKey(key);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("manga_user_name");
    localStorage.removeItem("manga_api_key");
    setIsLoggedIn(false);
    setUserName("");
    setApiKey("");
    setScript(null);
  };

  const handleUpgrade = () => {
    // Mock upgrade flow
    const confirmed = confirm("Mock Payment: Pay ₹499 for Premium?");
    if (confirmed) {
      localStorage.setItem("manga_is_premium", "true");
      setIsPremium(true);
      alert("Welcome to Premium!");
    }
  };

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setScript(null);
    setCharacterSheet(null);
    setPanelImages({});

    try {
      // 1. Generate Script
      const scriptRes = await fetch("/api/generate/script", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-api-key": apiKey 
        },
        body: JSON.stringify({ prompt }),
      });
      if (!scriptRes.ok) throw new Error("Failed to generate script");
      const scriptData = await scriptRes.json();
      setScript(scriptData);

      // 2. Generate Characters
      const charRes = await fetch("/api/generate/characters", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-api-key": apiKey 
        },
        body: JSON.stringify({ prompt }),
      });
      if (!charRes.ok) throw new Error("Failed to generate characters");
      const charData = await charRes.json();
      setCharacterSheet(charData);

    } catch (error) {
      console.error(error);
      alert("Generation failed. Check your API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (panelId: number, style: "preview" | "final") => {
    if (!script) return;
    const panel = script.panels.find((p: any) => p.id === panelId);
    if (!panel) return;

    // FREEMIUM LOGIC: Show Ad if not premium
    if (!isPremium) {
      // Mock Ad Delay
      // In a real app, show AdMob interstitial here
      await new Promise(resolve => setTimeout(resolve, 1500)); 
    }

    setIsGeneratingImage(prev => ({ ...prev, [panelId]: true }));
    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-api-key": apiKey 
        },
        body: JSON.stringify({
          panel_id: panelId,
          description: panel.description,
          characters: panel.characters,
          style: style
        }),
      });

      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setPanelImages(prev => ({ ...prev, [panelId]: data.image_url }));
    } catch (error) {
      alert("Image generation failed");
    } finally {
      setIsGeneratingImage(prev => ({ ...prev, [panelId]: false }));
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      
      {activeTab === 'profile' && (
        <ProfileScreen 
          userName={userName} 
          isPremium={isPremium} 
          onLogout={handleLogout} 
          onUpgrade={handleUpgrade}
        />
      )}

      {activeTab === 'library' && (
        <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-4 mt-20">
          <div className="p-4 bg-white/5 rounded-full">
            <span className="text-4xl">📚</span>
          </div>
          <p>Your library is empty</p>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="p-4 space-y-8 pb-24">
          {/* Header */}
          <div className="pt-8 pb-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Create Manga
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              {script ? "Editing your story" : "What story do you want to tell?"}
            </p>
          </div>

          {!script ? (
            <StoryInput onSubmit={handleGenerate} isLoading={isLoading} />
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {characterSheet && <CharacterViewer characterSheet={characterSheet} />}
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs text-purple-300 whitespace-nowrap">
                   Script Generated
                 </div>
                 <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-300 whitespace-nowrap">
                   Characters Ready
                 </div>
              </div>

              <ScriptViewer script={script} />
              
              <MangaPageViewer 
                panels={script.panels} 
                images={panelImages} 
                onGenerateImage={handleGenerateImage}
                isGenerating={isGeneratingImage}
              />
              
              <button 
                onClick={() => setScript(null)}
                className="w-full py-4 text-neutral-500 text-sm hover:text-white transition-colors"
              >
                Start New Story
              </button>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
