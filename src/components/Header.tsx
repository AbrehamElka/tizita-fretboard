// src/components/Header.tsx
"use client"; // This component will have interactive elements like navigation, so it's a Client Component.

import Link from "next/link";
import Image from "next/image"; // For your logo

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Branding: Elkanah Guitar Logo + Title */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          {/* Replace with your actual logo path and alt text */}
          <Image
            src="/elkanah-logo.jpg" // You'll need to create this in your public/ directory
            alt="Elkanah Guitar Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Link
            href="/"
            className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Elkanah Guitar
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center md:justify-end space-x-6">
          <li>
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/chords"
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Chords
            </Link>
          </li>
          <li>
            <Link
              href="/scales"
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Scales
            </Link>
          </li>
          <li>
            <Link
              href="/melodies"
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Melodies
            </Link>
          </li>
          {/* Social Link (e.g., Telegram) */}
          <li>
            <a
              href="https://t.me/your_telegram_channel" // Replace with your actual Telegram link
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Telegram
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
