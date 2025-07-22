// src/app/melodies/page.tsx
import MelodyDisplay from "@/components/MelodyDisplay";
import { Melody } from "@/types"; // Import your Melody type
import fs from "fs";
import path from "path";

// Function to read static melody data
async function getMelodies(): Promise<Melody[]> {
  const filePath = path.join(process.cwd(), "src", "data", "melodies.json");
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default async function MelodiesPage() {
  const melodies = await getMelodies();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
        Melody Player
      </h1>
      <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-10">
        Practice popular mezmur melodies with interactive tabs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {melodies.map((melody) => (
          <MelodyDisplay key={melody.id} melody={melody} />
        ))}
      </div>
    </div>
  );
}
