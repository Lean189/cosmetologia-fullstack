// frontend/components/Header.tsx
"use client";

import Link from 'next/link';

// Lista de secciones y sus IDs
const navItems = [
  { name: 'Historia', href: '#about' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Reservar', href: '/reservar' },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white shadow-md">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo/Nombre de Marca */}
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition">
            AntoLopez Skinstudio
          </a>
        </Link>

        {/* Links de Navegación */}
        <div className="space-x-6 hidden md:flex">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} legacyBehavior>
              <a className="text-gray-600 hover:text-pink-600 font-medium transition duration-150">
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}