"use client";

import React, { useState, useRef } from "react";
import { FretPosition, MelodySequenceItem } from "@/types";
import InteractiveFretboard from "@/components/InteractiveFretboard"; // Assuming your component is here

// Helper function to get note name (simplified for demonstration)
const getNoteName = (string: number, fret: number): string => {
  const openStringNotes = {
    1: "E", // High E
    2: "B",
    3: "G",
    4: "D",
    5: "A",
    6: "E", // Low E
  };
  return `${openStringNotes[string as keyof typeof openStringNotes]}${fret}`;
};

const GuitarPlayground: React.FC = () => {
  const [selectedNotes, setSelectedNotes] = useState<MelodySequenceItem[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const numFrets = 15; // Including the open fret (nut)

  const handleFretClick = (stringNum: number, fretNum: number) => {
    const noteName = getNoteName(stringNum, fretNum);
    const newNote: MelodySequenceItem = {
      id: `${stringNum}-${fretNum}-${Date.now()}`,
      string: stringNum,
      fret: fretNum,
      noteName: noteName,
    };
    setSelectedNotes((prev) => [...prev, newNote]);
  };

  const playMelody = () => {
    if (selectedNotes.length === 0) return;

    let i = 0;
    const playNextNote = () => {
      if (i < selectedNotes.length) {
        setPlayingIndex(i);
        i++;
        playTimeoutRef.current = setTimeout(playNextNote, 500); // Highlight each note for 500ms
      } else {
        setPlayingIndex(null); // Reset after playback
      }
    };
    playNextNote();
  };

  const clearMelody = () => {
    setSelectedNotes([]);
    setPlayingIndex(null);
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }
  };

  // Convert MelodySequenceItem to FretPosition for InteractiveFretboard props
  const melodyPositions: FretPosition[] = selectedNotes.map((note) => [
    note.string,
    note.fret,
  ]);
  const playingPosition: FretPosition[] =
    playingIndex !== null
      ? [[selectedNotes[playingIndex].string, selectedNotes[playingIndex].fret]]
      : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        Guitar Playground
      </h1>

      {/* Interactive Fretboard Component */}
      <div className="mb-8">
        <InteractiveFretboard
          numFrets={numFrets}
          onFretClick={handleFretClick}
          melodyNotes={melodyPositions}
          playingNotes={playingPosition}
          // You can add staticHighlightedNotes if you want to show predefined notes (e.g., a scale)
          // staticHighlightedNotes={[[3,5], [4,7]]}
        />
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={playMelody}
          className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg shadow-lg text-lg font-semibold transition-all duration-200 ease-in-out"
        >
          Play Melody
        </button>
        <button
          onClick={clearMelody}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-lg text-lg font-semibold transition-all duration-200 ease-in-out"
        >
          Clear Melody
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">
          Selected Melody Sequence:
        </h2>
        {selectedNotes.length === 0 ? (
          <p className="text-gray-400">
            Click on the fretboard to build your melody!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedNotes.map((note, index) => (
              <span
                key={note.id}
                className={`px-3 py-1 rounded-full text-sm font-medium
                            ${
                              index === playingIndex
                                ? "bg-purple-500 text-white animate-pulse"
                                : "bg-purple-900 text-purple-200"
                            }`}
              >
                S{note.string}-F{note.fret} ({note.noteName})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tailwind CSS custom glow utility and pulse animation */}
      <style jsx>{`
        .shadow-purple-glow {
          box-shadow: 0 0 10px 3px rgba(168, 85, 247, 0.7); /* purple-500 with opacity */
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default GuitarPlayground;
