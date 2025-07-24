// src/components/StaticFretboard.tsx

import React from "react";
import { FretPosition, ChordPosition } from "@/types";

interface StaticFretboardProps {
  chordNotes: FretPosition[];
  fingers?: (number | null)[];
  barre?: ChordPosition["barre"];
  fretsData: (number | null)[];
  numFrets?: number;
}

// String names from high E to low E (for display)
const stringNames = ["E", "B", "G", "D", "A", "E"]; // High E (String 1) to Low E (String 6)

// Define distinct and more vibrant colors for each string
const stringColors = [
  "bg-blue-400", // String 1 (High E)
  "bg-teal-400", // String 2 (B)
  "bg-lime-400", // String 3 (G)
  "bg-orange-400", // String 4 (D)
  "bg-rose-400", // String 5 (A)
  "bg-purple-400", // String 6 (Low E)
];

// --- Note Calculation (copied for completeness) ---
const chromaticScale = [
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

const openStringNotesMap = {
  1: { note: "E", octave: 4 }, // High E
  2: { note: "B", octave: 3 },
  3: { note: "G", octave: 3 },
  4: { note: "D", octave: 3 },
  5: { note: "A", octave: 2 },
  6: { note: "E", octave: 2 }, // Low E
};

const getNoteName = (stringNum: number, fretNum: number): string => {
  const openNoteInfo =
    openStringNotesMap[stringNum as keyof typeof openStringNotesMap];
  if (!openNoteInfo) return "";
  const openNoteIndex = chromaticScale.indexOf(openNoteInfo.note);
  const totalSteps = openNoteIndex + fretNum;
  const noteName = chromaticScale[totalSteps % chromaticScale.length];
  // We don't need octave for chord display notes typically, just the note name
  return `${noteName}`;
};
// --- End Note Calculation ---

const StaticFretboard: React.FC<StaticFretboardProps> = ({
  chordNotes,
  fingers,
  barre,
  fretsData,
  numFrets = 5,
}) => {
  const isChordNote = (stringNum: number, fretNum: number) =>
    chordNotes.some(([s, f]) => s === stringNum && f === fretNum);

  const maxFret = chordNotes.reduce((max, [, fret]) => Math.max(max, fret), 0);
  const displayNumFrets = Math.max(numFrets, maxFret + 2); // Ensure enough frets are displayed for the chord

  // Cell dimensions - making them thinner
  const cellWidth = 30; // Width of a string column (cell) - reduced from 36
  const cellHeight = 28; // Height of a fret row (cell) - reduced from 30
  const nutHeight = 8; // Height of the nut (was nutWidth before)

  // Total width of the string section
  const totalStringsWidth = 6 * cellWidth;

  return (
    <div className="bg-gray-900 rounded-lg p-2 shadow-lg border border-gray-700 flex flex-row items-start overflow-hidden">
      {/* LEFT SIDE: Fret numbers */}
      <div className="flex flex-col pt-1" style={{ width: "20px" }}>
        {" "}
        {/* Small width for fret numbers */}
        <div style={{ height: `${nutHeight}px` }}>
          {/* Placeholder for nut height */}
        </div>
        {Array.from({ length: displayNumFrets }, (__, i) => (
          <div
            key={`fret-num-${i}`}
            className="flex items-center justify-end pr-1 text-xs text-gray-400 font-bold"
            style={{ height: `${cellHeight}px` }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE: Fretboard Diagram */}
      <div className="flex flex-col">
        {/* Nut at the top */}
        <div
          className="relative flex flex-row border-b-2 border-gray-600 bg-gray-700"
          style={{ height: `${nutHeight}px`, width: `${totalStringsWidth}px` }}
        >
          {/* String name labels above the nut */}
          {Array.from({ length: 6 }, (_, stringIdx) => {
            const stringNum = stringIdx + 1; // 1-indexed string number
            const fretsDataIndex = 6 - stringNum; // Map to 0-indexed fretsData

            const isMuted = fretsData[fretsDataIndex] === null;
            const isOpen = fretsData[fretsDataIndex] === 0;

            return (
              <div
                key={`nut-label-${stringNum}`}
                className="flex-1 flex items-center justify-center text-xs font-bold text-gray-300 relative"
                style={{ width: `${cellWidth}px` }}
              >
                {isMuted ? (
                  <span className="text-sm font-bold text-red-400">
                    X
                  </span> /* Smaller X */
                ) : isOpen ? (
                  <span className="text-sm font-bold text-gray-300">
                    O
                  </span> /* Smaller O */
                ) : (
                  <span className="text-xs font-bold text-gray-300">
                    {stringNames[stringIdx]}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Fretboard Area */}
        <div
          className="relative overflow-hidden"
          style={{
            width: `${totalStringsWidth}px`,
            height: `${displayNumFrets * cellHeight}px`,
          }}
        >
          {/* Vertical String Lines (visual only, behind the cells) */}
          {Array.from({ length: 6 }, (_, stringIdx) => {
            const stringThickness = [1.5, 2, 2.5, 3, 3.5, 4][stringIdx]; // Thickness
            const stringOffset =
              (stringIdx + 0.5) * cellWidth - stringThickness / 2; // Center in column

            return (
              <div
                key={`string-line-${stringIdx}`}
                className={`absolute top-0 bottom-0 ${stringColors[stringIdx]}`}
                style={{
                  width: `${stringThickness}px`,
                  left: `${stringOffset}px`,
                  zIndex: 15,
                }}
              ></div>
            );
          })}

          {/* Fretboard Cells (where notes are placed) */}
          {Array.from({ length: displayNumFrets }, (_, fretIdx) => {
            const actualFret = fretIdx + 1; // Frets start from 1

            return (
              <div
                key={`fret-row-${actualFret}`}
                className="flex flex-row relative border-b border-gray-700"
                style={{ height: `${cellHeight}px` }}
              >
                {Array.from({ length: 6 }, (__, stringIdx) => {
                  const stringNum = stringIdx + 1; // 1-indexed string (1=high E, 6=low E)
                  const isPlayed = isChordNote(stringNum, actualFret);
                  const noteName = getNoteName(stringNum, actualFret);
                  const fretsDataIndex = 6 - stringNum; // For finger mapping (0=Low E, 5=High E)

                  let bgColorClass = "bg-gray-800"; // Default fret cell color

                  if (isPlayed) {
                    bgColorClass = "bg-green-500 shadow-md"; // Static chord note highlight
                  }

                  return (
                    <div
                      key={`${stringNum}-${actualFret}`}
                      className={`
                        ${bgColorClass}
                        relative flex-1 flex items-center justify-center rounded-full
                        border-2 border-transparent
                        transition-all duration-100 ease-in-out
                        ${
                          isPlayed ? "scale-90 shadow-lg" : ""
                        } {/* Slightly smaller scale for played notes */}
                        pointer-events-none
                      `}
                      style={{ width: `${cellWidth}px` }}
                    >
                      {isPlayed && (
                        <>
                          <span className="absolute text-xs text-white">
                            {noteName} {/* Just the note name */}
                          </span>
                          {fingers && fingers[fretsDataIndex] !== null && (
                            <span className="absolute -bottom-3 text-[10px] text-blue-300 font-bold">
                              {" "}
                              {/* Smaller font for fingerings */}
                              {fingers[fretsDataIndex]}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
                {/* Fret markers (dots) - adjusted position to be within the fretboard but off to the side */}
                {(actualFret === 3 ||
                  actualFret === 5 ||
                  actualFret === 7 ||
                  actualFret === 9) && (
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full z-40" /* Smaller dots */
                    style={{
                      transform: `translateX(7px) translateY(-50%)`,
                    }} /* Closer to the edge */
                  ></div>
                )}
                {actualFret === 12 && (
                  <>
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full z-40"
                      style={{ transform: `translateX(3px) translateY(-50%)` }}
                    ></div>
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-500 rounded-full z-40"
                      style={{ transform: `translateX(11px) translateY(-50%)` }}
                    ></div>
                  </>
                )}
              </div>
            );
          })}

          {/* Barre Chord Rendering */}
          {barre && (
            <div
              className="absolute bg-gray-500 rounded-full z-20"
              style={{
                // Barre starts at the beginning of the fret (actualFret)
                // Y position: (fret - 1) * cellHeight + half_cell_height - half_barre_height
                top: `${(barre.fret - 1) * cellHeight + cellHeight / 2 - 3}px`, // Adjusted for new cellHeight
                // X position: based on the lowest string (highest stringNum) of the barre, then calculate left.
                // fretsData stores from S6 to S1. stringTo is high E (1) to low E (6).
                // stringTo 1 (high E) means fretsData[5]. stringTo 6 (low E) means fretsData[0].
                // Left offset from the left edge of string 1 (high E)
                left: `${(6 - barre.stringTo) * cellWidth + 3}px`, // Start 3px from the left edge of the lowest string of the barre
                height: "6px", // Thickness of the barre line
                width: `${
                  (barre.stringTo - barre.stringFrom + 1) * cellWidth - 6
                }px`, // Width across strings
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticFretboard;
