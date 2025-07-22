// src/components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 p-4 text-center mt-8">
      <div className="container mx-auto">
        <p>&copy; {currentYear} Elkanah Guitar. All rights reserved.</p>
        {/* You could add more social links or info here */}
      </div>
    </footer>
  );
}
