// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
        Welcome to Elkanah Guitar!
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
        Your ultimate companion for learning and practicing Western and
        Ethiopian chords and melodies, especially suited for mezmur.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        <HomeLink href="/chords" text="Explore Chords" />
        <HomeLink href="/scales" text="Discover Scales" />
        <HomeLink href="/melodies" text="Play Melodies" />
      </div>

      {/* Basic instructions or call to action */}
      <p className="mt-12 text-gray-600 dark:text-gray-400">
        Start by navigating through the sections above.
      </p>
    </div>
  );
}

// A simple reusable component for the home page links
import Link from "next/link";

function HomeLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
    >
      {text}
    </Link>
  );
}
