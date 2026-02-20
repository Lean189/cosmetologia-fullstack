// frontend/app/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';

// --- INTERFACES ---
interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion_minutos: number;
  activo: boolean;
}

interface Testimonio {
  id: number;
  nombre: string;
  quote: string;
}

// --- CONSTANTES ---
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// --- FUNCIONES DE FETCHING (Server Components) ---
async function getServicios(): Promise<Servicio[]> {
  try {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) {
      console.error("Supabase Error (getServicios):", error.message);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return [];
  }
}

async function getTestimonios(): Promise<Testimonio[]> {
  try {
    const { data, error } = await supabase
      .from('testimonios')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error (getTestimonios):", error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error al obtener testimonios:", error);
    return [];
  }
}


// --- COMPONENTE AUXILIAR (TestimonialCard) ---
const TestimonialCard = ({ quote, name }: { quote: string, name: string }) => (
  <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border-l-4 border-pink-400 hover:shadow-lg transition-shadow duration-300">
    <p className="text-gray-600 italic mb-4 line-clamp-4 text-sm md:text-base">&ldquo;{quote}&rdquo;</p>
    <p className="text-pink-700 font-semibold text-sm md:text-base">— {name}</p>
  </div>
);

// --- COMPONENTE PRINCIPAL (ASÍNCRONO - Server Component) ---
export default async function LandingPage() {
  const [servicios, testimonios] = await Promise.all([
    getServicios(),
    getTestimonios()
  ]);

  return (
    <main className="overflow-x-hidden">
      <Header />

      {/* 1. SECCIÓN HERO (Inicio) - RESPONSIVE */}
      <section
        id="hero"
        className="pt-16 md:pt-20 min-h-[70vh] md:h-[85vh] flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f9a8d4 50%, #fce7f3 100%)',
        }}
      >
        {/* Overlay con imagen de fondo - Puedes reemplazar con tu imagen */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-pink-600/30 to-pink-300/20">
          {/* TODO: Reemplazar con: <Image src="/hero-background.jpg" alt="Spa background" fill className="object-cover mix-blend-overlay" /> */}
        </div>

        {/* Contenido centrado - RESPONSIVE */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8 py-12 md:py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-white mb-4 md:mb-6 leading-tight">
            Tu Piel, Nuestra Obra de Arte
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Tratamientos personalizados, ciencia avanzada, y amor por la belleza natural.
          </p>
          <Link
            href="/reservar"
            className="inline-block bg-white text-pink-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-pink-50 transition duration-300 shadow-2xl uppercase tracking-wider"
          >
            Reservar Mi Cita Ahora
          </Link>
        </div>
      </section>

      <hr className="border-t border-pink-200" />

      {/* 2. SECCIÓN HISTORIA/ACERCA DE - RESPONSIVE */}
      <section id="about" className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:flex md:items-center md:gap-12 lg:gap-16">

          {/* Columna de Imagen - RESPONSIVE */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="rounded-xl shadow-2xl overflow-hidden aspect-square bg-gradient-to-br from-pink-100 via-pink-50 to-white flex items-center justify-center relative">
              {/* TODO: Reemplazar con tu imagen */}
              <div className="text-center p-8">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 rounded-full bg-pink-200/50 flex items-center justify-center">
                  <svg className="w-16 h-16 md:w-20 md:h-20 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm md:text-base">Foto Profesional</p>
              </div>
              <Image src="/antonella-professional.jpg" alt="Antonella - Cosmetóloga Profesional" fill className="object-cover" />
            </div>
          </div>

          {/* Columna de Texto - RESPONSIVE */}
          <div className="md:w-1/2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-pink-700 mb-4 md:mb-6">
              Conoce a Antonella
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed border-l-4 border-pink-400 pl-4 text-sm sm:text-base md:text-lg">
              &ldquo;Mi misión es simple: que cada cliente salga sintiéndose renovado, confiado y amado por su propia piel. Utilizo solo técnicas validadas.&rdquo;
            </p>
            <p className="text-gray-500 italic leading-relaxed text-sm sm:text-base">
              Anto es una cosmetóloga certificada con más de 7 años de experiencia, especializada en tratamientos faciales anti-edad y dermocosmética.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-t border-pink-200" />

      {/* 3. SECCIÓN SERVICIOS DESTACADOS - RESPONSIVE */}
      <section id="servicios" className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-pink-700 mb-3 md:mb-4">
            Nuestro Catálogo de Tratamientos 🌟
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 md:mb-12 max-w-2xl mx-auto">
            Desliza para conocer el catálogo completo. ¡Hay un tratamiento perfecto para ti!
          </p>

          {/* CONTENEDOR DEL CARRUSEL - RESPONSIVE */}
          <div
            className="flex space-x-4 md:space-x-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory 
                      scrollbar-thin scrollbar-thumb-pink-400/50 scrollbar-track-pink-100 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {servicios.length === 0 ? (
              <p className="text-gray-600 text-base md:text-lg p-6 md:p-10 bg-white rounded-xl shadow-md min-w-full">
                No hay servicios disponibles en este momento. ¡Volveremos pronto!
              </p>
            ) : (
              servicios.map((servicio) => (
                <div
                  key={servicio.id}
                  className="snap-center shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[30vw] xl:w-1/4 
                            bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-pink-100 
                            transition duration-300 transform hover:scale-[1.02] 
                            hover:shadow-pink-300/50 hover:shadow-2xl text-left"
                >
                  {/* Imagen del servicio - Placeholder */}
                  <div className="w-full h-40 md:h-48 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                    <svg className="w-16 h-16 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {/* TODO: <Image src="/service-image.jpg" alt={servicio.nombre} fill className="object-cover" /> */}
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif text-pink-700 mb-3 border-b border-gray-100 pb-3">
                    {servicio.nombre}
                  </h3>
                  <p className="text-gray-600 mb-4 h-16 md:h-20 overflow-hidden line-clamp-3 text-sm md:text-base">
                    {servicio.descripcion}
                  </p>
                  <div className="mt-4 md:mt-6 border-t pt-4">
                    <span className="text-2xl md:text-3xl font-extrabold text-pink-600 block">
                      ${parseFloat(servicio.precio).toFixed(2)}
                    </span>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Duración: {servicio.duracion_minutos} min</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/reservar"
            className="mt-8 md:mt-12 inline-block bg-pink-500 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-bold hover:bg-pink-600 transition duration-300 shadow-lg"
          >
            Reservar Cita Ahora
          </Link>
        </div>
      </section>

      <hr className="border-t border-pink-200" />

      {/* 4. SECCIÓN TESTIMONIOS - RESPONSIVE */}
      <section id="testimonios" className="py-12 md:py-20 bg-pink-100/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-pink-700 mb-8 md:mb-12">
            Historias Reales de Pieles Felices ❤️
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {testimonios.length === 0 ? (
              <div className="col-span-full">
                <p className="text-gray-500 italic">Cargando comentarios positivos...</p>
              </div>
            ) : (
              testimonios.map((t) => (
                <TestimonialCard
                  key={t.id}
                  quote={t.quote}
                  name={t.nombre}
                />
              ))
            )}
          </div>
        </div>
      </section>


      <hr className="border-t border-pink-200" />

      {/* 5. SECCIÓN FINAL - RESPONSIVE */}
      <section className="py-12 md:py-20 bg-pink-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">¡Da el Primer Paso!</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Tu piel te lo agradecerá. Agenda tu diagnóstico y tratamiento hoy mismo.
          </p>
          <Link
            href="/reservar"
            className="inline-block bg-white text-pink-700 px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold hover:bg-gray-200 transition duration-300 shadow-2xl uppercase"
          >
            Reservar Ahora
          </Link>
        </div>
      </section>

    </main>
  );
}