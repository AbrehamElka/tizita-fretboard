// src/components/InteractiveFretboard.tsx

import React from "react";
import { FretPosition } from "../types"; // Adjust path if needed

interface InteractiveFretboardProps {
  staticHighlightedNotes?: FretPosition[];
  melodyNotes?: FretPosition[];
  playingNotes?: FretPosition[];
  onFretClick: (stringNum: number, fretNum: number) => void;
  onStringSelect?: (stringNum: number) => void;
  numFrets?: number;
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
const openStringNotes = ["E", "B", "G", "D", "A", "E"];

/**
 * Calculates the note name for a given string and fret.
 * @param stringNum The string number (1 for high E, 6 for low E).
 * @param fretNum The fret number (0 for open string/nut).
 * @returns The calculated note name (e.g., "F", "G#").
 */
const getNoteName = (stringNum: number, fretNum: number): string => {
  // Adjust stringNum to 0-indexed for array access (0 for high E, 5 for low E)
  const stringIndex = stringNum - 1;

  if (stringIndex < 0 || stringIndex >= openStringNotes.length) {
    return ""; // Invalid string number
  }

  const openNote = openStringNotes[stringIndex];
  const openNoteIndex = chromaticScale.indexOf(openNote);

  if (openNoteIndex === -1) {
    return ""; // Should not happen if openStringNotes are correctly mapped
  }

  const noteIndex = (openNoteIndex + fretNum) % chromaticScale.length;
  return chromaticScale[noteIndex];
};

// --- End Note Calculation Additions ---

export default function InteractiveFretboard({
  staticHighlightedNotes = [],
  melodyNotes = [],
  playingNotes = [],
  onFretClick,
  onStringSelect,
  numFrets = 15, // Default to 15 frets (0-14)
}: InteractiveFretboardProps) {
  // Helper to check if a note is highlighted in any category
  const isHighlighted = (stringNum: number, fretNum: number) =>
    staticHighlightedNotes.some(([s, f]) => s === stringNum && f === fretNum);
  const isMelody = (stringNum: number, fretNum: number) =>
    melodyNotes.some(([s, f]) => s === stringNum && f === fretNum);
  const isPlaying = (stringNum: number, fretNum: number) =>
    playingNotes.some(([s, f]) => s === stringNum && f === fretNum);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg border border-gray-700">
      {/* Removed items-center from here to allow individual alignment */}
      <div className="flex flex-col gap-2">
        {/* String labels (optional, above the fretboard/nut) */}
        {/* Added mx-auto to center these labels */}
        <div className="flex gap-2 mb-2 mx-auto">
          {stringNames.map((name, i) => (
            <button
              key={i}
              className="w-10 h-8 flex items-center justify-center font-bold text-purple-400 bg-gray-800 rounded hover:bg-purple-700 transition-colors border border-gray-700"
              onClick={() => onStringSelect && onStringSelect(i + 1)}
              title={`Select string ${i + 1} (${name})`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Fretboard Grid Container (relative for absolutely positioned strings) */}
        {/* The mx-auto on the table inside this div will center the fretboard */}
        <div className="relative overflow-x-auto w-full max-w-full">
          {/* Overlay for drawing the strings (below the table/buttons) */}
          {/* Set strings to z-0 so buttons can easily appear above them */}
          {/* Changed z-15 to z-0 as previously suggested for proper layering */}
          <div className="absolute inset-0 z-15 pointer-events-none">
            {Array.from({ length: 6 }, (_, stringIdx) => {
              // String thicknesses (adjust h-[.] values for visual preference)
              const stringHeightClass = [
                "h-[1.5px]", // High E (thinnest)
                "h-[2px]",
                "h-[2.5px]",
                "h-[3px]",
                "h-[3.5px]",
                "h-[4px]", // Low E (thickest)
              ][stringIdx];

              const cellHeight = 40; // from h-10 (10*4px)
              const borderSpacing = 2; // from border-spacing-0.5 (0.5*4px)
              const stringPixelHeights = [1.5, 2, 2.5, 3, 3.5, 4]; // Corresponding pixel heights

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

          {/* Fretboard Table (buttons are inside this table) */}
          {/* Added mx-auto here to center the table within its container */}
          <table className="border-separate border-spacing-0.5 mx-auto bg-gray-800 rounded-lg overflow-hidden relative">
            <tbody>
              {/* Render 6 strings (rows) - from high E (index 0) to low E (index 5) */}
              {Array.from({ length: 6 }, (_, stringIdx) => {
                const stringNum = stringIdx + 1; // 1 (high E) to 6 (low E)
                return (
                  <tr key={stringIdx}>
                    {/* Render frets (columns) including the nut (fret 0) */}
                    {Array.from({ length: numFrets + 1 }, (__, fretIdx) => {
                      const isNut = fretIdx === 0;
                      const highlighted = isHighlighted(stringNum, fretIdx);
                      const melody = isMelody(stringNum, fretIdx);
                      const playing = isPlaying(stringNum, fretIdx);

                      // Determine if the button should be "active" to get a higher z-index
                      const isActive = highlighted || melody || playing;

                      // Calculate the note name for the current fret
                      const noteName = getNoteName(stringNum, fretIdx);

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
                          {!isNut && (
                            <button
                              className={`
                                relative // Essential for z-index to work
                                w-8 h-8 rounded-full flex items-center justify-center
                                mx-auto my-auto
                                transition-all duration-200 ease-in-out
                                cursor-pointer
                                border-2 border-transparent
                                ${highlighted ? "border-purple-400" : ""}
                                ${melody ? "bg-green-500 shadow-md" : ""}
                                ${
                                  playing
                                    ? "animate-pulse bg-yellow-400 scale-110 shadow-lg"
                                    : ""
                                }
                                ${
                                  !highlighted && !melody && !playing
                                    ? "bg-gray-900 hover:bg-purple-700/50"
                                    : ""
                                }
                                ${
                                  isActive
                                    ? "z-20 text-white font-semibold text-sm"
                                    : "z-10"
                                }
                                hover:z-20 // Ensures hover also brings it to front
                              `}
                              onClick={() => onFretClick(stringNum, fretIdx)}
                              title={`String ${stringNum}, Fret ${fretIdx}`}
                            >
                              {/* Display note name only if the button is active */}
                              {isActive ? noteName : ""}
                            </button>
                          )}
                          {/* Add Nut appearance if it's the nut position */}
                          {isNut && (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-l-lg border-r-2 border-gray-600">
                              {/* Optional: Nut indicator */}
                            </div>
                          )}

                          {/* Fret Inlays (Dots) - only on specific frets and typically in the middle of the neck */}
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

        {/* Fret numbers below the fretboard */}
        {/* Adjusted to align with the fretboard table */}
        <div className="flex gap-0.5 mt-2 mx-auto">
          {" "}
          {/* Use gap-0.5 or gap-1 to match table spacing if needed. Removed bg-amber-400 and border-red for cleaner display */}
          {Array.from({ length: numFrets + 1 }, (__, i) => {
            // Iterate numFrets + 1 times
            const isNutPosition = i === 0;
            return (
              <span
                key={i}
                // Each cell is w-10, table has border-spacing-0.5.
                // For a <td>, w-10 means 40px. border-spacing-0.5 means 2px.
                // The first <td> (nut) has a border-l-2.
                // The frets after the nut (buttons) are w-8 (32px) and mx-auto inside w-10 <td>.
                // This means there's 4px of padding on each side of the button within the <td>.
                // Total width of a fret column (including half of the spacing on each side) is 40px + 2px = 42px.
                // The nut column has border-l-2 (2px) + 40px (td width).
                // To align numbers under the frets, we need to mimic the column widths.
                // The nut number '0' needs to align with the *center* of the nut cell,
                // and subsequent numbers with the *center* of their respective fret cells.

                // Given the complexities of `border-separate` and `border-spacing`,
                // the simplest approach is to match the `w-10` of the `<td>` and `text-center`.
                // The `margin-left` or `padding-left` needs to compensate for the nut's left border
                // and the overall table's centering.

                // Let's simplify and rely on the table's `mx-auto` for overall centering
                // and try to match the column widths.
                className={`w-10 text-center text-xs text-gray-400 ${
                  isNutPosition ? "font-bold" : ""
                }`}
                // The `min-width` and `padding-left` are crucial for aligning with the table columns
                // The first td has border-l-2. So the first number should account for that.
                // All tds have border-r-1 (2px) and are w-10 (40px).
                // Table has border-spacing-0.5 (2px).
                // So, each column conceptually takes up `40px (td) + 2px (spacing)` = 42px.
                // The first cell is 40px + 2px (left border) = 42px.
                // A 'w-10' span is 40px wide. We need to center it within the 42px.
                // The `mx-auto` on the parent div `flex gap-0.5 mx-auto` combined with `w-10` on each span
                // should get it very close.
              >
                {/* Conditional rendering for fret numbers */}
                {isNutPosition ? "Nut" : i}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
