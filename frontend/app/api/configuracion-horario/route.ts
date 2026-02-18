import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.configuracionHorario.findMany({
            where: { activo: true },
            orderBy: { dia_semana: 'asc' },
        });
        return NextResponse.json(config);
    } catch (error) {
        console.error('API Error (Config):', error);
        return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 });
    }
}
