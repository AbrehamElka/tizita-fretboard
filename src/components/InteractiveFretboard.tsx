// src/components/InteractiveFretboard.tsx

import React, { useState, useCallback } from "react";
import { FretPosition } from "@/types"; // Adjust path if needed

interface InteractiveFretboardProps {
  staticHighlightedNotes?: FretPosition[]; // Keeping this if you want external static highlights
  melodyNotes?: FretPosition[]; // Notes currently in the melody sequence (e.g., green highlight)
  playingNotes?: FretPosition[]; // Notes currently being played (yellow pulse)
  onFretboardInteraction: (notesToReport: FretPosition[]) => void;
  onStringSelect?: (stringNum: number) => void;
  numFrets?: number;
  isMelodyPlaying?: boolean; // New prop to indicate if a melody is currently playing
}

// String names from high E to low E (for display)
const stringNames = ["E", "B", "G", "D", "A", "E"];

// Define distinct and more vibrant colors for each string
const stringColors = [
  "bg-blue-400", // High E - Thinner, vibrant blue
  "bg-teal-400", // B - Vibrant teal
  "bg-lime-400", // G - Vibrant lime green
  "bg-orange-400", // D - Vibrant orange
  "bg-rose-400", // A - Vibrant rose pink
  "bg-purple-400", // Low E - Vibrant purple (consistent with theme)
];

// --- Note Calculation Additions ---

// The 12 notes in a chromatic scale (including sharps)
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

// Open string notes for a standard 6-string guitar, from high E to low E
// Corresponds to stringNum 1 through 6
const openStringNotesMap = {
  1: { note: "E", octave: 4 }, // High E
  2: { note: "B", octave: 3 },
  3: { note: "G", octave: 3 },
  4: { note: "D", octave: 3 },
  5: { note: "A", octave: 2 },
  6: { note: "E", octave: 2 }, // Low E
};

/**
 * Calculates the note name for a given string and fret, including octave.
 * @param stringNum The string number (1 for high E, 6 for low E).
 * @param fretNum The fret number (0 for open string/nut).
 * @returns The calculated note name (e.g., "E4", "G3").
 */
const getNoteName = (stringNum: number, fretNum: number): string => {
  const openNoteInfo =
    openStringNotesMap[stringNum as keyof typeof openStringNotesMap];
  if (!openNoteInfo) return "";

  const openNote = openNoteInfo.note;
  const openNoteIndex = chromaticScale.indexOf(openNote);
  if (openNoteIndex === -1) return "";

  const totalSteps = openNoteIndex + fretNum;
  const noteName = chromaticScale[totalSteps % chromaticScale.length];
  const currentOctave = openNoteInfo.octave + Math.floor(totalSteps / 12);

  return `${noteName}${currentOctave}`;
};

// --- End Note Calculation Additions ---

export default function InteractiveFretboard({
  staticHighlightedNotes = [],
  melodyNotes = [], // These are the notes that stay highlighted (e.g., green) when not playing
  playingNotes = [], // These are the notes currently being played (yellow pulse)
  onFretboardInteraction,
  onStringSelect,
  numFrets = 15,
  isMelodyPlaying = false, // Default to false
}: InteractiveFretboardProps) {
  const [currentGroupSelection, setCurrentGroupSelection] = useState<
    FretPosition[]
  >([]);

  // Helper to check if a note is part of the 'melodyNotes' set
  const isMelodyNote = useCallback(
    (stringNum: number, fretNum: number) =>
      melodyNotes.some(([s, f]) => s === stringNum && f === fretNum),
    [melodyNotes]
  );

  // Helper to check if a note is currently in the 'playingNotes' set
  const isPlayingNote = useCallback(
    (stringNum: number, fretNum: number) =>
      playingNotes.some(([s, f]) => s === stringNum && f === fretNum),
    [playingNotes]
  );

  // Helper to check if a note is currently part of the active group selection (Ctrl/Cmd click)
  const isInCurrentGroup = useCallback(
    (stringNum: number, fretNum: number) =>
      currentGroupSelection.some(([s, f]) => s === stringNum && f === fretNum),
    [currentGroupSelection]
  );

  // Unified click handler for both frets and nuts
  const handleClick = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
      stringNum: number,
      fretIdx: number
    ) => {
      // Prevent interaction if a melody is currently playing
      if (isMelodyPlaying) {
        console.log("Melody is playing, interaction disabled.");
        return;
      }

      const clickedNote: FretPosition = [stringNum, fretIdx];
      const isCtrlPressed = event.ctrlKey || event.metaKey;

      if (isCtrlPressed) {
        setCurrentGroupSelection((prevGroup) => {
          const isAlreadyInGroup = prevGroup.some(
            ([s, f]) => s === clickedNote[0] && f === clickedNote[1]
          );

          let newGroup: FretPosition[];
          if (isAlreadyInGroup) {
            newGroup = prevGroup.filter(
              ([s, f]) => !(s === clickedNote[0] && f === clickedNote[1])
            );
          } else {
            newGroup = [...prevGroup, clickedNote];
          }
          onFretboardInteraction(newGroup);
          return newGroup;
        });
      } else {
        setCurrentGroupSelection([]);
        onFretboardInteraction([clickedNote]);
      }
    },
    [onFretboardInteraction, isMelodyPlaying] // Add isMelodyPlaying as a dependency
  );

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-700">
      <div className="flex flex-col gap-2">
        <div className="relative overflow-x-auto w-full max-w-full">
          {/* Strings drawn as thin lines, Z-index adjusted */}
          <div className="absolute inset-0 z-15 pointer-events-none">
            {Array.from({ length: 6 }, (_, stringIdx) => {
              const stringHeightClass = [
                "h-[1.5px]",
                "h-[2px]",
                "h-[2.5px]",
                "h-[3px]",
                "h-[3.5px]",
                "h-[4px]",
              ][stringIdx];

              const cellHeight = 40;
              const borderSpacing = 2;
              const stringPixelHeights = [1.5, 2, 2.5, 3, 3.5, 4];

              const topOffset =
                stringIdx * (cellHeight + borderSpacing) +
                cellHeight / 2 -
                stringPixelHeights[stringIdx] / 2;

              return (
                <div
                  key={`string-line-${stringIdx}`}
                  className={`absolute left-0 right-0 ${stringHeightClass} ${stringColors[stringIdx]}`}
                  style={{ top: `${topOffset}px` }}
                ></div>
              );
            })}
          </div>

          <table className="border-separate border-spacing-0.5 mx-auto bg-gray-800 rounded-lg overflow-hidden relative">
            <tbody>
              {Array.from({ length: 6 }, (_, stringIdx) => {
                const stringNum = stringIdx + 1;
                return (
                  <tr key={stringIdx}>
                    {Array.from({ length: numFrets + 1 }, (__, fretIdx) => {
                      const isNut = fretIdx === 0;
                      const playing = isPlayingNote(stringNum, fretIdx);
                      const inCurrentGroup = isInCurrentGroup(
                        stringNum,
                        fretIdx
                      );
                      const melody = isMelodyNote(stringNum, fretIdx); // Check if it's a melody note

                      const noteName = getNoteName(stringNum, fretIdx);

                      // Determine the final background color based on precedence
                      let bgColorClass = "bg-gray-900"; // Default fret color
                      let textColorClass = "";

                      if (isNut) {
                        bgColorClass = "bg-gray-700"; // Default nut color
                        textColorClass = "text-gray-300";
                      } else {
                        bgColorClass = "bg-gray-900"; // Default fret color
                      }

                      // Order of precedence: playing > currentGroupSelection > melody
                      if (playing) {
                        bgColorClass = "bg-yellow-400 animate-pulse";
                        textColorClass = "text-white";
                      } else if (inCurrentGroup) {
                        bgColorClass = "bg-blue-600 border-blue-400"; // For Ctrl/Cmd selection
                        textColorClass = "text-white";
                      } else if (melody) {
                        // This only applies if it's a melody note AND NOT being played AND NOT in current selection
                        bgColorClass = "bg-green-500 shadow-md"; // Static melody color
                        textColorClass = "text-white";
                      }

                      // Additional classes for scale, border, z-index, etc.
                      const commonClasses = `
                        relative w-8 h-8 rounded-full flex items-center justify-center
                        mx-auto my-auto
                        transition-all duration-200 ease-in-out
                        cursor-pointer
                        border-2 border-transparent
                        ${playing ? "scale-110 shadow-lg" : ""}
                        ${inCurrentGroup && !playing ? "scale-105" : ""}
                        ${
                          isMelodyPlaying
                            ? "pointer-events-none"
                            : "hover:bg-purple-700/50"
                        }
                        ${
                          playing
                            ? "z-30"
                            : inCurrentGroup
                            ? "z-18"
                            : melody
                            ? "z-25"
                            : "z-10"
                        }
                        ${isNut ? "w-full h-full rounded-none" : ""}
                        hover:z-20
                      `;

                      return (
                        <td
                          key={fretIdx}
                          className={`
                            relative w-10 h-10
                            border-r border-gray-700 last:border-r-0
                            ${
                              isNut
                                ? "bg-gray-700 border-l-2 border-gray-600"
                                : "bg-gray-800"
                            }
                          `}
                        >
                          {isNut ? (
                            <button
                              className={`
                                ${bgColorClass} ${textColorClass}
                                ${commonClasses}
                                ${isNut ? "border-r-2 border-gray-600" : ""}
                                font-bold text-sm
                              `}
                              onClick={(event) =>
                                handleClick(event, stringNum, fretIdx)
                              }
                              title={`Open String ${stringNames[stringIdx]} (${noteName})`}
                            >
                              {stringNames[stringIdx]}
                              {(playing || melody || inCurrentGroup) && (
                                <span className="absolute bottom-1 text-xs">
                                  {noteName}
                                </span>
                              )}
                            </button>
                          ) : (
                            <button
                              className={`
                                ${bgColorClass} ${textColorClass}
                                ${commonClasses}
                              `}
                              onClick={(event) =>
                                handleClick(event, stringNum, fretIdx)
                              }
                              title={`String ${stringNum}, Fret ${fretIdx} (${noteName})`}
                            >
                              {playing || melody || inCurrentGroup
                                ? noteName
                                : ""}
                            </button>
                          )}

                          {/* Fret Markers (dots) */}
                          {stringIdx === 2 &&
                            (fretIdx === 3 ||
                              fretIdx === 5 ||
                              fretIdx === 7 ||
                              fretIdx === 9) && (
                              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              </div>
                            )}
                          {stringIdx === 2 && fretIdx === 12 && (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center space-x-1.5 pointer-events-none">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Fret number labels at the bottom */}
        <div className="flex gap-0.5 mt-2 mx-auto">
          {Array.from({ length: numFrets + 1 }, (__, i) => {
            const isNutPosition = i === 0;
            return (
              <span
                key={i}
                className={`w-10 text-center text-xs text-gray-400 ${
                  isNutPosition ? "font-bold" : ""
                }`}
              >
                {isNutPosition ? "OPEN" : i}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
