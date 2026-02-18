import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('servicios')
            .select('*')
            .eq('activo', true)
            .order('nombre', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error (Servicios):', error);
        return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
    }
}
