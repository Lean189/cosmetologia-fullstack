import { cookies } from 'next/headers';

/**
 * Verifica si el usuario actual está autenticado como administrador.
 * Se basa en la presencia y valor de la cookie 'admin_session'.
 */
export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    
    return session?.value === 'authenticated';
}
