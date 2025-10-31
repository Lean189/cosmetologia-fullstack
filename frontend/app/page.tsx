// frontend/app/page.tsx

import axios from 'axios';
import Link from 'next/link';
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

// --- CONSTANTES ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';

// --- FUNCION DE FETCHING (Server Component) ---
async function getServicios(): Promise<Servicio[]> {
  try {
    // La petición se hace en el servidor de Next.js
    const response = await axios.get<Servicio[]>(`${API_URL}servicios/`);
    
    // Retorna solo los 3 primeros servicios activos para la sección destacada
    return response.data.filter(s => s.activo);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    // Devuelve un array vacío para que la página no falle
    return []; 
  }
}


// --- COMPONENTE AUXILIAR (TestimonialCard) ---
const TestimonialCard = ({ quote, name }: { quote: string, name: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-400">
    <p className="text-gray-600 italic mb-4 line-clamp-4">"{quote}"</p>
    <p className="text-pink-700 font-semibold">— {name}</p>
  </div>
);

// --- COMPONENTE PRINCIPAL (ASÍNCRONO - Server Component) ---
export default async function LandingPage() {
  const servicios = await getServicios();

  return (
    <main>
      <Header />
      
      {/* 1. SECCIÓN HERO (Inicio) */}
      <section id="hero" className="pt-20 h-[85vh] flex items-center justify-center bg-gray-900 relative">
        <div className="absolute inset-0 opacity-40 bg-gray-600">
           {/* Aquí iría la imagen de fondo */}
        </div>
        
        {/* Contenido centrado */}
        <div className="relative z-10 max-w-4xl mx-auto text-center p-8">
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6">
            Tu Piel, Nuestra Obra de Arte
          </h1>
          <p className="text-xl text-gray-200 mb-10">
            Tratamientos personalizados, ciencia avanzada, y amor por la belleza natural.
          </p>
          <Link href="/reservar" legacyBehavior>
            <a className="bg-pink-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-pink-600 transition duration-300 shadow-2xl uppercase tracking-widest">
              Reservar Mi Cita Ahora
            </a>
          </Link>
        </div>
      </section>

      <hr className="border-t border-pink-200" />

      {/* 2. SECCIÓN HISTORIA/ACERCA DE */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:flex items-center gap-16">
          
          {/* Columna de Imagen Placeholder */}
          <div className="md:w-1/2">
            <div className="rounded-xl shadow-2xl overflow-hidden aspect-square bg-pink-100 flex items-center justify-center text-gray-700 text-xl">
               [Placeholder: Foto Profesional]
            </div>
          </div>
          
          {/* Columna de Texto */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <h2 className="text-5xl font-serif text-pink-700 mb-6">
              Conoce a Antonella
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed border-l-4 border-pink-400 pl-4">
              "Mi misión es simple: que cada cliente salga sintiéndose renovado, confiado y amado por su propia piel. Utilizo solo técnicas validadas."
            </p>
            <p className="text-gray-500 italic leading-relaxed">
              Anto es una cosmetóloga certificada con más de 7 años de experiencia, especializada en tratamientos faciales anti-edad y dermocosmética.
            </p>
          </div>
        </div>
      </section>
      
      <hr className="border-t border-pink-200" />

{/* 3. SECCIÓN SERVICIOS DESTACADOS (CARRUSEL) */}
<section id="servicios" className="py-24 bg-gray-50">
    <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-serif text-pink-700 mb-4">
            Nuestro Catálogo de Tratamientos 🌟
        </h2>
        <p className="text-xl text-gray-500 mb-12">
            Desliza (scroll) para conocer el catálogo completo. ¡Hay un tratamiento perfecto para ti!
        </p>

        {/* CONTENEDOR DEL CARRUSEL CSS */}
        <div 
            className="flex space-x-6 overflow-x-scroll pb-6 pt-2 snap-x snap-mandatory 
                      scrollbar-thin scrollbar-thumb-pink-400/50 scrollbar-track-pink-100"
        >
            {servicios.length === 0 ? (
                <p className="text-gray-600 text-lg p-10 bg-white rounded-xl shadow-md min-w-full">
                    No hay servicios disponibles en este momento. ¡Volveremos pronto!
                </p>
            ) : (
                servicios.map((servicio) => (
                <div key={servicio.id} 
                    // CLASES ESTÉTICAS MEJORADAS
                    className="snap-center shrink-0 w-4/5 md:w-1/3 lg:w-1/4 
                              bg-white p-8 rounded-3xl shadow-xl border border-pink-100 
                              transition duration-300 transform hover:scale-[1.02] 
                              hover:shadow-pink-300/50 hover:shadow-2xl text-left"
                  >
                    <h3 className="text-2xl font-serif text-pink-700 mb-3 border-b border-gray-100 pb-3">
                        {servicio.nombre}
                    </h3>
                    <p className="text-gray-600 mb-4 h-16 overflow-hidden line-clamp-3 text-base">
                        {servicio.descripcion}
                    </p>
                    <div className="mt-6 border-t pt-4">
                        <span className="text-3xl font-extrabold text-pink-600 block">
                            ${parseFloat(servicio.precio).toFixed(2)}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">Duración: {servicio.duracion_minutos} min</p>
                    </div>
                </div>
              ))
            )}
        </div> 
        {/* FIN DEL CARRUSEL */}

        <Link href="/reservar" legacyBehavior>
            <a className="mt-12 inline-block bg-pink-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-pink-600 transition duration-300 shadow-lg">
                Reservar Cita Ahora
            </a>
        </Link>
    </div>
</section>

      <hr className="border-t border-pink-200" />

      {/* 4. SECCIÓN TESTIMONIOS (Prueba Social) */}
      <section id="testimonios" className="py-20 bg-pink-100/70">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-serif text-pink-700 mb-12">
            Historias Reales de Pieles Felices ❤️
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="Mi piel nunca se ha sentido tan suave y luminosa. ¡Resultados increíbles! La mejor cosmetóloga que he visitado." 
              name="— Ana S." 
            />
            <TestimonialCard 
              quote="La atención es 10/10. Realmente personalizan el tratamiento. Me dieron una solución que nadie más pudo." 
              name="— Sofía M." 
            />
            <TestimonialCard 
              quote="Los productos son fantásticos y el ambiente es muy relajante. Mi momento de paz semanal." 
              name="— Miguel A." 
            />
          </div>
        </div>
      </section>

      <hr className="border-t border-pink-200" />

      {/* 5. SECCIÓN FINAL (Llamada a la Acción) */}
      <section className="py-20 bg-pink-700 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">¡Da el Primer Paso!</h2>
        <p className="text-xl mb-8">
          Tu piel te lo agradecerá. Agenda tu diagnóstico y tratamiento hoy mismo.
        </p>
        <Link href="/reservar" legacyBehavior>
          <a className="bg-white text-pink-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition duration-300 shadow-2xl uppercase">
            Reservar Ahora
          </a>
        </Link>
      </section>
      
    </main>
  );
}