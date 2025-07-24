// src/types.ts

// Existing types (keep them as they are)
export type FretPosition = [number, number]; // [stringNumber, fretNumber] e.g., [1, 5] for High E string, 5th fret

export interface MelodySequenceItem {
  id: string;
  notes: FretPosition[];
  noteNames: string[];
  type: "single" | "chord";
}

// --- New Types for Chords ---

export interface ChordPosition {
  name: string; // e.g., "Open Position", "Barre E-shape"
  frets: (number | null)[]; // Array of fret numbers (0 for open, null for muted), from high E (string 1) to low E (string 6)
  fingers: (number | null)[]; // Array of finger numbers (1-4), null for open/muted
  barre: {
    fret: number;
    stringFrom: number; // 1-indexed (1: high E, 6: low E)
    stringTo: number; // 1-indexed
  } | null;
}

export interface Chord {
  id: string;
  name: string;
  root: string; // e.g., "A", "C#", "E"
  type: string; // e.g., "major", "minor", "7th"
  positions: ChordPosition[];
}

// The top-level structure of your chords.json
export interface ChordsData {
  [rootNote: string]: Chord[]; // Keyed by root note (e.g., "A", "A#"), value is an array of Chord objects
}
