import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('configuracion_horario')
            .select('*')
            .eq('activo', true)
            .order('dia_semana', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error (Config):', error);
        return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 });
    }
}
