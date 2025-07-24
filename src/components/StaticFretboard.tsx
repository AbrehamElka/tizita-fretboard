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

// --- Note Calculation (copied for completeness, less critical for static display but good for labels) ---
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
  const currentOctave = openNoteInfo.octave + Math.floor(totalSteps / 12);
  return `${noteName}${currentOctave}`;
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

  // Cell dimensions
  const cellWidth = 36; // Width of a string column (cell)
  const cellHeight = 30; // Height of a fret row (cell)
  const nutWidth = 8; // Width of the nut

  return (
    <div className="bg-gray-900 rounded-lg p-2 shadow-lg border border-gray-700 overflow-hidden">
      <div
        className="relative flex flex-row border-b-2 border-gray-600 bg-gray-700" // Nut at the top
        style={{ height: `${nutWidth}px`, width: `${6 * cellWidth}px` }}
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
                <span className="text-xl font-bold text-red-400">X</span>
              ) : isOpen ? (
                <span className="text-lg font-bold text-gray-300">O</span>
              ) : (
                <span className="text-xs font-bold text-gray-300">
                  {stringNames[stringIdx]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          width: `${6 * cellWidth}px`,
          height: `${displayNumFrets * cellHeight}px`,
        }}
      >
        {/* Vertical String Lines (visual only, behind the cells) */}
        {Array.from({ length: 6 }, (_, stringIdx) => {
          const stringHeight = [1.5, 2, 2.5, 3, 3.5, 4][stringIdx]; // Thickness
          const stringOffset = (stringIdx + 0.5) * cellWidth - stringHeight / 2; // Center in column

          return (
            <div
              key={`string-line-${stringIdx}`}
              className={`absolute top-0 bottom-0 ${stringColors[stringIdx]}`}
              style={{
                width: `${stringHeight}px`,
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
                const stringNum = stringIdx + 1; // 1-indexed string
                const isPlayed = isChordNote(stringNum, actualFret);
                const noteName = getNoteName(stringNum, actualFret);
                const fretsDataIndex = 6 - stringNum; // For finger mapping

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
                      ${isPlayed ? "scale-95 shadow-lg" : ""}
                      pointer-events-none
                    `}
                    style={{ width: `${cellWidth}px` }}
                  >
                    {isPlayed && (
                      <>
                        <span className="absolute text-xs text-white">
                          {noteName.replace(/[0-9]/g, "")}
                        </span>
                        {fingers && fingers[fretsDataIndex] !== null && (
                          <span className="absolute -bottom-3 text-xs text-blue-300 font-bold">
                            {fingers[fretsDataIndex]}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
              {/* Fret markers on the right side of the fretboard */}
              {(actualFret === 3 ||
                actualFret === 5 ||
                actualFret === 7 ||
                actualFret === 9) && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full z-40"
                  style={{ transform: `translateX(15px) translateY(-50%)` }} // Position dots outside to the right
                ></div>
              )}
              {actualFret === 12 && (
                <>
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full z-40"
                    style={{ transform: `translateX(15px) translateY(-50%)` }}
                  ></div>
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full z-40"
                    style={{ transform: `translateX(25px) translateY(-50%)` }}
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
              // Calculate Y position based on fret
              top: `${
                (barre.fret - 1) * cellHeight + nutWidth + cellHeight / 2 - 3
              }px`, // Y position of the barre line (fretIdx + 1 means fret 1 is at 0 index)
              // Calculate X position and width based on strings
              left: `${(6 - barre.stringTo) * cellWidth + cellWidth / 2 - 3}px`, // Left edge of the barre
              height: "6px", // Thickness of the barre line
              width: `${
                (barre.stringTo - barre.stringFrom + 1) * cellWidth - 6
              }px`, // Width across strings
              transform: `rotate(0deg)`, // No rotation needed for horizontal barre
            }}
          ></div>
        )}
      </div>

      {/* Fret number labels on the right side of the fretboard */}
      <div className="flex flex-col gap-0.5 ml-4 mt-2">
        {Array.from({ length: displayNumFrets }, (__, i) => {
          return (
            <span
              key={i}
              className={`h-[${cellHeight}px] flex items-center justify-start text-xs text-gray-400`}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StaticFretboard;
