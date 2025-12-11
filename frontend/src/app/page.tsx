"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoginScreen from "@/components/LoginScreen";
import AppShell from "@/components/AppShell";
import ProfileSettings from "@/components/ProfileSettings";
import LibraryView from "@/components/LibraryView";
import StoryInput from "@/components/StoryInput";
import ScriptViewer from "@/components/ScriptViewer";
import CharacterViewer from "@/components/CharacterViewer";
import MangaPageViewer from "@/components/MangaPageViewer";

export default function Home() {
  // App State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Needed for profile
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  
  // Content State
  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [script, setScript] = useState<any>(null);
  const [characterSheet, setCharacterSheet] = useState<any>(null);
  const [panelImages, setPanelImages] = useState<Record<number, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState<Record<number, boolean>>({});
  
  // Generation Settings
  const [currentStyle, setCurrentStyle] = useState('manga');

  useEffect(() => {
    // 1. Credentials
    const savedName = localStorage.getItem("manga_user_name");
    const savedEmail = localStorage.getItem("manga_user_email");
    const savedKey = localStorage.getItem("manga_api_key");

    if (savedName && savedKey) {
      setUserName(savedName);
      setUserEmail(savedEmail || "user@example.com");
      setApiKey(savedKey);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (name: string, key: string, email?: string) => {
    localStorage.setItem("manga_user_name", name);
    localStorage.setItem("manga_api_key", key);
    if (email) {
       localStorage.setItem("manga_user_email", email);
       setUserEmail(email);
    }
    setUserName(name);
    setApiKey(key);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all data on logout
    setIsLoggedIn(false);
    setUserName("");
    setApiKey("");
    setScript(null);
    window.location.reload(); 
  };
  
  // --- Project Management ---

  const handleSaveProject = async () => {
    if (!script) return;
    
    // Auto-generate title if missing
    const title = script.title || "Untitled Story";
    const projectData = {
       id: projectId || "", // Empty string implies new project
       title: title,
       created_at: new Date().toISOString(),
       updated_at: new Date().toISOString(),
       script: script,
       images: panelImages,
       art_style: currentStyle
    };
    
    try {
       const res = await fetch("http://localhost:8000/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData)
       });
       if (res.ok) {
          const newId = await res.json();
          setProjectId(newId);
          alert("Project saved successfully!");
       } else {
          throw new Error("Save failed");
       }
    } catch (err) {
       console.error(err);
       alert("Failed to save project.");
    }
  };
  
  const handleLoadProject = async (id: string) => {
     try {
        const res = await fetch(`http://localhost:8000/projects/${id}`);
        if (res.ok) {
           const project = await res.json();
           setProjectId(project.id);
           setScript(project.script);
           setPanelImages(project.images);
           setCurrentStyle(project.art_style);
           setActiveTab("create"); // Switch to editor
        }
     } catch (err) {
        console.error(err);
        alert("Failed to load project.");
     }
  };

  const handleGenerate = async (prompt: string, enhance: boolean, artStyle: string) => {
    setIsLoading(true);
    setScript(null);
    setCharacterSheet(null);
    setPanelImages({});
    setProjectId(null); // Reset ID for new story
    setCurrentStyle(artStyle);

    try {
      let finalPrompt = prompt;

      // 1. Enhance Prompt (if requested)
      if (enhance) {
        const enhanceRes = await fetch("/api/enhance-prompt", {
           method: "POST",
           headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
           body: JSON.stringify({ prompt }),
        });
        if (enhanceRes.ok) {
           const data = await enhanceRes.json();
           finalPrompt = data.enhanced_prompt;
        }
      }

      // 2. Generate Script
      const scriptRes = await fetch("/api/generate/script", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}` 
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });
      if (!scriptRes.ok) throw new Error("Failed to generate script");
      const scriptData = await scriptRes.json();
      setScript(scriptData);
      
      // 3. Generate Characters
      const charRes = await fetch("/api/generate/characters", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}` 
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });
      if (charRes.ok) {
         const charData = await charRes.json();
         // Merge characters into script response for consistency context
         if (!scriptData.characters) {
             setScript({ ...scriptData, characters: charData.characters });
         }
         setCharacterSheet(charData);
      }

    } catch (error: any) {
      console.error(error);
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (panelId: number, style: "preview" | "final") => {
    if (!script) return;
    const panel = script.panels.find((p: any) => p.id === panelId);
    if (!panel) return;
    
    // Prepare Character Context Map
    // Convert List<CharacterProfile> to Dict<Name, Desc>
    const charContext: Record<string, string> = {};
    if (script.characters) {
       script.characters.forEach((c: any) => {
          charContext[c.name] = `${c.appearance} (${c.personality})`;
       });
    }

    setIsGeneratingImage(prev => ({ ...prev, [panelId]: true }));
    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}` 
        },
        body: JSON.stringify({
          panel_id: panelId,
          description: panel.description,
          characters: panel.characters,
          style: style,
          art_style: currentStyle,
          character_profiles: charContext // Inject Context!
        }),
      });

      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setPanelImages(prev => ({ ...prev, [panelId]: data.image_url }));
      
      // Auto-save after generation (optional, or just prompt user)
      // handleSaveProject(); 
      
    } catch (error) {
      alert("Image generation failed");
    } finally {
      setIsGeneratingImage(prev => ({ ...prev, [panelId]: false }));
    }
  };
  
  const handlePanelUpdate = (panelId: number, newDescription: string) => {
    if (!script) return;
    const updatedPanels = script.panels.map((p: any) => 
      p.id === panelId ? { ...p, description: newDescription } : p
    );
    setScript({ ...script, panels: updatedPanels });
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(name, key) => handleLogin(name, key)} />;
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      
      {activeTab === 'profile' && (
        <ProfileSettings 
           name={userName} 
           email={userEmail} 
           apiKey={apiKey}
           setApiKey={setApiKey}
           hfToken="" // Managed on server
           onLogout={handleLogout} 
        />
      )}

      {activeTab === 'library' && (
        <LibraryView onLoadProject={handleLoadProject} />
      )}

      {activeTab === 'create' && (
        <div className="p-4 space-y-8 pb-24">
          {!script ? (
             <>
              <div className="pt-8 pb-4 text-center">
                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Story</h1>
                 <p className="text-gray-500 dark:text-gray-400">Describe your idea, and AI will write and draw it.</p>
              </div>
              <StoryInput onSubmit={handleGenerate} isLoading={isLoading} />
             </>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Toolbar */}
              <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 -mx-4 px-4 py-3 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                       {script.title || "Untitled Story"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                       {currentStyle}
                    </span>
                 </div>
                 <button 
                   onClick={handleSaveProject}
                   className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:opacity-80 transition-opacity"
                 >
                   Save
                 </button>
              </div>

              {/* Viewers */}
              {characterSheet && <CharacterViewer characterSheet={characterSheet} />}
              <ScriptViewer script={script} />
              
              <MangaPageViewer 
                panels={script.panels} 
                images={panelImages} 
                onGenerateImage={handleGenerateImage}
                onPanelUpdate={handlePanelUpdate}
                isGenerating={isGeneratingImage}
              />
              
              <div className="pt-8 border-t border-gray-100 dark:border-zinc-800">
                <button 
                  onClick={() => { setScript(null); setProjectId(null); }}
                  className="w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-sm font-medium"
                >
                  Discard & Start New
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
