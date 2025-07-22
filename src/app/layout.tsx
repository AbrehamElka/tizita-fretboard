// src/app/layout.tsx
import "./globals.css"; // Your global Tailwind CSS imports
import { Inter } from "next/font/google"; // Example font, use what you prefer
import Header from "@/components/Header"; // Import your Header component
import Footer from "@/components/Footer"; // Import your Footer component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Elkanah Guitar - Mezmur Practice App",
  description:
    "Learn and practice Western and Ethiopian chords and melodies for mezmur.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
      >
        <Header />
        <main className="flex-grow container mx-auto p-4">
          {children} {/* This is where your page content will be rendered */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
