// frontend/app/reservar/page.tsx

"use client"; // CRÍTICO: Componente de cliente para usar estado y efectos

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

interface FormData {
  cliente_nombre: string;
  cliente_email: string;
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
    servicio_id: null,
    fecha: '',
    hora_inicio: '',
  };
  
  const [formData, setFormData] = useState<FormData>(initialState);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [message, setMessage] = useState('');


  // --- EFECTO: Carga REAL de Servicios desde Django (GET) ---
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get<Servicio[]>(`${API_URL}servicios/`);
        setServicios(response.data);
      } catch (err) {
        console.error("Error al obtener servicios:", err);
        setMessage("Error: No se pudieron cargar los servicios. El servidor de Django podría estar apagado.");
      } finally {
        setLoadingServicios(false);
      }
    };
    fetchServicios();
  }, []); // Se ejecuta solo al montar el componente

  // --- MANEJO DE CAMBIOS DEL FORMULARIO ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number | null = value;

    if (name === 'servicio_id') {
      parsedValue = value ? parseInt(value) : null;
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

    // **CORRECCIÓN CRÍTICA:** Validación básica, incluyendo el campo email
    if (!formData.servicio_id || !formData.cliente_nombre || !formData.cliente_email || !formData.fecha) {
        setMessage('Error: Por favor, selecciona un servicio y completa todos los campos.');
        setLoading(false);
        return;
    }

    try {
      // 1. Crear o buscar el cliente (Envía "ClienteWeb" como Apellido)
      const clienteResponse = await axios.post(`${API_URL}clientes/`, {
        nombre: formData.cliente_nombre,
        apellido: "ClienteWeb", // Valor por defecto
        email: formData.cliente_email,
      });
      const clienteId = clienteResponse.data.id;

      // 2. Crear la cita
      await axios.post(`${API_URL}citas/`, {
        cliente: clienteId, 
        servicio: formData.servicio_id, 
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
      });

      setMessage('¡Cita reservada con éxito! Revisa el administrador de Django.');
      setFormData(initialState); 
      
    } catch (err) {
      console.error('Error al procesar la reserva:', err);
      
      // Diagnóstico de error 400 (Validación/Unique/Conflicto)
      if (axios.isAxiosError(err) && err.response?.status === 400) {
           setMessage('Error 400: Conflicto de horario o email. Intenta cambiar el email o la hora.');
      } else {
           setMessage('Error al reservar. Por favor, revisa que el servidor esté activo.');
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
            {/* Lógica de Renderizado Condicional */}
            {loadingServicios ? (
                <option value="" disabled>Cargando servicios...</option>
            ) : servicios.length === 0 ? (
                <option value="" disabled>No hay servicios disponibles. (Revisa /admin/)</option>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
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