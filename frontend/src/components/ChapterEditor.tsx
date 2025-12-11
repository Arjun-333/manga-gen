"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Group, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { FiPlus, FiDownload, FiTrash2, FiMaximize } from "react-icons/fi";

interface Panel {
  id: number;
  description: string;
  dialogue: string | null;
  characters: string[];
}

interface ChapterEditorProps {
  panels: Panel[];
  images: Record<number, string>;
  onClose?: () => void;
}

const URLImage = ({ src, x, y, width, height }: { src: string; x: number; y: number; width: number; height: number }) => {
  const [image] = useImage(src, "anonymous"); // anonymous for CORS if needed
  return <KonvaImage image={image} x={x} y={y} width={width} height={height} />;
};

const EditableText = ({ 
  text, 
  x, 
  y, 
  onDragEnd, 
  isSelected, 
  onSelect, 
  onChange,
  onDelete
}: { 
  text: string; 
  x: number; 
  y: number; 
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newText: string) => void;
  onDelete: () => void;
}) => {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Double click to edit text (simple prompt for now)
  const handledblClick = () => {
    const newText = prompt("Edit dialogue:", text);
    if (newText !== null) onChange(newText);
  };

  return (
    <>
      <Group
        draggable
        x={x}
        y={y}
        onDragEnd={onDragEnd}
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handledblClick}
      >
        <Rect
          width={(shapeRef.current?.width() || 100) + 20}
          height={(shapeRef.current?.height() || 30) + 20}
          fill="white"
          stroke="black"
          strokeWidth={2}
          cornerRadius={15}
          shadowColor="black"
          shadowBlur={5}
          shadowOpacity={0.1}
          shadowOffset={{ x: 2, y: 2 }}
          offsetX={10}
          offsetY={10}
        />
        <Text
          ref={shapeRef}
          text={text}
          fontSize={16}
          fontFamily="Balsamiq Sans, Comic Sans MS, cursive"
          padding={0}
          align="center"
          verticalAlign="middle"
          width={200} // Auto-wrap width
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
        >
          {/* Delete Button attached to Transformer (Mock UI) */}
        </Transformer>
      )}
    </>
  );
};

export default function ChapterEditor({ panels, images, onClose }: ChapterEditorProps) {
  const [bubbles, setBubbles] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  const [selectedId, selectShape] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Initialize bubbles from script on first load
  useEffect(() => {
    const initialBubbles = panels
      .filter(p => p.dialogue)
      .map((p, i) => ({
        id: `init_${p.id}`,
        text: p.dialogue!,
        x: 50,
        y: i * 820 + 50 // Rough position
      }));
    setBubbles(initialBubbles);
  }, [panels]);

  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newBubbles = bubbles.map((bubble) => {
      if (bubble.id === id) {
        return {
          ...bubble,
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return bubble;
    });
    setBubbles(newBubbles);
  };

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const addBubble = () => {
     const newId = `bubble_${Date.now()}`;
     // Add to center of scroll view? Just add to top for now
     setBubbles([...bubbles, {
        id: newId,
        text: "New Text",
        x: 100,
        y: 100
     }]);
     selectShape(newId);
  };
  
  const deleteSelected = () => {
     if (selectedId) {
        setBubbles(bubbles.filter(b => b.id !== selectedId));
        selectShape(null);
     }
  };

  const handleDownload = () => {
    if (stageRef.current) {
        // High quality export
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `chapter_full.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  // Responsive Logic
  const [scale, setScale] = useState(1);
  const PAGE_WIDTH = 800;
  const GAP = 40;
  const TOTAL_HEIGHT = panels.length * (800 + GAP) + 100;

  useEffect(() => {
    const handleResize = () => {
      // Calculate scale to fit screen width with some padding
      const availableWidth = window.innerWidth - 32; // 16px padding on each side
      const newScale = Math.min(1, availableWidth / PAGE_WIDTH);
      setScale(newScale);
    };

    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const PANEL_HEIGHT = 800; 

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-300">
      
      {/* Toolbar */}
      <div className="h-16 bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-4 sm:px-6 shadow-xl z-10 shrink-0">
         <div className="flex items-center gap-4">
            <h2 className="text-white font-bold text-lg hidden sm:block">Lettering Mode</h2>
            <div className="h-6 w-px bg-zinc-700 hidden sm:block"></div>
            <p className="text-zinc-400 text-xs sm:text-sm">Drag bubbles. Dbl-click to edit.</p>
         </div>
         
         <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={deleteSelected}
              disabled={!selectedId}
              className="p-2 text-zinc-400 hover:text-red-400 disabled:opacity-20 transition-colors"
              title="Delete Selected"
            >
               <FiTrash2 size={20} />
            </button>
            <button 
               onClick={addBubble}
               className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-zinc-700"
            >
               <FiPlus /> <span className="hidden sm:inline">Bubble</span>
            </button>
            <button 
               onClick={handleDownload}
               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
            >
               <FiDownload /> <span className="hidden sm:inline">Export</span>
            </button>
            {onClose && (
               <button 
                  onClick={onClose}
                  className="ml-2 sm:ml-4 text-zinc-400 hover:text-white text-xs sm:text-sm"
               >
                  Close
               </button>
            )}
         </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-zinc-950 p-4 sm:p-8 flex justify-center">
        <div className="bg-white shadow-2xl origin-top" style={{ width: PAGE_WIDTH * scale, height: TOTAL_HEIGHT * scale }}>
          <Stage
            width={PAGE_WIDTH * scale}
            height={TOTAL_HEIGHT * scale} // Scale the DOM element
            scaleX={scale}                // Scale the internal content
            scaleY={scale}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            ref={stageRef}
            className="cursor-crosshair"
          >
            <Layer>
               {/* White Background for the whole strip */}
               <Rect width={PAGE_WIDTH} height={TOTAL_HEIGHT} fill="white" />
               
              {panels.map((panel, i) => (
                <Group key={panel.id} y={i * (PANEL_HEIGHT + GAP) + 50}>
                   {/* Panel Border/Frame */}
                   <Rect 
                      width={PAGE_WIDTH - 100} 
                      height={PANEL_HEIGHT} 
                      x={50} 
                      y={0} 
                      stroke="black" 
                      strokeWidth={4} 
                      fill="#f0f0f0" // Placeholder fill
                   />
                   
                  {images[panel.id] ? (
                    <URLImage
                      src={images[panel.id]}
                      x={54} // +4 stroke offset calculation simplified
                      y={4}
                      width={PAGE_WIDTH - 108}
                      height={PANEL_HEIGHT - 8}
                    />
                  ) : (
                    <Text
                      text={`Panel ${panel.id} (Generating...)`}
                      x={PAGE_WIDTH / 2 - 100}
                      y={PANEL_HEIGHT / 2}
                      fontSize={20}
                      fill="#999"
                    />
                  )}
                </Group>
              ))}
            </Layer>
            <Layer>
              {bubbles.map((bubble, i) => (
                <EditableText
                  key={bubble.id}
                  text={bubble.text}
                  x={bubble.x}
                  y={bubble.y}
                  isSelected={bubble.id === selectedId}
                  onSelect={() => selectShape(bubble.id)}
                  onChange={(newText) => {
                    const newBubbles = [...bubbles];
                    newBubbles[i].text = newText;
                    setBubbles(newBubbles);
                  }}
                  onDelete={() => {
                     setBubbles(bubbles.filter(b => b.id !== bubble.id));
                     selectShape(null);
                  }}
                  onDragEnd={(e) => handleDragEnd(bubble.id, e)}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
