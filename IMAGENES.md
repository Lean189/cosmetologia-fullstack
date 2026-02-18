# Guía para Agregar Imágenes

## 📸 Imágenes Necesarias

Para completar el diseño de tu página, necesitas agregar las siguientes imágenes en la carpeta `public/`:

### 1. **Hero Background** (`hero-background.jpg`)
- **Ubicación**: `/public/hero-background.jpg`
- **Tamaño recomendado**: 1920x1080px
- **Descripción**: Imagen de fondo para la sección principal (hero). Puede ser de tu estudio, un tratamiento, o una imagen relajante relacionada con cosmetología.
- **Dónde se usa**: Sección principal al inicio de la página

### 2. **Foto Profesional** (`antonella-professional.jpg`)
- **Ubicación**: `/public/antonella-professional.jpg`
- **Tamaño recomendado**: 800x800px (cuadrada)
- **Descripción**: Foto profesional de Antonella para la sección "Conoce a Antonella"
- **Dónde se usa**: Sección "About" / Historia

### 3. **Logo** (`logo.png`)
- **Ubicación**: `/public/logo.png`
- **Tamaño recomendado**: 200x60px
- **Descripción**: Logo de AntoLopez Skinstudio (PNG con fondo transparente)
- **Dónde se usa**: Header/navegación

### 4. **Imágenes de Servicios** (Opcional)
- **Ubicación**: `/public/services/`
- **Tamaño recomendado**: 600x400px cada una
- **Descripción**: Imágenes de diferentes tratamientos (facial, peeling, microneedling, etc.)
- **Dónde se usa**: Carrusel de servicios

---

## 🔄 Cómo Reemplazar las Imágenes

### Paso 1: Descargar tus imágenes
Descarga las fotos de tu Instagram o toma fotos profesionales de tu estudio.

### Paso 2: Optimizar las imágenes
- Usa herramientas como [TinyPNG](https://tinypng.com/) o [Squoosh](https://squoosh.app/) para reducir el tamaño
- Mantén buena calidad pero archivos pequeños (< 500KB cada uno)

### Paso 3: Copiar a la carpeta public
```bash
# Desde la carpeta frontend
cp /ruta/a/tu/imagen.jpg public/hero-background.jpg
cp /ruta/a/tu/foto.jpg public/antonella-professional.jpg
cp /ruta/a/tu/logo.png public/logo.png
```

### Paso 4: Actualizar el código
Las imágenes ya están configuradas en el código, solo necesitas descomentar las líneas:

#### En `app/page.tsx`:
```tsx
// Busca estas líneas y descoméntalas:

// Hero section (línea ~55):
<Image src="/hero-background.jpg" alt="Spa background" fill className="object-cover mix-blend-overlay" />

// About section (línea ~105):
<Image src="/antonella-professional.jpg" alt="Antonella - Cosmetóloga Profesional" fill className="object-cover" />

// Services (línea ~140):
<Image src="/service-image.jpg" alt={servicio.nombre} fill className="object-cover" />
```

#### En `components/Header.tsx`:
```tsx
// Línea ~29:
<Image src="/logo.png" alt="AntoLopez Logo" width={40} height={40} className="object-contain" />
```

---

## ✅ Verificar que Funciona

1. Guarda los cambios
2. El servidor de desarrollo debería recargar automáticamente
3. Abre http://localhost:3000 en tu navegador
4. Verifica que las imágenes se vean correctamente

---

## 📱 Responsive Design

La página ya está completamente optimizada para:
- **Mobile** (< 768px): Diseño vertical, menú hamburguesa
- **Tablet** (768px - 1024px): Diseño adaptado con 2 columnas
- **Desktop** (> 1024px): Diseño completo con todas las columnas

Prueba redimensionando la ventana del navegador o usando las herramientas de desarrollador (F12 → Toggle Device Toolbar).
