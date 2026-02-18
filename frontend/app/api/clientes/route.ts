import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre, apellido, email, telefono } = body;

        // Buscar si ya existe el cliente por email
        const clienteExistente = await prisma.cliente.findUnique({
            where: { email },
        });

        if (clienteExistente) {
            return NextResponse.json(clienteExistente);
        }

        // Si no existe, crearlo
        const nuevoCliente = await prisma.cliente.create({
            data: {
                nombre,
                apellido: apellido || 'ClienteWeb',
                email,
                telefono,
            },
        });

        return NextResponse.json(nuevoCliente, { status: 201 });
    } catch (error) {
        console.error('API Error (Clientes):', error);
        return NextResponse.json({ error: 'Error al procesar cliente' }, { status: 500 });
    }
}
