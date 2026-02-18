import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const clienteSchema = z.object({
    nombre: z.string().min(2, "El nombre es muy corto"),
    apellido: z.string().optional(),
    email: z.string().email("Email inválido"),
    telefono: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validar con Zod
        const validation = clienteSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Datos inválidos',
                details: validation.error.format()
            }, { status: 400 });
        }

        const { nombre, apellido, email, telefono } = validation.data;

        // Buscar si ya existe
        const { data: existing } = await supabase
            .from('clientes')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json(existing);
        }

        const { data: nuevo, error } = await supabase
            .from('clientes')
            .insert([
                { nombre, apellido: apellido || 'ClienteWeb', email, telefono }
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(nuevo, { status: 201 });
    } catch (error) {
        console.error('API Error (Clientes):', error);
        return NextResponse.json({ error: 'Error al procesar cliente' }, { status: 500 });
    }
}
