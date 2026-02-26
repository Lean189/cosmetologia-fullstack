import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ClientDataStepProps {
    nombre: string;
    email: string;
    telefono: string;
    loading: boolean;
    onBack: () => void;
    onChange: (field: string, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    summary: React.ReactNode;
}

export default function ClientDataStep({
    nombre,
    email,
    telefono,
    loading,
    onBack,
    onChange,
    onSubmit,
    summary
}: ClientDataStepProps) {
    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-serif text-gray-800">Tus datos</h1>
                    <p className="text-gray-500">Casi terminamos, solo necesitamos contactarte.</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <p className="text-xs text-gray-400">Los campos marcados con <span className="text-pink-500 font-bold">*</span> son obligatorios.</p>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo <span className="text-pink-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Ej: María García"
                        required
                        value={nombre}
                        onChange={e => onChange('cliente_nombre', e.target.value)}
                        className={`w-full p-4 border-2 rounded-2xl focus:border-pink-500 outline-none transition-colors ${nombre.trim() === '' ? 'border-gray-100' : 'border-green-200'
                            }`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-pink-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Ej: maria@email.com"
                        required
                        value={email}
                        onChange={e => onChange('cliente_email', e.target.value)}
                        className={`w-full p-4 border-2 rounded-2xl focus:border-pink-500 outline-none transition-colors ${email.trim() === '' ? 'border-gray-100' : 'border-green-200'
                            }`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono WhatsApp <span className="text-pink-500">*</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="Ej: 11 1234-5678"
                        required
                        value={telefono}
                        onChange={e => onChange('cliente_telefono', e.target.value)}
                        className={`w-full p-4 border-2 rounded-2xl focus:border-pink-500 outline-none transition-colors ${telefono.trim() === '' ? 'border-gray-100' : 'border-green-200'
                            }`}
                    />
                    <p className="text-xs text-gray-400 mt-1">Te enviaremos la confirmación del turno por WhatsApp.</p>
                </div>

                {summary}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-pink-600 text-white font-bold rounded-2xl hover:bg-pink-700 disabled:bg-pink-300 transition-all shadow-xl mt-8"
                >
                    {loading ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
            </form>
        </div>
    );
}
