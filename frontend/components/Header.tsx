// frontend/components/Header.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';

// Lista de secciones y sus IDs
const navItems = [
  { name: 'Historia', href: '#about' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Reservar', href: '/reservar' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white shadow-md">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo/Nombre de Marca */}
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition">
            AntoLopez Skinstudio
          </a>
        </Link>

        {/* Links de Navegación Desktop */}
        <div className="space-x-6 hidden md:flex">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} legacyBehavior>
              <a className="text-gray-600 hover:text-pink-600 font-medium transition duration-150">
                {item.name}
              </a>
            </Link>
          ))}
        </div>

        {/* Botón Menú Hamburguesa (Mobile) */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menú Mobile Desplegable */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} legacyBehavior>
                <a
                  className="text-gray-600 hover:text-pink-600 font-medium block"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}