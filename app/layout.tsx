import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AntoLopez Skinstudio | Especialista en Piel en CABA",
  description: "Descubrí tu mejor versión con tratamientos faciales personalizados, ciencia avanzada y dermocosmética en Capital Federal. Reservá tu cita online hoy.",
  keywords: ["cosmetología CABA", "limpieza de cutis profunda", "peeling químico", "anti-age", "beauty studio"],
  openGraph: {
    title: "AntoLopez Skinstudio | Cuidado de la Piel Profesional",
    description: "Tratamientos personalizados para una piel radiante. Reservá tu turno online.",
    url: "https://antonellalopez.com", // Reemplazar con URL real si existe
    siteName: "AntoLopez Skinstudio",
    images: [
      {
        url: "/antonella-professional.jpg",
        width: 1200,
        height: 630,
        alt: "AntoLopez Skinstudio",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster position="top-right" />
        {children}
        <Footer />
        <WhatsAppButton /> {/* <-- Botón añadido al final del <body> */}
      </body>
    </html>
  );
}

