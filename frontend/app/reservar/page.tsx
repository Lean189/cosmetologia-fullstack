// frontend/app/reservar/page.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

// --- INTERFACES DE DATOS ---
interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  duracion_minutos: number;
}

interface ConfiguracionHorario {
  dia_semana: number;
  dia_nombre: string;
  activo: boolean;
  hora_apertura: string;
  hora_cierre: string;
}

interface FormData {
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  servicio_id: number | null;
  fecha: string;
  hora_inicio: string;
}

// --- CONSTANTES ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';

export default function ReservarPage() {
  const initialState: FormData = {
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    servicio_id: null,
    fecha: '',
    hora_inicio: '',
  };

  const [formData, setFormData] = useState<FormData>(initialState);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [diasLaborales, setDiasLaborales] = useState<number[]>([]); // Días activos (0=Lunes, 6=Domingo)
  const [loading, setLoading] = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [message, setMessage] = useState('');


  // --- EFECTO: Carga de Servicios y Configuración de Horarios ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviciosRes, configRes] = await Promise.all([
          axios.get<Servicio[]>(`${API_URL}servicios/`),
          axios.get<ConfiguracionHorario[]>(`${API_URL}configuracion-horario/`)
        ]);

        setServicios(serviciosRes.data);

        // Filtrar solo los días activos y guardar sus índices
        const diasActivos = configRes.data
          .filter(d => d.activo)
          .map(d => d.dia_semana);
        setDiasLaborales(diasActivos);

      } catch (err) {
        console.error("Error al obtener datos:", err);
        setMessage("Error: No se pudieron cargar los datos del servidor.");
      } finally {
        setLoadingServicios(false);
      }
    };
    fetchData();
  }, []);

  // --- VALIDACIÓN DE FECHA ---
  const esDiaLaboral = (fechaStr: string): boolean => {
    if (!fechaStr) return false;
    // Crear fecha ajustando la zona horaria para evitar desfases
    const fecha = new Date(fechaStr + 'T00:00:00');
    const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes...

    // Ajustar índice de JS (0=Domingo) a Django (0=Lunes, 6=Domingo)
    const diaDjango = diaSemana === 0 ? 6 : diaSemana - 1;

    return diasLaborales.includes(diaDjango);
  };

  // --- MANEJO DE CAMBIOS DEL FORMULARIO ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let parsedValue: string | number | null = value;

    if (name === 'servicio_id') {
      parsedValue = value ? parseInt(value) : null;
    }

    // Validación específica para fecha
    if (name === 'fecha') {
      if (!esDiaLaboral(value)) {
        setMessage('⚠️ El día seleccionado no es un día laboral. Por favor elige otro.');
        // Aquí optamos por permitir cambiar pero avisar
      } else {
        setMessage(''); // Limpiar mensaje si selecciona bien
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // --- MANEJO DEL ENVÍO (POST) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.servicio_id || !formData.cliente_nombre || !formData.cliente_email || !formData.fecha) {
      setMessage('Error: Por favor, completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    if (!esDiaLaboral(formData.fecha)) {
      setMessage('Error: La fecha seleccionada no corresponde a un día de atención.');
      setLoading(false);
      return;
    }

    try {
      // 1. Crear o buscar el cliente
      const clienteResponse = await axios.post(`${API_URL}clientes/`, {
        nombre: formData.cliente_nombre,
        apellido: "ClienteWeb",
        email: formData.cliente_email,
        telefono: formData.cliente_telefono,
      });
      const clienteId = clienteResponse.data.id;

      // 2. Crear la cita
      await axios.post(`${API_URL}citas/`, {
        cliente: clienteId,
        servicio: formData.servicio_id,
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
      });

      setMessage('¡Cita reservada con éxito! Te esperamos.');
      setFormData(initialState);

    } catch (err) {
      console.error('Error al procesar la reserva:', err);

      if (axios.isAxiosError(err) && err.response?.status === 400) {
        // Mostrar mensaje específico del backend si existe
        const msgBackend = err.response.data?.non_field_errors?.[0] || 'Conflicto de horario o datos inválidos.';
        setMessage(`Error: ${msgBackend}`);
      } else {
        setMessage('Error al reservar. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="max-w-xl mx-auto p-8 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">Reservar Cita</h1>

      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl">

        {/* Campo Servicio */}
        <label className="block mb-4">
          <span className="text-gray-700">Servicio Deseado</span>
          <select
            name="servicio_id"
            value={formData.servicio_id || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            {loadingServicios ? (
              <option value="" disabled>Cargando servicios...</option>
            ) : servicios.length === 0 ? (
              <option value="" disabled>No hay servicios disponibles.</option>
            ) : (
              <>
                <option value="" disabled>Selecciona un servicio</option>
                {servicios.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </>
            )}
          </select>
        </label>

        {/* Campo Nombre */}
        <label className="block mb-4">
          <span className="text-gray-700">Tu Nombre</span>
          <input
            type="text"
            name="cliente_nombre"
            value={formData.cliente_nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>

        {/* Campo Email */}
        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="cliente_email"
            value={formData.cliente_email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>

        {/* Campo Teléfono */}
        <label className="block mb-4">
          <span className="text-gray-700">Teléfono</span>
          <input
            type="tel"
            name="cliente_telefono"
            value={formData.cliente_telefono}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>

        {/* Campo Fecha y Hora */}
        <div className="flex gap-4 mb-4">
          <label className="block w-1/2">
            <span className="text-gray-700">Fecha</span>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Días disponibles según agenda.</p>
          </label>
          <label className="block w-1/2">
            <span className="text-gray-700">Hora de Inicio</span>
            <input
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || loadingServicios || servicios.length === 0}
          className="w-full py-3 mt-4 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 transition duration-150 disabled:bg-pink-300"
        >
          {loading ? 'Reservando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
}