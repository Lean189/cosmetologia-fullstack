'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
    title: string;
    showBackButton?: boolean;
    backHref?: string;
    showViewSite?: boolean;
}

export default function AdminHeader({
    title,
    showBackButton = false,
    backHref = '/admin',
    showViewSite = false
}: AdminHeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBackButton && (
                        <Link href={backHref} className="text-gray-400 hover:text-pink-600 transition p-1 rounded-lg hover:bg-pink-50">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    )}
                    {!showBackButton && (
                        <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    )}
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg leading-tight">{title}</h1>
                        {!showBackButton && <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Skinstudio Admin</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {showViewSite && (
                        <Link href="/" target="_blank" className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="hidden sm:inline">Ver sitio</span>
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-500 text-sm font-medium transition flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden sm:inline">Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
