import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// GET: traer todos los servicios (activos e inactivos)
export async function GET() {
    const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .order('nombre', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST: crear nuevo servicio
export async function POST(request: Request) {
    const body = await request.json();
    const { nombre, descripcion, precio, duracion_minutos } = body;

    if (!nombre || !precio || !duracion_minutos) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('servicios')
        .insert([{ nombre, descripcion: descripcion || '', precio, duracion_minutos, activo: true }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Revalidar la página principal
    revalidatePath('/');

    return NextResponse.json(data, { status: 201 });
}

// PUT: editar servicio existente
export async function PUT(request: Request) {
    const body = await request.json();
    const { id, nombre, descripcion, precio, duracion_minutos, activo } = body;

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { data, error } = await supabase
        .from('servicios')
        .update({ nombre, descripcion, precio, duracion_minutos, activo })
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Revalidar la página principal
    revalidatePath('/');

    return NextResponse.json(data);
}

// DELETE: eliminar servicio
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { error } = await supabase.from('servicios').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Revalidar la página principal
    revalidatePath('/');

    return NextResponse.json({ success: true });
}
