"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Group, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

interface Panel {
  id: number;
  description: string;
  dialogue: string | null;
  characters: string[];
}

interface ChapterEditorProps {
  panels: Panel[];
  images: Record<number, string>;
}

const URLImage = ({ src, x, y, width, height }: { src: string; x: number; y: number; width: number; height: number }) => {
  const [image] = useImage(src);
  return <KonvaImage image={image} x={x} y={y} width={width} height={height} />;
};

const EditableText = ({ 
  text, 
  x, 
  y, 
  onDragEnd, 
  isSelected, 
  onSelect, 
  onChange 
}: { 
  text: string; 
  x: number; 
  y: number; 
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newText: string) => void;
}) => {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        draggable
        x={x}
        y={y}
        onDragEnd={onDragEnd}
        onClick={onSelect}
        onTap={onSelect}
      >
        <Rect
          width={shapeRef.current?.width() || 100}
          height={shapeRef.current?.height() || 50}
          fill="white"
          stroke="black"
          strokeWidth={2}
          cornerRadius={10}
          shadowColor="black"
          shadowBlur={5}
          shadowOpacity={0.2}
          shadowOffset={{ x: 2, y: 2 }}
        />
        <Text
          ref={shapeRef}
          text={text}
          fontSize={16}
          fontFamily="Anime, sans-serif"
          padding={10}
          align="center"
          verticalAlign="middle"
          width={200}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default function ChapterEditor({ panels, images }: ChapterEditorProps) {
  const [bubbles, setBubbles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [selectedId, selectShape] = useState<number | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Initialize bubbles from script
  useEffect(() => {
    const initialBubbles = panels
      .filter(p => p.dialogue)
      .map((p, i) => ({
        id: p.id,
        text: p.dialogue!,
        x: 50,
        y: i * 620 + 500 // Approximate position
      }));
    setBubbles(initialBubbles);
  }, [panels]);

  const handleDragEnd = (id: number, e: Konva.KonvaEventObject<DragEvent>) => {
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

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-gray-100 dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chapter Editor</h2>
        <div className="text-sm text-gray-500">Drag bubbles to position them</div>
      </div>
      
      <div className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-inner overflow-auto h-[800px]">
        <Stage
          width={800}
          height={panels.length * 620}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          ref={stageRef}
        >
          <Layer>
            {panels.map((panel, i) => (
              images[panel.id] ? (
                <URLImage
                  key={panel.id}
                  src={images[panel.id]}
                  x={0}
                  y={i * 620}
                  width={800}
                  height={600}
                />
              ) : (
                <Text
                  key={panel.id}
                  text={`Panel ${panel.id} (No Image)`}
                  x={300}
                  y={i * 620 + 300}
                  fontSize={24}
                />
              )
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
                onDragEnd={(e) => handleDragEnd(bubble.id, e)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
