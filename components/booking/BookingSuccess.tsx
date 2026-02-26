import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccess() {
    return (
        <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
            </div>
            <h1 className="text-4xl font-serif text-gray-800 mb-4">¡Cita reservada con éxito!</h1>
            <p className="text-gray-500 mb-8">Te enviaremos un recordatorio 24hs antes de tu cita.</p>
            <Link
                href="/"
                className="inline-block py-4 px-12 bg-gray-800 text-white font-bold rounded-2xl hover:bg-gray-900 transition-all shadow-xl"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
