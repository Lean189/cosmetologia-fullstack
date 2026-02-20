'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-pink-100">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-lg leading-tight">Panel de Admin</h1>
                            <p className="text-xs text-gray-400">Skinstudio by Anto</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" target="_blank" className="text-sm text-pink-600 hover:underline flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Ver sitio
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-xl transition font-medium"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Bienvenida, Anto 👋</h2>
                    <p className="text-gray-500 mt-1">¿Qué querés gestionar hoy?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card Servicios */}
                    <Link href="/admin/servicios" className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-pink-100 hover:border-pink-300">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Servicios & Precios</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Agregá, editá o desactivá tratamientos. Actualizá precios y duraciones al instante.
                        </p>
                        <div className="mt-6 flex items-center text-pink-500 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                            Gestionar servicios
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Card Testimonios */}
                    <Link href="/admin/testimonios" className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-pink-100 hover:border-pink-300">
                        <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Reseñas & Testimonios</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Administrá las reseñas visibles en el sitio. Agregá nuevas o editá las existentes.
                        </p>
                        <div className="mt-6 flex items-center text-rose-500 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                            Gestionar reseñas
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Info tip */}
                <div className="mt-8 bg-white rounded-2xl border border-blue-100 p-5 flex gap-4 items-start shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600">
                        Los cambios que hagas en servicios y reseñas se <strong>reflejan automáticamente</strong> en el sitio público al instante.
                    </p>
                </div>
            </main>
        </div>
    );
}
