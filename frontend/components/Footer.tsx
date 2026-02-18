// frontend/components/Footer.tsx
"use client";

import Link from 'next/link';
import React from 'react';

// Información de contacto y legal (ajusta los placeholders)
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 border-t border-pink-700">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Columna 1: Marca y Contacto */}
        <div>
          <h3 className="text-xl font-bold text-pink-400 mb-4">
            AntoLopez Skinstudio
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            📍 Gabinete Palermo, Caba
          </p>
          <p className="text-gray-400 text-sm mb-2">
            📧 @antolopez.skinstudio
          </p>
          <p className="text-gray-400 text-sm">
            📞 [Tu Teléfono]
          </p>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#hero" className="text-gray-400 hover:text-pink-400 transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/#about" className="text-gray-400 hover:text-pink-400 transition">
                Historia
              </Link>
            </li>
            <li>
              <Link href="/#servicios" className="text-gray-400 hover:text-pink-400 transition">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/reservar" className="text-gray-400 hover:text-pink-400 transition">
                Reservar Cita
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Horarios de Atención */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Horarios</h3>
          <p className="text-gray-400 text-sm">
            Lunes, Miércoles, Viernes :
            10:00 - 19:00
          </p>
        </div>

        {/* Columna 4: Redes Sociales (Placeholders) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
          {/* Aquí puedes poner iconos de redes sociales */}
          <div className="flex space-x-4 text-gray-400">
            {/* Ícono de Instagram, Facebook, etc. */}
            [Instagram Icon Placeholder]
            [Facebook Icon Placeholder]
          </div>
        </div>
      </div>

      {/* Derechos de Autor */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {CURRENT_YEAR} Antolopez Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}