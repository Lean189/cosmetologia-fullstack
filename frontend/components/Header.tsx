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
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-sm shadow-md">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

        {/* Logo/Nombre de Marca - RESPONSIVE */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          {/* Logo Placeholder - TODO: Reemplazar con logo real */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-pink-300 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-base">AL</span>
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600 group-hover:text-pink-700 transition">
            <span className="hidden sm:inline">AntoLopez Skinstudio</span>
            <span className="sm:hidden">AntoLopez</span>
          </span>
        </Link>

        {/* Links de Navegación Desktop */}
        <div className="space-x-4 lg:space-x-6 hidden md:flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-pink-600 font-medium transition duration-150 text-sm lg:text-base"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Botón Menú Hamburguesa (Mobile) */}
        <button
          className="md:hidden text-gray-600 hover:text-pink-600 focus:outline-none transition-colors p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
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

      {/* Menú Mobile Desplegable - MEJORADO */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        <div className="flex flex-col px-4 sm:px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-medium block py-2 px-3 rounded-lg transition-all duration-150"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}