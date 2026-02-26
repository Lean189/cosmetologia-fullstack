import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface DateTimeStepProps {
    fecha: string;
    horaInicio: string;
    slots: string[];
    loadingSlots: boolean;
    onBack: () => void;
    onDateChange: (fecha: string) => void;
    onSlotSelect: (slot: string) => void;
    onNext: () => void;
}

export default function DateTimeStep({
    fecha,
    horaInicio,
    slots,
    loadingSlots,
    onBack,
    onDateChange,
    onSlotSelect,
    onNext
}: DateTimeStepProps) {
    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-serif text-gray-800">¿Cuándo vienes?</h1>
                    <p className="text-gray-500">Selecciona el día y la hora.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendario Simple */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={fecha}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none"
                    />
                </div>

                {/* Slots Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Horarios disponibles</label>
                    {!fecha ? (
                        <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl text-center text-gray-400">
                            Primero selecciona una fecha
                        </div>
                    ) : loadingSlots ? (
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-10 bg-gray-50 animate-pulse rounded-lg" />)}
                        </div>
                    ) : slots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {slots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => onSlotSelect(slot)}
                                    className={`p-3 rounded-xl border-2 transition-all ${horaInicio === slot
                                        ? 'bg-pink-500 border-pink-500 text-white shadow-lg'
                                        : 'border-gray-100 hover:border-pink-200 text-gray-600'
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 border-2 border-gray-50 rounded-2xl text-center text-gray-400">
                            No hay horarios disponibles para este día.
                        </div>
                    )}
                </div>
            </div>

            <button
                disabled={!horaInicio}
                onClick={onNext}
                className="w-full mt-12 py-4 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 disabled:bg-gray-200 transition-all shadow-xl"
            >
                Continuar
            </button>
        </div>
    );
}
