// src/components/ChordDisplay.tsx

import React from "react";
import { Chord, FretPosition } from "@/types";
import StaticFretboard from "@/components/StaticFretboard";

interface ChordDisplayProps {
  chord: Chord;
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord }) => {
  if (!chord || chord.positions.length === 0) {
    return (
      <div className="text-gray-400">
        No positions available for this chord.
      </div>
    );
  }

  const firstPosition = chord.positions[0];

  const chordNotes: FretPosition[] = firstPosition.frets
    .map((fret, index) => {
      const stringNum = 6 - index; // Map 0-indexed array (low E to high E) to 6-1 indexed strings (high E to low E)
      if (fret === null) return null; // Muted string
      return [stringNum, fret];
    })
    .filter((note): note is FretPosition => note !== null); // Filter out muted strings

  const maxFret = chordNotes.reduce((max, [, fret]) => Math.max(max, fret), 0);
  const displayNumFrets = Math.max(maxFret + 2, 5);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 w-full max-w-sm flex flex-col items-center">
      <h3 className="text-xl font-semibold text-purple-300 mb-2">
        {chord.name}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        {firstPosition.name} (Root: {chord.root}, Type: {chord.type})
      </p>

      {/* Removed scaling from here, as StaticFretboard handles its own sizing based on cells */}
      <div className="w-full mx-auto mb-4 flex justify-center">
        <StaticFretboard
          numFrets={displayNumFrets}
          chordNotes={chordNotes}
          fingers={firstPosition.fingers}
          barre={firstPosition.barre}
          fretsData={firstPosition.frets}
        />
      </div>

      <div className="text-sm text-gray-300 mt-2">
        {firstPosition.fingers && (
          <p>
            Fingering: [
            {firstPosition.fingers
              .map((f, i) =>
                f === null ? (firstPosition.frets[i] === 0 ? "O" : "X") : f
              )
              .join(", ")}
            ]
          </p>
        )}
        {firstPosition.barre && (
          <p>
            Barre: Fret {firstPosition.barre.fret} (Strings{" "}
            {firstPosition.barre.stringFrom} to {firstPosition.barre.stringTo})
          </p>
        )}
      </div>
    </div>
  );
};

export default ChordDisplay;
