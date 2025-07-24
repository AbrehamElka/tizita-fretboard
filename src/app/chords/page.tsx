// src/app/chords/page.tsx

import React from "react";
import ChordDisplay from "@/components/ChordDisplay";
import chordsData from "@/data/chords.json"; // Import your JSON data
import { ChordsData, Chord } from "@/types";

// Type assertion to ensure imported JSON matches ChordsData interface
const typedChordsData: ChordsData = chordsData as ChordsData;

const ChordsPage: React.FC = () => {
  // Get all root notes (categories) and sort them alphabetically
  const rootNotes = Object.keys(typedChordsData).sort((a, b) => {
    // Custom sort order for chromatic scale
    const order = [
      "A",
      "A#",
      "B",
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
    ];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        Guitar Chords Library
      </h1>

      {rootNotes.length === 0 ? (
        <p className="text-gray-400 text-center">No chord data available.</p>
      ) : (
        <div className="space-y-12">
          {rootNotes.map((rootNote) => (
            <div key={rootNote}>
              <h2 className="text-3xl font-semibold text-purple-300 mb-6 border-b border-gray-700 pb-2">
                {rootNote} Chords
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {typedChordsData[rootNote].map((chord: Chord) => (
                  <ChordDisplay key={chord.id} chord={chord} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChordsPage;
