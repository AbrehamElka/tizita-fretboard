// src/app/chords/page.tsx
import ChordDisplay from "@/components/ChordDisplay";
import { Chord } from "@/types"; // Import your Chord type
import fs from "fs";
import path from "path";

// Function to read static chord data
// This is a Server Component, so we can use Node.js file system modules (fs, path)
async function getChords(): Promise<Chord[]> {
  const filePath = path.join(process.cwd(), "src", "data", "chords.json");
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default async function ChordsPage() {
  const chords = await getChords();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
        Chord Viewer
      </h1>
      <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-10">
        Select a chord to view its fretboard diagram and fingering.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chords.map((chord) => (
          <ChordDisplay key={chord.id} chord={chord} />
        ))}
      </div>
    </div>
  );
}
