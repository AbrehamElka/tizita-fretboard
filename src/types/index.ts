// src/types/index.ts

// --- General Types ---
// Represents a single note (e.g., 'C', 'C#', 'Db', 'D', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B')
export type Note = string;

// Represents a string-fret position on the guitar (e.g., [string_number, fret_number])
// String numbers typically 1 (high E) to 6 (low E) or 6 (low E) to 1 (high E) - we'll use 1-6 from high E to low E for now
// Fret numbers 0 (open) to X
export type FretPosition = [number, number]; // [string, fret]

// --- Chord Types ---
export interface Chord {
  id: string; // Unique identifier (e.g., 'A-major', 'E-minor')
  name: string; // Display name (e.g., 'A Major', 'E minor')
  root: Note; // The root note of the chord (e.g., 'A', 'E')
  type: string; // The type of chord (e.g., 'major', 'minor', '7th', 'sus4')
  positions: Array<{
    // An array to allow for different voicings/positions of the same chord
    name?: string; // Optional: "Open Position", "Barre A-shape", etc.
    frets: (number | null)[]; // Array of frets for each string (6 strings, high E to low E). Null for muted string.
    fingers: (number | null)[]; // Array of finger numbers for each string (1=index, 2=middle, 3=ring, 4=pinky). Null for open/muted.
    barre?: {
      // Optional: for barre chords
      fret: number; // The fret where the barre is
      strings: [number, number]; // [startString, endString] for the barre (e.g., [1, 6] for full barre)
    } | null;
    capo?: number; // Optional: fret where capo is placed if applicable for this voicing
  }>;
  // We'll add audio property later in Phase 3
  // audioPath?: string; // Path to pre-recorded audio or info for Tone.js
}

// --- Scale Types ---
export interface Scale {
  id: string; // Unique identifier (e.g., 'C-major', 'A-minor-pentatonic')
  name: string; // Display name (e.g., 'C Major Scale', 'A Minor Pentatonic')
  root: Note; // The root note of the scale (e.g., 'C', 'A')
  type: string; // The type of scale (e.g., 'major', 'minor', 'pentatonic', 'melodic-minor', 'harmonic-minor')
  modes?: {
    // For Ethiopian modes based on Western scales
    name: string; // e.g., "1st (Ambassel)"
    description: string;
  }[];
  notes: Note[]; // All notes in the scale (e.g., ['C', 'D', 'E', 'F', 'G', 'A', 'B'])
  intervals: string[]; // Interval names (e.g., ['1', '2', '3', '4', '5', '6', '7'])
  patterns: Array<{
    // Different positions or shapes on the fretboard
    name?: string; // Optional: "Box 1", "CAGED E-shape"
    diagram: FretPosition[]; // Array of [string, fret] for the main notes in this pattern
    rootNotes: FretPosition[]; // Array of [string, fret] for the root notes in this pattern
    recommendedFingering?: (number | null)[]; // Optional: Suggested fingerings for the pattern
  }>;
}

// --- Melody Types ---
export interface Melody {
  id: string; // Unique identifier (e.g., 'mezmur-1-title')
  title: string; // Display title of the mezmur
  composer?: string; // Optional: Original composer/source
  description?: string; // Optional: Short description of the mezmur
  mode: string; // The Ethiopian mode it's based on (e.g., 'Ambassel', 'Tizita', 'Bati', 'Anchi Hoye')
  // For the MVP, we'll keep the tabs simple
  tabs: FretPosition[]; // Array of [string, fret] sequences for the melody
  audioPath: string; // Path to the pre-recorded audio file for the melody
  // Later: more complex tab format, tempo, etc.
}

// NEW: Type for an item in the melody sequence
export interface MelodySequenceItem {
  id: string; // Unique ID for keying, deletion, reordering
  string: number; // 1-indexed string number
  fret: number; // 0-indexed fret number
  noteName: string; // The calculated musical note name (e.g., "C4")
}
