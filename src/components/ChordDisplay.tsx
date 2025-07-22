// src/components/ChordDisplay.tsx
import React from "react";
import { Chord, FretPosition } from "@/types"; // Import your Chord type

interface ChordDisplayProps {
  chord: Chord;
}

// Helper to render a basic fretboard (very simplistic for now)
const FretboardDiagram: React.FC<{
  frets: (number | null)[];
  fingers: (number | null)[];
  barre?: Chord["positions"][0]["barre"]; // Add barre prop here
}> = ({ frets, fingers, barre }) => {
  // Destructure barre from props
  // This is a highly simplified SVG representation.
  // A proper one would involve more complex SVG calculations for lines, dots, nut, etc.
  // For MVP, we'll just show the strings and frets relevant to the chord.

  // Assuming 6 strings (index 0-5 for high E to low E)
  // Let's reverse for visual consistency, as guitar diagrams often show low E at the bottom
  const reversedFrets = [...frets].reverse();
  const reversedFingers = [...fingers].reverse();

  // Find the highest fret used in the current position to correctly scale the diagram.
  // If no fretted notes, default to 4 frets for visibility.
  const maxFrettedNote = Math.max(
    ...(frets.filter((fret) => fret !== null && fret !== 0) as number[]),
    0
  );
  const displayFretCount = Math.max(
    maxFrettedNote > 0 ? maxFrettedNote + 1 : 5,
    5
  ); // Show at least 5 frets, or more if chord extends
  const fretHeightPercentage = 100 / displayFretCount;

  return (
    <div className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow-md mt-4 text-white">
      <h3 className="text-xl font-semibold mb-3">Fretboard Diagram</h3>
      <div className="relative w-48 h-64 border-l border-b border-gray-600 rounded-sm overflow-hidden">
        {/* Nut (thick line for open chords) */}
        {frets.some((f) => f === 0) && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-gray-400 z-10"></div>
        )}

        {/* Fret lines */}
        {[...Array(displayFretCount)].map((_, i) => (
          <div
            key={`fret-${i}`}
            className="absolute left-0 right-0 h-px bg-gray-500"
            style={{ top: `${(i + 1) * fretHeightPercentage}%` }}
          ></div>
        ))}
        {/* String lines (6 strings) */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`string-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gray-500"
            style={{ left: `${i * (100 / 5)}%` }}
          ></div>
        ))}

        {/* Frets and Fingers */}
        {reversedFrets.map((fret, stringIdx) => {
          // stringIdx is 0 (low E) to 5 (high E) in reversedFrets
          // originalStringIdx is 0 (high E) to 5 (low E) for the data
          const originalStringIdx = 5 - stringIdx;
          const finger = reversedFingers[stringIdx];

          // Calculate approximate center position for the dot/text
          const stringCenterPos = stringIdx * (100 / 5) + 100 / 5 / 2;
          let dotTopPos;

          if (fret === null) {
            // Muted string (X) - above the nut area
            return (
              <div
                key={`s${stringIdx}-x`}
                className="absolute text-red-400 font-bold"
                style={{
                  top: "-15px", // Above the diagram
                  left: `${stringCenterPos}%`,
                  transform: "translateX(-50%)",
                }}
              >
                X
              </div>
            );
          } else if (fret === 0) {
            // Open string (O) - above the nut area
            return (
              <div
                key={`s${stringIdx}-o`}
                className="absolute text-green-400 font-bold"
                style={{
                  top: "-15px", // Above the diagram
                  left: `${stringCenterPos}%`,
                  transform: "translateX(-50%)",
                }}
              >
                O
              </div>
            );
          } else {
            // Fretted note
            dotTopPos = fret * fretHeightPercentage - fretHeightPercentage / 2;

            return (
              <React.Fragment key={`s${stringIdx}-f${fret}`}>
                <div
                  className="absolute w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10"
                  style={{
                    top: `${dotTopPos}%`,
                    left: `${stringCenterPos}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {finger}
                </div>
              </React.Fragment>
            );
          }
        })}

        {/* Barre line - drawn separately after dots to ensure proper layering and calculation */}
        {barre && (
          <div
            className="absolute bg-blue-400 rounded-full z-0"
            style={{
              height: "8px",
              width: `${
                (barre.strings[1] - barre.strings[0] + 1 - 1) * (100 / 5) + 24
              }px`, // Adjusted width based on string spacing
              top: `${
                barre.fret * fretHeightPercentage - fretHeightPercentage / 2
              }%`,
              left: `${(6 - barre.strings[1]) * (100 / 5) + 10}px`, // Position for low E side of barre (adjust to match fret dots)
              transform: "translate(0%, -50%)",
              zIndex: 0,
            }}
          ></div>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-2">
        (O = Open String, X = Muted String)
      </p>
    </div>
  );
};

export default function ChordDisplay({ chord }: ChordDisplayProps) {
  // For MVP, assume the first position is the one we want to display
  const position = chord.positions[0];

  if (!position) {
    return (
      <p className="text-red-500 dark:text-red-400">
        No position data available for this chord.
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 mb-8 transform hover:scale-105 transition-transform duration-200">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {chord.name}
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
        Root: <span className="font-semibold">{chord.root}</span>
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Type: <span className="font-semibold">{chord.type}</span>
      </p>

      {/* Placeholder for Fretboard Diagram */}
      <FretboardDiagram
        frets={position.frets}
        fingers={position.fingers}
        barre={position.barre} // <-- Pass the barre data here!
      />

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          String-wise Fingering (High E to Low E):
        </h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {position.frets.map((fret, index) => (
            <li key={index}>
              String {index + 1}: Fret{" "}
              {fret === null ? "Muted (X)" : fret === 0 ? "Open (O)" : fret}{" "}
              {position.fingers[index] !== null &&
                `(Finger: ${position.fingers[index]})`}
            </li>
          ))}
        </ul>
      </div>

      {/* Play Audio Button - Placeholder for now */}
      <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
        Play Audio (Coming Soon!)
      </button>
    </div>
  );
}
