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
  title: "Estudio de Cosmética | Capital Federal", // Título SEO clave
  description: "Tratamientos faciales, Manicura en Capital Federal. Reserva tu cita online.", // Descripción importante para Google
  keywords: ["cosmetologia", "tratamientos faciales", "manicura", "reservar cita",], // Palabras clave
  // Añadir opengraph para redes sociales (opcional)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"> 
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
          <Footer />
        <WhatsAppButton /> {/* <-- Botón añadido al final del <body> */}
      </body>
    </html>
  );
}

