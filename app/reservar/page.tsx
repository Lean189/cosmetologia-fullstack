// frontend/app/reservar/page.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// --- INTERFACES ---
interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion_minutos: number;
}

interface AppointmentFormData {
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  servicio_id: string | null;
  fecha: string;
  hora_inicio: string;
}

const API_URL = '/api/';

export default function ReservarPage() {
  const [step, setStep] = useState(1);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState<AppointmentFormData>({
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    servicio_id: null,
    fecha: '',
    hora_inicio: '',
  });

  // 1. Cargar servicios al inicio
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await axios.get<Servicio[]>(`${API_URL}servicios`);
        setServicios(res.data);
      } catch (err) {
        console.error("Error loading services:", err);
        toast.error('No se pudieron cargar los servicios.');
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchServicios();
  }, []);

  // 2. Cargar slots cuando cambian fecha o servicio
  useEffect(() => {
    if (formData.fecha && formData.servicio_id) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const res = await axios.get(`${API_URL}servicios/${formData.servicio_id}/disponibilidad?fecha=${formData.fecha}`);
          setSlots(res.data.horarios || []);
          if (res.data.horarios?.length === 0) {
            toast('No hay turnos disponibles para este día.', { icon: 'ℹ️' });
          }
        } catch (err) {
          console.error("Error loading slots:", err);
          toast.error('Error al cargar horarios disponibles.');
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [formData.fecha, formData.servicio_id]);

  const handleServiceSelect = (id: string) => {
    setFormData(prev => ({ ...prev, servicio_id: id, hora_inicio: '' }));
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 2 && (!formData.fecha || !formData.hora_inicio)) return;
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (!formData.cliente_nombre.trim()) {
      toast.error('El nombre completo es obligatorio.');
      return;
    }
    if (!formData.cliente_email.trim()) {
      toast.error('El email es obligatorio.');
      return;
    }
    if (!formData.cliente_telefono.trim()) {
      toast.error('El teléfono de WhatsApp es obligatorio.');
      return;
    }

    setLoading(true);

    try {
      // Create/Get Client
      const clienteRes = await axios.post(`${API_URL}clientes`, {
        nombre: formData.cliente_nombre,
        email: formData.cliente_email,
        telefono: formData.cliente_telefono,
      });

      // Create Appointment (se pasa nombre y telefono para la notif de WhatsApp)
      await axios.post(`${API_URL}citas`, {
        cliente: clienteRes.data.id,
        servicio: formData.servicio_id,
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
        cliente_nombre: formData.cliente_nombre,
        cliente_telefono: formData.cliente_telefono,
      });

      toast.success('¡Cita reservada con éxito!');
      setStep(4);
    } catch (err: unknown) {
      console.error(err);
      let errorMsg = 'Error al procesar la reserva.';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header con botón Volver */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center text-pink-600 hover:text-pink-700 font-medium">
            <ChevronLeft size={20} />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 w-12 rounded-full ${step >= i ? 'bg-pink-500' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* STEP 1: Seleccionar Servicio */}
          {step === 1 && (
            <div className="p-8">
              <h1 className="text-3xl font-serif text-gray-800 mb-2">Elige un tratamiento</h1>
              <p className="text-gray-500 mb-8">Selecciona el servicio que deseas reservar.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicios.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleServiceSelect(s.id)}
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
          )}

          {/* STEP 2: Seleccionar Fecha y Hora */}
          {step === 2 && (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h1 className="text-3xl font-serif text-gray-800">Cuándo vienes?</h1>
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
                    value={formData.fecha}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value, hora_inicio: '' }))}
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none"
                  />
                </div>

                {/* Slots Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horarios disponibles</label>
                  {!formData.fecha ? (
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
                          onClick={() => setFormData(prev => ({ ...prev, hora_inicio: slot }))}
                          className={`p-3 rounded-xl border-2 transition-all ${formData.hora_inicio === slot
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
                disabled={!formData.hora_inicio}
                onClick={handleNextStep}
                className="w-full mt-12 py-4 bg-pink-500 text-white font-bold rounded-2xl hover:bg-pink-600 disabled:bg-gray-200 transition-all shadow-xl"
              >
                Continuar
              </button>
            </div>
          )}

          {/* STEP 3: Datos Personales */}
          {step === 3 && (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep(2)} className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h1 className="text-3xl font-serif text-gray-800">Tus datos</h1>
                  <p className="text-gray-500">Casi terminamos, solo necesitamos contactarte.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <p className="text-xs text-gray-400">Los campos marcados con <span className="text-pink-500 font-bold">*</span> son obligatorios.</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María García"
                    required
                    value={formData.cliente_nombre}
                    onChange={e => setFormData(prev => ({ ...prev, cliente_nombre: e.target.value }))}
                    className={`w-full p-4 border-2 rounded-2xl focus:border-pink-500 outline-none transition-colors ${formData.cliente_nombre.trim() === '' ? 'border-gray-100' : 'border-green-200'
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
                    value={formData.cliente_email}
                    onChange={e => setFormData(prev => ({ ...prev, cliente_email: e.target.value }))}
                    className={`w-full p-4 border-2 rounded-2xl focus:border-pink-500 outline-none transition-colors ${formData.cliente_email.trim() === '' ? 'border-gray-100' : 'border-green-200'
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
                    value={formData.cliente_telefono}
                    onChange={e => setFormData(prev => ({ ...prev, cliente_telefono: e.target.value }))}
                    className={`w-full p-4 border-2 rounded-2xl focus:border-pink-500 outline-none transition-colors ${formData.cliente_telefono.trim() === '' ? 'border-gray-100' : 'border-green-200'
                      }`}
                  />
                  <p className="text-xs text-gray-400 mt-1">Te enviaremos la confirmación del turno por WhatsApp.</p>
                </div>

                <div className="mt-8 bg-pink-50 p-6 rounded-2xl border border-pink-100">
                  <h4 className="font-bold text-pink-700 mb-2">Resumen de tu reserva</h4>
                  <p className="text-pink-600">
                    {servicios.find(s => s.id === formData.servicio_id)?.nombre} el día {formData.fecha} a las {formData.hora_inicio}hs.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-pink-600 text-white font-bold rounded-2xl hover:bg-pink-700 disabled:bg-pink-300 transition-all shadow-xl mt-8"
                >
                  {loading ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Éxito */}
          {step === 4 && (
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
          )}
        </div>
      </div>
    </div>
  );
}