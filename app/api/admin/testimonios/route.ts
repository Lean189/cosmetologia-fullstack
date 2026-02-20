import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: traer todos los testimonios
export async function GET() {
    const { data, error } = await supabase
        .from('testimonios')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST: crear nuevo testimonio
export async function POST(request: Request) {
    const body = await request.json();
    const { nombre, quote } = body;

    if (!nombre || !quote) {
        return NextResponse.json({ error: 'Nombre y reseña son requeridos' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('testimonios')
        .insert([{ nombre, quote, activo: true }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

// PUT: editar testimonio
export async function PUT(request: Request) {
    const body = await request.json();
    const { id, nombre, quote, activo } = body;

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { data, error } = await supabase
        .from('testimonios')
        .update({ nombre, quote, activo })
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// DELETE: eliminar testimonio
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { error } = await supabase.from('testimonios').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
