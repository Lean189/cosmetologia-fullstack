// frontend/app/reservar/page.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// --- COMPONENTS ---
import ServiceStep from '@/components/booking/ServiceStep';
import DateTimeStep from '@/components/booking/DateTimeStep';
import ClientDataStep from '@/components/booking/ClientDataStep';
import BookingSuccess from '@/components/booking/BookingSuccess';

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const currentService = servicios.find(s => s.id === formData.servicio_id);

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
          {step === 1 && (
            <ServiceStep
              servicios={servicios}
              onSelect={handleServiceSelect}
            />
          )}

          {step === 2 && (
            <DateTimeStep
              fecha={formData.fecha}
              horaInicio={formData.hora_inicio}
              slots={slots}
              loadingSlots={loadingSlots}
              onBack={() => setStep(1)}
              onDateChange={(val) => setFormData(prev => ({ ...prev, fecha: val, hora_inicio: '' }))}
              onSlotSelect={(val) => setFormData(prev => ({ ...prev, hora_inicio: val }))}
              onNext={handleNextStep}
            />
          )}

          {step === 3 && (
            <ClientDataStep
              nombre={formData.cliente_nombre}
              email={formData.cliente_email}
              telefono={formData.cliente_telefono}
              loading={loading}
              onBack={() => setStep(2)}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              summary={
                <div className="mt-8 bg-pink-50 p-6 rounded-2xl border border-pink-100">
                  <h4 className="font-bold text-pink-700 mb-2">Resumen de tu reserva</h4>
                  <p className="text-pink-600">
                    {currentService?.nombre} el día {formData.fecha} a las {formData.hora_inicio}hs.
                  </p>
                </div>
              }
            />
          )}

          {step === 4 && <BookingSuccess />}
        </div>
      </div>
    </div>
  );
}
