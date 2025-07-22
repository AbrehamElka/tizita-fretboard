// src/components/MelodyDisplay.tsx
"use client"; // This component will have interactive elements later (like play button)

import React from "react";
import { Melody } from "@/types";

interface MelodyDisplayProps {
  melody: Melody;
}

// Helper component to render the tab sequence
const TabSequenceDisplay: React.FC<{ tabs: Melody["tabs"] }> = ({ tabs }) => {
  if (!tabs || tabs.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        No tab sequence available for this melody.
      </p>
    );
  }

  // Group tabs by lines for better readability
  // For simplicity, let's just display them in a list for now.
  // A more advanced tab display would involve aligning by beat/time.
  return (
    <div className="bg-gray-800 text-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto">
      <h4 className="font-semibold text-lg mb-2 text-white">Guitar Tabs:</h4>
      <div className="whitespace-nowrap pb-2">
        {tabs.map(([string, fret], index) => (
          <span
            key={index}
            className="inline-block px-2 py-1 bg-gray-700 rounded-md mr-2 mb-2"
          >
            String {string} Fret {fret}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        (String: {tabs[0][0]} ={" "}
        {tabs[0][0] === 1
          ? "High E"
          : tabs[0][0] === 2
          ? "B"
          : tabs[0][0] === 3
          ? "G"
          : tabs[0][0] === 4
          ? "D"
          : tabs[0][0] === 5
          ? "A"
          : "Low E"}
        , Fret: 0 = Open)
      </p>
    </div>
  );
};

export default function MelodyDisplay({ melody }: MelodyDisplayProps) {
  // Placeholder for audio logic
  const handlePlayMelody = () => {
    alert(`Playing melody: ${melody.title} (Audio coming soon!)`);
    // This is where Tone.js playback for melodies will go in Phase 5
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 mb-8 transform hover:scale-105 transition-transform duration-200">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {melody.title}
      </h2>
      {melody.composer && (
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          Composer: <span className="font-semibold">{melody.composer}</span>
        </p>
      )}
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Mode: <span className="font-semibold">{melody.mode}</span>
      </p>

      {melody.description && (
        <p className="text-md italic text-gray-600 dark:text-gray-400 mb-6">
          {melody.description}
        </p>
      )}

      {/* Tab Sequence Display */}
      <TabSequenceDisplay tabs={melody.tabs} />

      {/* Play Audio Button - Placeholder for now */}
      <button
        onClick={handlePlayMelody}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Play Melody (Audio Coming Soon!)
      </button>
    </div>
  );
}
