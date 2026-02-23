'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';

interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio: string;
    duracion_minutos: number;
    activo: boolean;
}

const emptyServicio = { nombre: '', descripcion: '', precio: '', duracion_minutos: 60, activo: true };

export default function AdminServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyServicio);
    const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

    const fetchServicios = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/admin/servicios');
        const data = await res.json();
        setServicios(Array.isArray(data) ? data : []);
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchServicios();
    }, [fetchServicios]);

    const showMsg = (type: 'ok' | 'error', text: string) => {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 3500);
    };

    const handleEdit = (s: Servicio) => {
        setEditingId(s.id);
        setForm({ nombre: s.nombre, descripcion: s.descripcion, precio: s.precio, duracion_minutos: s.duracion_minutos, activo: s.activo });
        setShowForm(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/servicios', {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
            });
            if (res.ok) {
                showMsg('ok', editingId ? 'Servicio actualizado ✓' : 'Servicio creado ✓');
                setEditingId(null);
                setShowForm(false);
                setForm(emptyServicio);
                fetchServicios();
            } else {
                const d = await res.json();
                showMsg('error', d.error || 'Error al guardar');
            }
        } catch { showMsg('error', 'Error de conexión'); }
        setSaving(false);
    };

    const handleToggle = async (s: Servicio) => {
        await fetch('/api/admin/servicios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...s, activo: !s.activo }),
        });
        fetchServicios();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.')) return;
        const res = await fetch(`/api/admin/servicios?id=${id}`, { method: 'DELETE' });
        if (res.ok) { showMsg('ok', 'Servicio eliminado'); fetchServicios(); }
        else showMsg('error', 'Error al eliminar');
    };


    const cancelEditing = () => { setEditingId(null); setShowForm(false); setForm(emptyServicio); };

    const isEditing = editingId !== null || showForm;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
            {/* Header */}
            <AdminHeader title="Servicios & Precios" showBackButton={true} />

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Toast */}
                {msg && (
                    <div className={`mb-6 px-5 py-3 rounded-2xl text-sm font-medium shadow-md ${msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {msg.text}
                    </div>
                )}

                {/* Form: Nuevo / Editar */}
                {isEditing && (
                    <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-6 md:p-8 mb-8">
                        <h2 className="font-bold text-gray-800 text-lg mb-6">
                            {editingId ? '✏️ Editar servicio' : '➕ Nuevo servicio'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre del servicio *</label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                                    placeholder="Ej: Limpieza facial profunda"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                    placeholder="Descripción breve del tratamiento..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Precio ($) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.precio}
                                    onChange={e => setForm({ ...form, precio: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Duración (minutos) *</label>
                                <input
                                    type="number"
                                    min="5"
                                    step="5"
                                    value={form.duracion_minutos}
                                    onChange={e => setForm({ ...form, duracion_minutos: parseInt(e.target.value) })}
                                    placeholder="60"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    checked={form.activo}
                                    onChange={e => setForm({ ...form, activo: e.target.checked })}
                                    className="w-5 h-5 accent-pink-500 rounded"
                                />
                                <label htmlFor="activo" className="text-sm font-medium text-gray-700">Visible en el sitio</label>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.nombre || !form.precio}
                                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition disabled:opacity-50"
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
                        <p className="text-gray-500 text-sm">{servicios.length} servicio{servicios.length !== 1 ? 's' : ''}</p>
                        <button
                            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyServicio); }}
                            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-pink-600 hover:to-pink-700 transition shadow-md flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo servicio
                        </button>
                    </div>
                )}

                {/* Lista */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Cargando servicios...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {servicios.map(s => (
                            <div key={s.id} className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition ${s.activo ? 'border-pink-100' : 'border-gray-200 opacity-60'}`}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-800 truncate">{s.nombre}</h3>
                                        {!s.activo && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Oculto</span>}
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{s.descripcion}</p>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-pink-600 font-bold text-lg">${parseFloat(s.precio).toFixed(2)}</span>
                                        <span className="text-gray-400 text-sm mt-1">{s.duracion_minutos} min</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleToggle(s)}
                                        title={s.activo ? 'Ocultar del sitio' : 'Mostrar en el sitio'}
                                        className={`px-3 py-2 rounded-xl text-xs font-medium transition ${s.activo ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {s.activo ? '✓ Visible' : '○ Oculto'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(s)}
                                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                        title="Editar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                                        title="Eliminar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {servicios.length === 0 && !loading && (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-lg mb-3">No hay servicios todavía</p>
                                <button onClick={() => setShowForm(true)} className="text-pink-500 underline text-sm">
                                    Crear el primer servicio
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
