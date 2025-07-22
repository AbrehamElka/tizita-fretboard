// src/app/scales/page.tsx
import ScaleDisplay from "@/components/ScaleDisplay";
import { Scale } from "@/types"; // Import your Scale type
import fs from "fs";
import path from "path";

// Function to read static scale data
async function getScales(): Promise<Scale[]> {
  const filePath = path.join(process.cwd(), "src", "data", "scales.json");
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default async function ScalesPage() {
  const scales = await getScales();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
        Scale Viewer
      </h1>
      <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-10">
        Explore different scales and their patterns on the guitar fretboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scales.map((scale) => (
          <ScaleDisplay key={scale.id} scale={scale} />
        ))}
      </div>
    </div>
  );
}
