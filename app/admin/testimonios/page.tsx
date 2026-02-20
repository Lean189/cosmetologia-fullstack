'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Testimonio {
    id: number;
    nombre: string;
    quote: string;
    activo: boolean;
}

const emptyTestimonio = { nombre: '', quote: '', activo: true };

export default function AdminTestimoniosPage() {
    const router = useRouter();
    const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyTestimonio);
    const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

    const fetchTestimonios = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/testimonios');
            const data = await res.json();
            setTestimonios(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTestimonios(); }, [fetchTestimonios]);

    const showMsg = (type: 'ok' | 'error', text: string) => {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 3500);
    };

    const handleEdit = (t: Testimonio) => {
        setEditingId(t.id);
        setForm({ nombre: t.nombre, quote: t.quote, activo: t.activo });
        setShowForm(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/testimonios', {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
            });
            if (res.ok) {
                showMsg('ok', editingId ? 'Testimonio actualizado ✓' : 'Testimonio creado ✓');
                setEditingId(null);
                setShowForm(false);
                setForm(emptyTestimonio);
                fetchTestimonios();
            } else {
                const d = await res.json();
                showMsg('error', d.error || 'Error al guardar');
            }
        } catch { showMsg('error', 'Error de conexión'); }
        setSaving(false);
    };

    const handleToggle = async (t: Testimonio) => {
        await fetch('/api/admin/testimonios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...t, activo: !t.activo }),
        });
        fetchTestimonios();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este testimonio?')) return;
        const res = await fetch(`/api/admin/testimonios?id=${id}`, { method: 'DELETE' });
        if (res.ok) { showMsg('ok', 'Testimonio eliminado'); fetchTestimonios(); }
        else showMsg('error', 'Error al eliminar');
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const cancelEditing = () => { setEditingId(null); setShowForm(false); setForm(emptyTestimonio); };

    const isEditing = editingId !== null || showForm;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-rose-100 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="font-bold text-gray-800 text-lg">Reseñas & Testimonios</h1>
                    </div>
                    <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 transition">
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Toast */}
                {msg && (
                    <div className={`mb-6 px-5 py-3 rounded-2xl text-sm font-medium shadow-md ${msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {msg.text}
                    </div>
                )}

                {/* Form: Nuevo / Editar */}
                {isEditing && (
                    <div className="bg-white rounded-3xl shadow-lg border border-rose-100 p-6 md:p-8 mb-8">
                        <h2 className="font-bold text-gray-800 text-lg mb-6">
                            {editingId ? '✏️ Editar reseña' : '➕ Nueva reseña'}
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre del cliente *</label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                                    placeholder="Ej: Ana García"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Reseña / Comentario *</label>
                                <textarea
                                    value={form.quote}
                                    onChange={e => setForm({ ...form, quote: e.target.value })}
                                    placeholder="Escribí lo que dijo el cliente..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800 resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    checked={form.activo}
                                    onChange={e => setForm({ ...form, activo: e.target.checked })}
                                    className="w-5 h-5 accent-rose-500 rounded"
                                />
                                <label htmlFor="activo" className="text-sm font-medium text-gray-700">Visible en el sitio</label>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.nombre || !form.quote}
                                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-rose-700 transition disabled:opacity-50"
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button onClick={cancelEditing} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* Botón Nuevo */}
                {!isEditing && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-500 text-sm">{testimonios.length} reseña{testimonios.length !== 1 ? 's' : ''}</p>
                        <button
                            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyTestimonio); }}
                            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-rose-600 hover:to-rose-700 transition shadow-md flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva reseña
                        </button>
                    </div>
                )}

                {/* Lista */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando reseñas...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonios.map(t => (
                            <div key={t.id} className={`bg-white rounded-3xl shadow-sm border p-6 flex flex-col justify-between transition ${t.activo ? 'border-rose-100' : 'border-gray-200 opacity-60'}`}>
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-rose-600 font-bold">{t.nombre}</span>
                                        <div className="flex items-center gap-2">
                                            {!t.activo && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold">Oculto</span>}
                                            <button
                                                onClick={() => handleToggle(t)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${t.activo ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                title={t.activo ? 'Ocultar' : 'Mostrar'}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm italic line-clamp-4 mb-6">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 border-t pt-4 mt-auto">
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
                                        title="Eliminar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {testimonios.length === 0 && !loading && (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <p className="text-lg mb-3">No hay reseñas todavía</p>
                                <button onClick={() => setShowForm(true)} className="text-rose-500 underline text-sm font-semibold">
                                    Agregar el primer testimonio
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
