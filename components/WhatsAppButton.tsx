// frontend/components/WhatsAppButton.tsx
"use client";

import React from 'react';

// Reemplaza XXXXXXXXXX con el número de teléfono (código de país + número, sin +, espacios o guiones)
const WHATSAPP_NUMBER = "5491122334455"; // EJEMPLO: 54 (Argentina) 9 (móvil) 11 (código de área) y el número

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20sus%20servicios%20de%20cosmetología.`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
    
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.01 0C5.39 0 0 5.39 0 12.01c0 2.2 0.58 4.3 1.68 6.16l-1.3 4.75 4.9-1.28c1.78 0.98 3.82 1.54 5.73 1.54 6.61 0 12.01-5.39 12.01-12.01C24.02 5.39 18.63 0 12.01 0zm5.55 16.48l-.9-.54c-.2-.12-.44-.19-.68-.19s-.48.07-.68.19c-.2.12-.31.33-.31.54s.11.42.31.54c.2.12.44.19.68.19s.48-.07.68-.19l.9-.54c.48-.28.84-.7.98-1.2s.06-1.05-.28-1.53c-.34-.48-.84-.8-1.42-.94l-3.3-1.6c-.54-.26-1.13-.39-1.74-.39-.62 0-1.2.13-1.73.39l-.9.54c-.48.28-.84.7-.98 1.2s-.06 1.05.28 1.53c.34.48.84.8 1.42.94l3.3 1.6c.54.26 1.13.39 1.74.39.62 0 1.2-.13 1.73-.39z"/>
      </svg>
    </a>
  );
}