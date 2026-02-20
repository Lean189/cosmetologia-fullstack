import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json({ error: 'ADMIN_PASSWORD no configurado' }, { status: 500 });
        }

        if (password !== adminPassword) {
            return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 8, // 8 horas
            path: '/',
        });

        return response;
    } catch {
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
