# Cosmetología Web - Sistema de Gestión de Citas

Sistema web completo para gestión de citas de un estudio de cosmetología, desarrollado con Next.js (frontend) y Django (backend).

## 🚀 Características

- ✅ Sistema de reservas online con validación de disponibilidad
- ✅ Prevención de solapamiento de citas
- ✅ Configuración flexible de horarios por día de la semana
- ✅ Sistema de bloqueo de fechas (feriados, vacaciones)
- ✅ Envío automático de emails de confirmación
- ✅ Panel de administración Django
- ✅ API RESTful con Django REST Framework
- ✅ Diseño responsive y moderno
- ✅ SEO optimizado

## 📋 Requisitos Previos

### Backend
- Python 3.11 o superior
- pip (gestor de paquetes de Python)

### Frontend
- Node.js 18 o superior
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd cosmetologia_web
```

### 2. Configurar Backend (Django)

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de ejemplo de variables de entorno
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Editar .env con tus configuraciones
# IMPORTANTE: Configura SECRET_KEY, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario para el panel admin
python manage.py createsuperuser

# Cargar datos iniciales (opcional)
python manage.py loaddata initial_data.json  # Si existe

# Iniciar servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### 3. Configurar Frontend (Next.js)

```bash
# Abrir nueva terminal y navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
copy .env.example .env.local  # Windows
cp .env.example .env.local    # Linux/Mac

# Editar .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## 🔧 Configuración

### Variables de Entorno - Backend (.env)

```env
# Django Configuration
SECRET_KEY=tu-clave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration (Gmail)
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-contraseña-de-aplicación
SERVER_EMAIL=reservas@tudominio.com
```

**Nota sobre Gmail**: Debes generar una "Contraseña de Aplicación" en tu cuenta de Gmail:
1. Ve a https://myaccount.google.com/apppasswords
2. Genera una nueva contraseña de aplicación
3. Usa esa contraseña en `EMAIL_HOST_PASSWORD`

### Variables de Entorno - Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/
```

## 📊 Estructura del Proyecto

```
cosmetologia_web/
├── backend/
│   ├── core/                 # Configuración principal de Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── gestion/              # App principal
│   │   ├── models.py         # Modelos: Servicio, Cliente, Cita, etc.
│   │   ├── views.py          # ViewSets de la API
│   │   ├── serializers.py    # Serializadores DRF
│   │   └── admin.py          # Configuración del admin
│   ├── requirements.txt
│   └── manage.py
│
└── frontend/
    ├── app/
    │   ├── page.tsx          # Landing page
    │   ├── layout.tsx        # Layout principal
    │   └── reservar/
    │       └── page.tsx      # Página de reservas
    ├── components/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   └── WhatsAppButton.tsx
    └── package.json
```

## 🎯 Uso

### Panel de Administración

1. Accede a `http://localhost:8000/admin`
2. Inicia sesión con el superusuario creado
3. Gestiona:
   - Servicios (tratamientos disponibles)
   - Clientes
   - Citas
   - Configuración de horarios
   - Bloqueos de fechas

### API Endpoints

- `GET /api/servicios/` - Lista de servicios activos
- `GET /api/servicios/{id}/disponibilidad/?fecha=YYYY-MM-DD` - Horarios disponibles
- `POST /api/citas/` - Crear nueva cita
- `GET /api/configuracion-horarios/` - Horarios de atención

### Crear una Cita (Ejemplo)

```bash
curl -X POST http://localhost:8000/api/citas/ \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": 1,
    "servicio": 1,
    "fecha": "2025-12-30",
    "hora_inicio": "14:00",
    "notas": "Primera visita"
  }'
```

## 🧪 Testing

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## 📦 Despliegue a Producción

Ver [analisis_completo.md](./docs/analisis_completo.md) para instrucciones detalladas de migración.

### Checklist Rápido

- [ ] Generar nueva `SECRET_KEY` segura
- [ ] Configurar `DEBUG=False`
- [ ] Configurar base de datos PostgreSQL
- [ ] Configurar `ALLOWED_HOSTS` con tu dominio
- [ ] Configurar CORS con dominios de producción
- [ ] Ejecutar `collectstatic`
- [ ] Configurar SSL/HTTPS
- [ ] Configurar backups automáticos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y confidencial.

## 📞 Soporte

Para soporte, contacta a: [tu-email@ejemplo.com]

## 🔄 Changelog

### v1.0.0 (2025-12-28)
- ✅ Sistema base de reservas
- ✅ Integración con Gmail
- ✅ Panel de administración
- ✅ Validación de horarios
- ✅ Diseño responsive
- ✅ Correcciones de errores críticos
- ✅ Mejoras en logging y manejo de errores
