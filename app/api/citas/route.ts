import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const dynamic = 'force-dynamic';

const citaSchema = z.object({
    cliente: z.string().uuid("ID de cliente inválido"),
    servicio: z.string().uuid("ID de servicio inválido"),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
    hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato de hora inválido (HH:MM)"),
    notas: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validar con Zod
        const validation = citaSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Datos de reserva inválidos',
                details: validation.error.format()
            }, { status: 400 });
        }

        const { cliente, servicio, fecha, hora_inicio, notas } = validation.data;

        // 1. Validar disponibilidad (doble check)
        const { data: existing } = await supabase
            .from('citas')
            .select('id')
            .eq('fecha', fecha)
            .eq('hora_inicio', hora_inicio)
            .neq('estado', 'A')
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: 'El horario ya no está disponible' }, { status: 400 });
        }

        // 2. Crear la cita
        const { data: nuevaCita, error } = await supabase
            .from('citas')
            .insert([
                {
                    cliente_id: cliente,
                    servicio_id: servicio,
                    fecha,
                    hora_inicio,
                    notas,
                    estado: 'P'
                }
            ])
            .select('*, clientes(*), servicios(*)')
            .single();

        if (error) throw error;

        // 3. Enviar correos (Resend)
        if (resend) {
            try {
                const clienteData = nuevaCita.clientes as unknown as { nombre: string, apellido: string, email: string };
                const servicioData = nuevaCita.servicios as unknown as { nombre: string };

                // Al admin
                await resend.emails.send({
                    from: 'Cosmetología <onboarding@resend.dev>',
                    to: process.env.ADMIN_EMAIL || 'admin@example.com',
                    subject: 'Nueva Reserva Confirmada',
                    html: `<p>Nueva cita reservada!</p>
                 <p><b>Cliente:</b> ${clienteData.nombre} ${clienteData.apellido}</p>
                 <p><b>Servicio:</b> ${servicioData.nombre}</p>
                 <p><b>Fecha:</b> ${fecha} a las ${hora_inicio}</p>`,
                });

                // Al cliente
                await resend.emails.send({
                    from: 'Cosmetología <onboarding@resend.dev>',
                    to: clienteData.email,
                    subject: 'Confirmación de tu Cita',
                    html: `<p>Hola ${clienteData.nombre},</p>
                 <p>Tu cita para <b>${servicioData.nombre}</b> ha sido confirmada.</p>
                 <p>Fecha: ${fecha}<br>Hora: ${hora_inicio}</p>
                 <p>¡Te esperamos!</p>`,
                });
            } catch (emailError) {
                console.error('Email error:', emailError);
            }
        }

        return NextResponse.json(nuevaCita, { status: 201 });
    } catch (error) {
        console.error('API Error (Citas):', error);
        return NextResponse.json({ error: 'Error al crear la cita' }, { status: 500 });
    }
}
