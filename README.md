# 🔧 Coberturas Bricolaje — PWA

Guía interactiva de coberturas de bricolaje para reparadores colaboradores. Funciona como **Progressive Web App (PWA)** instalable en Android, iOS y PC, con soporte **offline** completo.

---

## 📁 Estructura de archivos

```
bricolaje-pwa/
├── index.html              ← App principal (una sola página)
├── manifest.json           ← Configuración PWA
├── sw.js                   ← Service Worker (offline)
├── favicon.ico             ← Icono pestaña navegador
├── README.md               ← Este archivo
└── icons/
    ├── apple-touch-icon.png  ← iOS (180×180)
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-120.png
    ├── icon-128.png
    ├── icon-144.png          ← Windows / Edge
    ├── icon-152.png          ← iPad
    ├── icon-167.png          ← iPad Pro
    ├── icon-180.png          ← iPhone
    ├── icon-192.png          ← Android Chrome
    ├── icon-384.png
    └── icon-512.png          ← Splash screen Android
```

---

## 🚀 Publicar en GitHub Pages (gratuito)

### Paso 1 — Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en **"New repository"**
3. Nombre: `coberturas-bricolaje` (o el que prefieras)
4. Marca **"Public"**
5. Haz clic en **"Create repository"**

### Paso 2 — Subir los archivos

**Opción A — Desde el navegador (más fácil):**
1. En tu repositorio, haz clic en **"uploading an existing file"**
2. Arrastra todos los archivos y la carpeta `icons/`
3. Escribe un mensaje de commit: `Primera versión`
4. Haz clic en **"Commit changes"**

**Opción B — Con Git (terminal):**
```bash
git clone https://github.com/TU_USUARIO/coberturas-bricolaje.git
cd coberturas-bricolaje
# Copia aquí todos los archivos del proyecto
git add .
git commit -m "Primera versión PWA Coberturas Bricolaje"
git push origin main
```

### Paso 3 — Activar GitHub Pages

1. En tu repositorio, ve a **Settings** → **Pages**
2. En "Source", selecciona **"Deploy from a branch"**
3. Branch: **main** / Folder: **/ (root)**
4. Haz clic en **"Save"**
5. En 1-2 minutos tu app estará en:
   ```
   https://TU_USUARIO.github.io/coberturas-bricolaje/
   ```

---

## 📱 Instalar la app

### Android (Chrome)
1. Abre la URL en Chrome
2. Menú ⋮ → **"Añadir a pantalla de inicio"**
3. La app aparece como icono nativo

### iOS (Safari)
1. Abre la URL en Safari
2. Botón compartir □↑ → **"Añadir a pantalla de inicio"**
3. La app aparece como icono nativo

### PC — Windows / Mac (Chrome o Edge)
1. Abre la URL en Chrome o Edge
2. Icono ⊕ en la barra de direcciones → **"Instalar"**
3. La app se instala como aplicación de escritorio

---

## ✅ Características

- **Sin conexión**: Funciona completamente offline tras la primera carga
- **Instalable**: Se instala como app nativa en Android, iOS y PC
- **Ligera**: Todo en un solo HTML, sin dependencias externas pesadas
- **Responsive**: Adaptada para móvil, tablet y escritorio
- **Sin servidor**: Solo archivos estáticos — GitHub Pages es gratuito

---

## 🔄 Actualizar la app

Para publicar cambios:
1. Edita el `index.html`
2. Cambia la versión en `sw.js`: `const CACHE_NAME = 'bricolaje-v1.0.1';`  
3. Sube los archivos modificados a GitHub → Pages se actualiza automáticamente

---

*Herramienta de consulta interna. Uso exclusivo para reparadores colaboradores.*
