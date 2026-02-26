const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/admin';

async function testSecurity() {
    console.log('--- Probando Seguridad de la API de Administración ---');

    // 1. Probar Crear Servicio sin Autenticación
    try {
        console.log('\n[1] Intentando crear servicio sin cookie...');
        const res = await axios.post(`${BASE_URL}/servicios`, {
            nombre: 'Servicio de Prueba',
            precio: 1000,
            duracion_minutos: 30
        });
        console.error('❌ ERROR: La petición debería haber fallado con 401.');
    } catch (err) {
        if (err.response?.status === 401) {
            console.log('✅ ÉXITO: Acceso denegado (401 Unauthorized)');
        } else {
            console.error('❌ ERROR inesperado:', err.message);
        }
    }

    // 2. Probar Crear Testimonio sin Autenticación
    try {
        console.log('\n[2] Intentando crear testimonio sin cookie...');
        const res = await axios.post(`${BASE_URL}/testimonios`, {
            nombre: 'Cliente Prueba',
            quote: 'Excelente servicio'
        });
        console.error('❌ ERROR: La petición debería haber fallado con 401.');
    } catch (err) {
        if (err.response?.status === 401) {
            console.log('✅ ÉXITO: Acceso denegado (401 Unauthorized)');
        } else {
            console.error('❌ ERROR inesperado:', err.message);
        }
    }

    console.log('\n--- Auditoría Finalizada ---');
}

testSecurity();
