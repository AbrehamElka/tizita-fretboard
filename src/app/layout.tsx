// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext"; // Import ThemeProvider

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
        <ThemeProvider>
          {" "}
          {/* Wrap your content with ThemeProvider */}
          <Header />
          <main className="flex-grow container mx-auto p-4">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
