import { NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/availability';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    const { id } = await params;

    if (!fecha) {
        return NextResponse.json({ error: 'Parámetro fecha requerido' }, { status: 400 });
    }

    try {
        const slots = await getAvailableSlots(id, fecha);
        return NextResponse.json({ horarios: slots });
    } catch (error) {
        console.error('API Error (Disponibilidad):', error);
        return NextResponse.json({ error: 'Error al calcular disponibilidad' }, { status: 500 });
    }
}
