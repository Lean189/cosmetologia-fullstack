import React from 'react';
import { Clock } from 'lucide-react';

interface Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    duracion_minutos: number;
}

interface ServiceStepProps {
    servicios: Servicio[];
    onSelect: (id: string) => void;
}

export default function ServiceStep({ servicios, onSelect }: ServiceStepProps) {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Elige un tratamiento</h1>
            <p className="text-gray-500 mb-8">Selecciona el servicio que deseas reservar.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicios.map(s => (
                    <button
                        key={s.id}
                        onClick={() => onSelect(s.id)}
                        className="text-left p-6 border-2 border-gray-100 rounded-2xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 group"
                    >
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-700">{s.nombre}</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4 line-clamp-2">{s.descripcion}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-pink-600 font-bold">${parseFloat(s.precio).toFixed(2)}</span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <Clock size={14} /> {s.duracion_minutos} min
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
