import { format, addMinutes, parse, isBefore, isEqual, startOfDay } from 'date-fns';
import prisma from '@/lib/prisma';

export async function getAvailableSlots(servicioId: string, fechaStr: string) {
    const fecha = parse(fechaStr, 'yyyy-MM-dd', new Date());
    const today = startOfDay(new Date());

    if (isBefore(fecha, today)) {
        return [];
    }

    // 1. Verificar bloqueos
    const bloqueo = await prisma.bloqueoHorario.findUnique({
        where: { fecha },
    });
    if (bloqueo) return [];

    // 2. Obtener configuración de horario
    const diaSemana = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1; // JS (0=Sun) to UI/Django (0=Mon, 6=Sun)
    const config = await prisma.configuracionHorario.findUnique({
        where: { dia_semana: diaSemana },
    });

    if (!config || !config.activo) return [];

    const servicio = await prisma.servicio.findUnique({
        where: { id: servicioId },
    });
    if (!servicio) throw new Error('Servicio no encontrado');

    // 3. Obtener citas existentes
    const citas = await prisma.cita.findMany({
        where: {
            fecha: fecha,
            estado: { not: 'A' },
        },
        include: { servicio: true },
    });

    const slots: string[] = [];
    const duracion = servicio.duracion_minutos;

    let current = parse(config.hora_apertura, 'HH:mm', fecha);
    const end = parse(config.hora_cierre, 'HH:mm', fecha);

    // Si es hoy, empezar desde el siguiente slot de 30 min
    if (isEqual(fecha, today)) {
        const now = new Date();
        while (isBefore(current, now)) {
            current = addMinutes(current, 30);
        }
    }

    while (isBefore(addMinutes(current, duracion), end) || isEqual(addMinutes(current, duracion), end)) {
        const slotInicio = current;
        const slotFin = addMinutes(current, duracion);

        const isConflicting = citas.some((cita) => {
            const citaInicio = parse(cita.hora_inicio, 'HH:mm', fecha);
            const citaFin = addMinutes(citaInicio, cita.servicio.duracion_minutos);
            return isBefore(slotInicio, citaFin) && isBefore(citaInicio, slotFin);
        });

        if (!isConflicting) {
            slots.push(format(current, 'HH:mm'));
        }

        current = addMinutes(current, 30);
    }

    return slots;
}
