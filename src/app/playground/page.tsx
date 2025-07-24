// src/app/GuitarPlayground.tsx

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { FretPosition, MelodySequenceItem } from "@/types";
import InteractiveFretboard from "@/components/InteractiveFretboard"; // Corrected path to InteractiveFretboard

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

  const openNote = openNoteInfo.note;
  const openNoteIndex = chromaticScale.indexOf(openNote);
  if (openNoteIndex === -1) return "";

  const totalSteps = openNoteIndex + fretNum;
  const noteIndex = totalSteps % chromaticScale.length;
  const noteName = chromaticScale[noteIndex];
  const currentOctave =
    openNoteInfo.octave + Math.floor((openNoteIndex + fretNum) / 12);

  return `${noteName}${currentOctave}`;
};

// Define Animation Modes
type AnimationMode = "simultaneous" | "sequential";

const GuitarPlayground: React.FC = () => {
  const [selectedMelodySequence, setSelectedMelodySequence] = useState<
    MelodySequenceItem[]
  >([]);
  const [playingNotes, setPlayingNotes] = useState<FretPosition[]>([]);
  const [currentFretboardGroup, setCurrentFretboardGroup] = useState<
    FretPosition[]
  >([]);
  const [animationMode, setAnimationMode] =
    useState<AnimationMode>("simultaneous");
  const [isMelodyPlaying, setIsMelodyPlaying] = useState(false); // State to track if melody is active

  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSequenceIndexRef = useRef<number>(0);
  const numFrets = 15;

  // Ref to track if Ctrl/Cmd key is currently held down
  const isCtrlOrCmdPressed = useRef(false);

  // --- Keyboard Event Listeners (for tracking Ctrl/Cmd state) ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Control" || event.key === "Meta") {
        isCtrlOrCmdPressed.current = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control" || event.key === "Meta") {
        isCtrlOrCmdPressed.current = false;

        if (currentFretboardGroup.length > 0) {
          const chordNoteNames = currentFretboardGroup.map(([s, f]) =>
            getNoteName(s, f)
          );
          const newChord: MelodySequenceItem = {
            id: `chord-${Date.now()}`,
            notes: [...currentFretboardGroup],
            noteNames: chordNoteNames,
            type: "chord",
          };
          setSelectedMelodySequence((prev) => [...prev, newChord]);
          setCurrentFretboardGroup([]);
          setPlayingNotes([]); // Clear immediate highlight after adding to sequence
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentFretboardGroup]);

  // --- Fretboard Interaction Handler ---
  const handleFretboardInteraction = useCallback(
    (notesFromFretboard: FretPosition[]) => {
      setCurrentFretboardGroup(notesFromFretboard);

      setPlayingNotes(notesFromFretboard);
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = setTimeout(() => setPlayingNotes([]), 300);
    },
    []
  );

  // --- Effect to handle adding SINGLE notes to melody sequence ---
  useEffect(() => {
    if (currentFretboardGroup.length === 1 && !isCtrlOrCmdPressed.current) {
      const [stringNum, fretNum] = currentFretboardGroup[0];
      const noteName = getNoteName(stringNum, fretNum);
      const newNote: MelodySequenceItem = {
        id: `${stringNum}-${fretNum}-${Date.now()}`,
        notes: currentFretboardGroup,
        noteNames: [noteName],
        type: "single",
      };
      setSelectedMelodySequence((prev) => [...prev, newNote]);
      setCurrentFretboardGroup([]);
    }
  }, [currentFretboardGroup]);

  // --- Melody Playback and Clear Functions ---
  const playMelody = useCallback(async () => {
    if (selectedMelodySequence.length === 0) return;

    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    setPlayingNotes([]); // Clear any lingering highlights
    currentSequenceIndexRef.current = 0;
    setIsMelodyPlaying(true); // Indicate that playback is active

    const playNextStep = async () => {
      if (currentSequenceIndexRef.current < selectedMelodySequence.length) {
        const currentStep =
          selectedMelodySequence[currentSequenceIndexRef.current];

        if (animationMode === "simultaneous") {
          // Mode 1: All notes in the step highlight simultaneously
          setPlayingNotes(currentStep.notes);
          currentSequenceIndexRef.current++;
          playTimeoutRef.current = setTimeout(() => {
            setPlayingNotes([]); // Clear after highlight
            playNextStep();
          }, 800); // Duration of highlight for a step
        } else {
          // Mode 2: Clear all melody highlights, then animate sequentially from original color
          setPlayingNotes([]); // Ensure no yellow notes from previous step or interaction

          // Small delay to ensure clear state renders
          await new Promise((resolve) => setTimeout(resolve, 50));

          for (const note of currentStep.notes) {
            setPlayingNotes([note]); // Highlight one note at a time in yellow
            await new Promise((resolve) => setTimeout(resolve, 300)); // Highlight duration for single note
            setPlayingNotes([]); // Clear individual note (back to original base color)
            await new Promise((resolve) => setTimeout(resolve, 100)); // Short delay between notes in a chord
          }
          currentSequenceIndexRef.current++;
          // Delay before next chord/note in sequence, after current step's notes have animated
          playTimeoutRef.current = setTimeout(playNextStep, 500);
        }
      } else {
        // Playback finished
        setPlayingNotes([]); // Clear any playing notes
        currentSequenceIndexRef.current = 0;
        setIsMelodyPlaying(false); // Melody playback is no longer active
      }
    };
    playNextStep();
  }, [selectedMelodySequence, animationMode]);

  const clearMelody = useCallback(() => {
    setSelectedMelodySequence([]);
    setPlayingNotes([]);
    setCurrentFretboardGroup([]);
    currentSequenceIndexRef.current = 0;
    setIsMelodyPlaying(false); // Ensure this is false
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  }, []);

  // --- Notes to Display on Fretboard ---
  // When not playing, display all selected melody notes in their static color.
  // When playing in "sequential" mode, this array will be empty to allow notes to revert to original.
  const allMelodyPositions = selectedMelodySequence.flatMap(
    (item) => item.notes
  );
  const notesToShowAsMelody =
    animationMode === "sequential" && isMelodyPlaying
      ? [] // In sequential mode, during playback, melody notes are not statically highlighted
      : [...allMelodyPositions, ...currentFretboardGroup]; // Otherwise, show melody notes + current group

  // --- Render Method ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
        Guitar Playground
      </h1>

      <div className="mb-8">
        <InteractiveFretboard
          numFrets={numFrets}
          onFretboardInteraction={handleFretboardInteraction}
          melodyNotes={notesToShowAsMelody} // These are the statically highlighted notes
          playingNotes={playingNotes} // These are the dynamically animated notes
          isMelodyPlaying={isMelodyPlaying} // Pass the new state
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

        {/* Animation Mode Selector */}
        <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg shadow-md">
          <label htmlFor="animation-mode" className="text-gray-300 text-sm">
            Animation:
          </label>
          <select
            id="animation-mode"
            value={animationMode}
            onChange={(e) => setAnimationMode(e.target.value as AnimationMode)}
            className="bg-gray-700 text-white rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="simultaneous">Simultaneous</option>
            <option value="sequential">Sequential</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">
          Selected Melody Sequence:
        </h2>
        {selectedMelodySequence.length === 0 ? (
          <p className="text-gray-400">
            Click on the fretboard (or **hold Ctrl/Cmd** and click multiple
            notes to create a chord) to build your melody!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedMelodySequence.map((item, index) => (
              <span
                key={item.id}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  playingNotes.length > 0 &&
                  item.notes.every((note) =>
                    playingNotes.some(
                      (pn) => pn[0] === note[0] && pn[1] === note[1]
                    )
                  ) &&
                  index === currentSequenceIndexRef.current - 1 &&
                  animationMode === "simultaneous"
                    ? "bg-purple-500 text-white animate-pulse" // Only pulse the text for simultaneous
                    : "bg-purple-900 text-purple-200"
                }`}
              >
                {item.type === "single"
                  ? `S${item.notes[0][0]}-F${item.notes[0][1]} (${item.noteNames[0]})`
                  : `Chord: [${item.notes
                      .map(([s, f]) => `S${s}F${f}`)
                      .join(", ")}] (${item.noteNames.join(", ")})`}
              </span>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .shadow-purple-glow {
          box-shadow: 0 0 10px 3px rgba(168, 85, 247, 0.7);
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
