import { format, addMinutes, parse, isBefore, isEqual, startOfDay } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface Cita {
    hora_inicio: string;
    servicios: {
        duracion_minutos: number;
    };
}

interface Servicio {
    duracion_minutos: number;
}

export async function getAvailableSlots(servicioId: string, fechaStr: string) {
    const fecha = parse(fechaStr, 'yyyy-MM-dd', new Date());
    const today = startOfDay(new Date());

    if (isBefore(fecha, today)) {
        return [];
    }

    // 1. Verificar bloqueos
    const { data: bloqueo } = await supabase
        .from('bloqueos_horario')
        .select('id')
        .eq('fecha', fechaStr)
        .single();

    if (bloqueo) return [];

    // 2. Obtener configuración de horario
    const diaSemana = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1;
    const { data: config } = await supabase
        .from('configuracion_horario')
        .select('*')
        .eq('dia_semana', diaSemana)
        .eq('activo', true)
        .single();

    if (!config) return [];

    const { data: servicio } = await supabase
        .from('servicios')
        .select('duracion_minutos')
        .eq('id', servicioId)
        .single();

    if (!servicio) throw new Error('Servicio no encontrado');

    const servicioTyped = servicio as unknown as Servicio;

    // 3. Obtener citas existentes
    const { data: citas } = await supabase
        .from('citas')
        .select('hora_inicio, servicios(duracion_minutos)')
        .eq('fecha', fechaStr)
        .neq('estado', 'A');

    const slots: string[] = [];
    const duracion = servicioTyped.duracion_minutos;

    let current = parse(config.hora_apertura, 'HH:mm', fecha);
    const end = parse(config.hora_cierre, 'HH:mm', fecha);

    if (isEqual(fecha, today)) {
        const now = new Date();
        while (isBefore(current, now)) {
            current = addMinutes(current, 30);
        }
    }

    while (isBefore(addMinutes(current, duracion), end) || isEqual(addMinutes(current, duracion), end)) {
        const slotInicio = current;
        const slotFin = addMinutes(current, duracion);

        const isConflicting = (citas as unknown as Cita[] || []).some((cita) => {
            const citaInicio = parse(cita.hora_inicio, 'HH:mm', fecha);
            const citaFin = addMinutes(citaInicio, cita.servicios.duracion_minutos);
            return isBefore(slotInicio, citaFin) && isBefore(citaInicio, slotFin);
        });

        if (!isConflicting) {
            slots.push(format(current, 'HH:mm'));
        }

        current = addMinutes(current, 60);
    }

    return slots;
}
