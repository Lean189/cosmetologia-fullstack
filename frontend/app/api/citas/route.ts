import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cliente, servicio, fecha, hora_inicio, notas } = body;

        // 1. Validar que no exista ya una cita en ese horario
        const citaExistente = await prisma.cita.findUnique({
            where: {
                fecha_hora_inicio: {
                    fecha: new Date(fecha),
                    hora_inicio,
                },
            },
        });

        if (citaExistente && citaExistente.estado !== 'A') {
            return NextResponse.json({ error: 'El horario ya no está disponible' }, { status: 400 });
        }

        // 2. Crear la cita
        const nuevaCita = await prisma.cita.create({
            data: {
                clienteId: cliente,
                servicioId: servicio,
                fecha: new Date(fecha),
                hora_inicio,
                notas,
            },
            include: {
                cliente: true,
                servicio: true,
            },
        });

        // 3. Enviar correos de confirmación (si hay API key)
        if (process.env.RESEND_API_KEY) {
            try {
                // Al dueño/admin
                await resend.emails.send({
                    from: 'Cosmetología <onboarding@resend.dev>',
                    to: process.env.ADMIN_EMAIL || 'admin@example.com',
                    subject: 'Nueva Reserva Confirmada',
                    html: `<p>Nueva cita reservada!</p>
                 <p><b>Cliente:</b> ${nuevaCita.cliente.nombre} ${nuevaCita.cliente.apellido}</p>
                 <p><b>Servicio:</b> ${nuevaCita.servicio.nombre}</p>
                 <p><b>Fecha:</b> ${fecha} a las ${hora_inicio}</p>`,
                });

                // Al cliente
                await resend.emails.send({
                    from: 'Cosmetología <onboarding@resend.dev>',
                    to: nuevaCita.cliente.email,
                    subject: 'Confirmación de tu Cita',
                    html: `<p>Hola ${nuevaCita.cliente.nombre},</p>
                 <p>Tu cita para <b>${nuevaCita.servicio.nombre}</b> ha sido confirmada.</p>
                 <p>Fecha: ${fecha}<br>Hora: ${hora_inicio}</p>
                 <p>¡Te esperamos!</p>`,
                });
            } catch (emailError) {
                console.error('Error enviando emails:', emailError);
                // No fallamos la reserva si el email falla
            }
        }

        return NextResponse.json(nuevaCita, { status: 201 });
    } catch (error) {
        console.error('API Error (Citas):', error);
        return NextResponse.json({ error: 'Error al crear la cita' }, { status: 500 });
    }
}
