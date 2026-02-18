import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre, apellido, email, telefono } = body;

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
