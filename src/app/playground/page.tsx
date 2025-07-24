// src/app/GuitarPlayground.tsx

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { FretPosition, MelodySequenceItem } from "@/types";
import InteractiveFretboard from "@/components/InteractiveFretboard";

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
type AnimationMode = "simultaneous" | "fade-in";

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
  const [isMelodyPlaying, setIsMelodyPlaying] = useState(false);

  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSequenceIndexRef = useRef<number>(0);
  const numFrets = 15;

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

        // When Ctrl/Cmd is released, if there's a group, add it as a chord
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
          setCurrentFretboardGroup([]); // Clear the blue highlight after adding to sequence
          setPlayingNotes([]); // Clear any temporary yellow highlight
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentFretboardGroup]); // Dependency to ensure the latest currentFretboardGroup is captured

  // --- Fretboard Interaction Handler ---
  // This function is called by InteractiveFretboard when a fret/nut is clicked.
  // It receives the notes that were just clicked.
  const handleFretboardInteraction = useCallback(
    (clickedNote: FretPosition) => {
      // Now receives a single clicked note
      // If Ctrl/Cmd is pressed, manage the current group selection (blue highlight)
      if (isCtrlOrCmdPressed.current) {
        setCurrentFretboardGroup((prevGroup) => {
          const isAlreadyInGroup = prevGroup.some(
            ([s, f]) => s === clickedNote[0] && f === clickedNote[1]
          );
          if (isAlreadyInGroup) {
            return prevGroup.filter(
              ([s, f]) => !(s === clickedNote[0] && f === clickedNote[1])
            );
          } else {
            return [...prevGroup, clickedNote];
          }
        });
        // For Ctrl/Cmd clicks, also show immediate yellow highlight for the clicked note
        setPlayingNotes([clickedNote]);
        if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = setTimeout(() => setPlayingNotes([]), 300);
      } else {
        // If not Ctrl/Cmd, it's a single note selection
        // Clear any ongoing chord selection
        setCurrentFretboardGroup([]);
        // Add single note to melody sequence immediately
        const noteName = getNoteName(clickedNote[0], clickedNote[1]);
        const newNote: MelodySequenceItem = {
          id: `${clickedNote[0]}-${clickedNote[1]}-${Date.now()}`,
          notes: [clickedNote],
          noteNames: [noteName],
          type: "single",
        };
        setSelectedMelodySequence((prev) => [...prev, newNote]);

        // Show immediate yellow highlight for the single note
        setPlayingNotes([clickedNote]);
        if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = setTimeout(() => setPlayingNotes([]), 300);
      }
    },
    [] // No dependencies that change often, so it's stable
  );

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

        // Both simultaneous and fade-in modes will highlight chords simultaneously
        setPlayingNotes(currentStep.notes); // Highlight all notes in the step in yellow
        currentSequenceIndexRef.current++;
        playTimeoutRef.current = setTimeout(() => {
          setPlayingNotes([]); // Clear the highlight
          playNextStep();
        }, 800); // Duration of highlight for a step
      } else {
        // Playback finished
        setPlayingNotes([]); // Clear any playing notes
        currentSequenceIndexRef.current = 0;
        setIsMelodyPlaying(false); // Melody playback is no longer active
      }
    };
    playNextStep();
  }, [selectedMelodySequence, animationMode]); // animationMode is a dependency as it influences how melodyNotes are passed

  const clearMelody = useCallback(() => {
    // Clear ALL state related to melody, playing notes, and current selection
    setSelectedMelodySequence([]);
    setPlayingNotes([]);
    setCurrentFretboardGroup([]); // Crucial for clearing blue highlight
    currentSequenceIndexRef.current = 0;
    setIsMelodyPlaying(false); // Ensure playback state is reset

    // Clear any active timeouts to stop ongoing animations
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  }, []); // Empty dependency array, as it only resets state

  // --- Notes to Display on Fretboard ---
  // `notesToShowAsMelody` for the static green highlight.
  // It should include `currentFretboardGroup` for blue highlights when building a chord.
  const allMelodyPositions = selectedMelodySequence.flatMap(
    (item) => item.notes
  );

  const notesToShowAsMelody =
    animationMode === "fade-in" && isMelodyPlaying
      ? [] // In "fade-in" mode, during playback, static melody notes are temporarily "hidden"
      : allMelodyPositions; // Otherwise, show recorded melody notes

  // The notes that are actively selected by Ctrl/Cmd (blue) OR are being played (yellow)
  // These are passed to InteractiveFretboard's specific props
  const notesForFretboardMelodyProp = notesToShowAsMelody; // This is for static green (or hidden in fade-in)
  const notesForFretboardPlayingProp = playingNotes; // This is for yellow pulse
  const notesForFretboardCurrentGroupProp = currentFretboardGroup; // This is for blue selection

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
          melodyNotes={notesForFretboardMelodyProp} // Static green (or hidden)
          playingNotes={notesForFretboardPlayingProp} // Yellow pulse
          currentGroupSelection={notesForFretboardCurrentGroupProp} // Blue highlight for active selection
          isMelodyPlaying={isMelodyPlaying} // Pass the new state
          animationMode={animationMode} // Pass animation mode for conditional rendering in Fretboard
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
            <option value="fade-in">Fade In</option> {/* Renamed option */}
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
                  index === currentSequenceIndexRef.current - 1
                    ? "bg-purple-500 text-white animate-pulse" // This pulse applies to currently playing notes in the sequence text
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
