// src/types/index.ts

// --- General Types ---
export type Note = string;
export type FretPosition = [number, number]; // [string, fret]

// --- NEW: MelodyStep can be a single note or a chord ---
export interface MelodySequenceItem {
  id: string;
  notes: [number, number][]; // [stringIndex, fretNumber]
  noteNames: string[];
  type: "single" | "chord";
}

// --- Chord Types (existing, but note how MelodySequenceItem uses FretPosition) ---
export interface Chord {
  id: string;
  name: string;
  root: Note;
  type: string;
  positions: Array<{
    name?: string;
    frets: (number | null)[];
    fingers: (number | null)[];
    barre?: {
      fret: number;
      strings: [number, number];
    } | null;
    capo?: number;
  }>;
}

// --- Scale Types (existing) ---
export interface Scale {
  id: string;
  name: string;
  root: Note;
  type: string;
  modes?: {
    name: string;
    description: string;
  }[];
  notes: Note[];
  intervals: string[];
  patterns: Array<{
    name?: string;
    diagram: FretPosition[];
    rootNotes: FretPosition[];
    recommendedFingering?: (number | null)[];
  }>;
}

// --- Melody Types (existing, but the 'tabs' might use MelodySequenceItem now) ---
export interface Melody {
  id: string;
  title: string;
  composer?: string;
  description?: string;
  mode: string;
  // This 'tabs' property would now be an array of MelodySequenceItem[]
  tabs: MelodySequenceItem[]; // Changed from FretPosition[]
  audioPath: string;
}
