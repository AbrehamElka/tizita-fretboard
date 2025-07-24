// src/components/Header.tsx
"use client"; // This component now needs to be client-side due to useTheme hook

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme hook

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Branding: Elkanah Guitar Logo + Title */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Image
            src="/elkanah-logo.jpg"
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

        {/* Navigation Links and Theme Toggle */}
        <ul className="flex flex-wrap justify-center md:justify-end space-x-6 items-center">
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

          <li>
            <Link
              href="/playground"
              className="text-gray-300 hover:text-white transition-colors text-lg font-bold"
            >
              {" "}
              {/* New Link */}
              Playground
            </Link>
          </li>

          {/* Social Link (e.g., Telegram) */}
          <li>
            <a
              href="https://t.me/your_telegram_channel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors text-lg"
            >
              Telegram
            </a>
          </li>
          {/* Theme Toggle Button */}
          <li>
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <svg
                  className="w-6 h-6 text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-7.757l-.707-.707M6.343 17.657l-.707.707M17.657 6.343l.707-.707M6.343 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg> // Sun icon
              ) : (
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg> // Moon icon
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
