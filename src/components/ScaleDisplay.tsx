// src/components/ScaleDisplay.tsx
import React from "react";
import { Scale, FretPosition } from "@/types"; // Import your Scale type

interface ScaleDisplayProps {
  scale: Scale;
}

// Helper for simplified scale pattern display
const ScalePatternDiagram: React.FC<{
  diagram: FretPosition[];
  rootNotes: FretPosition[];
}> = ({ diagram, rootNotes }) => {
  // This is a very conceptual diagram for now.
  // A true interactive fretboard for scales is much more complex.
  // We'll just list the positions for MVP.

  // For a visual representation:
  // We need to determine the min/max frets and strings involved to size our "grid".
  const allPositions = [...diagram, ...rootNotes];
  if (allPositions.length === 0)
    return <p className="text-gray-500">No pattern data.</p>;

  const maxFret = Math.max(...allPositions.map((pos) => pos[1]));
  const minFret = Math.min(...allPositions.map((pos) => pos[1]));
  const maxString = Math.max(...allPositions.map((pos) => pos[0])); // High E = 1, Low E = 6
  const minString = Math.min(...allPositions.map((pos) => pos[0]));

  const numFretsToShow = maxFret - minFret + 1;
  const numStringsToShow = maxString - minString + 1;

  // Let's create a conceptual grid.
  // This is a very basic textual/grid representation, not a graphical fretboard.
  // A dedicated SVG/Canvas component would be needed for that.

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-semibold text-white mb-3">
        Fretboard Pattern (Simplified)
      </h3>
      <div className="relative overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-1 font-bold">String</th>
              {Array.from({ length: numFretsToShow }).map((_, i) => (
                <th
                  key={`fret-col-${i}`}
                  className="py-2 px-1 font-bold text-center"
                >
                  Fret {minFret + i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, stringIdx) => {
              const currentString = 6 - stringIdx; // Low E (6) at top, High E (1) at bottom
              return (
                <tr
                  key={`string-row-${currentString}`}
                  className="border-t border-gray-600"
                >
                  <td className="py-2 px-1 font-bold text-gray-300">
                    {currentString} (
                    {currentString === 1
                      ? "E"
                      : currentString === 2
                      ? "B"
                      : currentString === 3
                      ? "G"
                      : currentString === 4
                      ? "D"
                      : currentString === 5
                      ? "A"
                      : "E"}
                    )
                  </td>
                  {Array.from({ length: numFretsToShow }).map((_, fretIdx) => {
                    const currentFret = minFret + fretIdx;
                    const isRoot = rootNotes.some(
                      (pos) =>
                        pos[0] === currentString && pos[1] === currentFret
                    );
                    const isNote = diagram.some(
                      (pos) =>
                        pos[0] === currentString && pos[1] === currentFret
                    );

                    let displayChar = "";
                    let bgColor = "";
                    if (isRoot) {
                      displayChar = "R";
                      bgColor = "bg-yellow-500";
                    } else if (isNote) {
                      displayChar = "●"; // Bullet point for any other scale note
                      bgColor = "bg-blue-500";
                    }

                    return (
                      <td
                        key={`cell-${currentString}-${currentFret}`}
                        className={`py-2 px-1 text-center ${bgColor} border border-gray-600`}
                      >
                        {displayChar}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        R = Root Note, ● = Other Scale Note
      </p>
    </div>
  );
};

export default function ScaleDisplay({ scale }: ScaleDisplayProps) {
  // For MVP, assume the first pattern is the one we want to display
  const pattern = scale.patterns[0];

  return (
    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 mb-8 transform hover:scale-105 transition-transform duration-200">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {scale.name}
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
        Root: <span className="font-semibold">{scale.root}</span>
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Type: <span className="font-semibold">{scale.type}</span>
      </p>

      {scale.modes && scale.modes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Ethiopian Modes:
          </h3>
          {scale.modes.map((mode, index) => (
            <div key={index} className="mb-1">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{mode.name}:</span>{" "}
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Notes:
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {scale.notes.join(", ")}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Intervals:
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {scale.intervals.join(", ")}
        </p>
      </div>

      {/* Placeholder for Fretboard Pattern Diagram */}
      {pattern ? (
        <ScalePatternDiagram
          diagram={pattern.diagram}
          rootNotes={pattern.rootNotes}
        />
      ) : (
        <p className="text-red-500 dark:text-red-400">
          No pattern data available for this scale.
        </p>
      )}

      {/* Play Audio Button - Placeholder for now */}
      <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
        Play Audio (Coming Soon!)
      </button>
    </div>
  );
}
