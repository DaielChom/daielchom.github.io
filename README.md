# 🌐 Portfolio & CV - Daniel Carvajal Patiño

[![Deploy to GitHub Pages](https://github.com/DaielChom/daielchom.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/DaielChom/daielchom.github.io/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdaielchom.github.io)](https://daielchom.github.io)

Sitio web personal y portfolio profesional con generación automática de CV en PDF optimizado para sistemas ATS (Applicant Tracking Systems).

🔗 **Live Demo:** [https://daielchom.github.io](https://daielchom.github.io)

---

## ✨ Características

- 🎨 **Diseño Moderno** - Interfaz oscura elegante con animaciones suaves
- 🌍 **Bilingüe** - Español e Inglés con cambio dinámico
- 📄 **Generación de PDF** - CVs optimizados para ATS automáticamente
- 📱 **Responsive** - Adaptado a todos los dispositivos
- ⚡ **Ultra Rápido** - Construido con Vite para máximo rendimiento
- 🔄 **Deploy Automático** - GitHub Actions despliega en cada push

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| [React 18](https://react.dev/) | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Vite](https://vitejs.dev/) | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos |
| [@react-pdf/renderer](https://react-pdf.org/) | Generación PDF |
| [GitHub Actions](https://github.com/features/actions) | CI/CD |

---

## 📁 Estructura del Proyecto

```
daielchom.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions para deploy
├── public/
│   ├── certificates/         # PDFs de certificados
│   ├── cv/                   # PDFs generados del CV
│   ├── images/               # Imágenes (foto de perfil, etc.)
│   └── favicon.svg
├── scripts/
│   └── generate-pdf.ts       # Script de generación de PDF
├── src/
│   ├── components/           # Componentes React
│   ├── context/              # Context API (idioma)
│   ├── data/
│   │   ├── resume.yaml       # ⭐ Datos del CV
│   │   └── labels.yaml       # Textos de la UI
│   ├── hooks/                # Custom hooks
│   ├── types/                # Tipos TypeScript
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- [Node.js](https://nodejs.org/) >= 18.x
- npm >= 9.x

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DaielChom/daielchom.github.io.git
cd daielchom.github.io

# Instalar dependencias
npm install
```

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# El sitio estará disponible en http://localhost:5173
```

### Generar PDFs del CV

```bash
# Generar CV en español
npm run pdf:es

# Generar CV en inglés
npm run pdf:en

# Generar ambos
npm run pdf:all
```

Los PDFs se generan en `public/cv/`:
- `CV_Daniel_Carvajal_ES.pdf`
- `CV_Daniel_Carvajal_EN.pdf`

### Build de Producción

```bash
# Crear build optimizado
npm run build

# Preview del build
npm run preview
```

---

## 📝 Editar Datos del CV

### Archivo Principal: `src/data/resume.yaml`

Todos los datos del CV están centralizados en un solo archivo YAML. Edita este archivo para actualizar tu información:

```yaml
# Información personal
personal:
  name: "Tu Nombre"
  email: "tu@email.com"
  phone: "+57 XXX XXX XXXX"
  # ...

# Experiencia laboral
experience:
  - company: "Empresa"
    title:
      es: "Cargo en Español"
      en: "Job Title in English"
    startDate: "2022-01"
    endDate: null  # null = Presente
    highlights:
      es:
        - "Logro 1 en español"
        - "Logro 2 en español"
      en:
        - "Achievement 1 in English"
        - "Achievement 2 in English"
    showInPdf: true  # false para ocultar en el PDF

# ... más secciones
```

### Propiedades Especiales

| Propiedad | Descripción |
|-----------|-------------|
| `showInPdf: false` | Oculta el item en el PDF (solo aparece en web) |
| `endDate: null` | Indica posición actual ("Presente") |
| `highlights.es/en` | Versión corta para PDF (bullets) |
| `description.es/en` | Versión larga para web |

### Textos de la UI: `src/data/labels.yaml`

```yaml
navigation:
  home:
    es: "Inicio"
    en: "Home"
  # ...
```

---

## 🌐 Deploy en GitHub Pages

### Configuración Inicial (una sola vez)

1. **Ve a Settings > Pages** en tu repositorio
2. **Source:** GitHub Actions
3. ¡Listo! El workflow se encarga del resto

### Deploy Automático

Cada push a `main` activa el workflow que:

1. ✅ Instala dependencias
2. ✅ Genera los PDFs del CV
3. ✅ Construye el sitio
4. ✅ Despliega a GitHub Pages

### Deploy Manual

También puedes disparar el deploy manualmente:

1. Ve a **Actions** en GitHub
2. Selecciona **Deploy to GitHub Pages**
3. Click en **Run workflow**

---

## 📄 Generación de PDF (ATS-Friendly)

Los PDFs generados están optimizados para sistemas ATS:

### ✅ Características ATS-Friendly

- **Formato simple** - Sin tablas complejas ni columnas anidadas
- **Texto seleccionable** - No son imágenes
- **Fuentes estándar** - Helvetica (universalmente compatible)
- **Secciones claras** - Encabezados estándar reconocibles
- **Keywords visibles** - Skills técnicos prominentes
- **1 página** - Contenido conciso y relevante
- **Sin gráficos decorativos** - Los ATS no los interpretan

### 📐 Estructura del PDF

```
┌────────────────────────────────────────┐
│  NOMBRE COMPLETO                        │
│  Título Profesional                     │
│  email | teléfono | ubicación | links   │
├────────────────────────────────────────┤
│  RESUMEN PROFESIONAL                    │
│  Descripción breve (2-3 líneas)        │
├────────────────────────────────────────┤
│  EXPERIENCIA PROFESIONAL                │
│  • Empresa - Cargo (Fecha)             │
│    - Logro 1                           │
│    - Logro 2                           │
├────────────────────────────────────────┤
│  EDUCACIÓN                              │
├────────────────────────────────────────┤
│  HABILIDADES        │  IDIOMAS          │
│  Python, SQL...     │  Español - Nativo │
│                     │  Inglés - C1      │
└────────────────────────────────────────┘
```

---

## 🎨 Personalización

### Colores

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#14b8a6',  // Teal - color principal
        // ...
      },
      accent: {
        500: '#d946ef',  // Magenta - color de acento
        // ...
      },
    },
  },
}
```

### Fuentes

Edita `index.html` para cambiar las Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=TuFuente:wght@400;700&display=swap" rel="stylesheet" />
```

Y `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['TuFuente', 'system-ui', 'sans-serif'],
}
```

---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Ejecutar ESLint |
| `npm run pdf:es` | Generar CV en español |
| `npm run pdf:en` | Generar CV en inglés |
| `npm run pdf:all` | Generar ambos CVs |

---

## 🔧 Solución de Problemas

### El PDF no se genera

```bash
# Asegúrate de tener todas las dependencias
npm install

# Verifica que el YAML sea válido
npm run pdf:all
```

### Error de tipos TypeScript

```bash
# Regenerar tipos
npm run build
```

### Los cambios no aparecen en GitHub Pages

1. Verifica que el push llegó a `main`
2. Revisa el estado del workflow en **Actions**
3. Espera 1-2 minutos para la propagación de caché

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usarlo como base para tu propio portfolio.

---

## 🙏 Agradecimientos

- Diseño inspirado en tendencias modernas de UI/UX
- [react-pdf](https://react-pdf.org/) por la generación de PDF
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de estilos
- [Lucide Icons](https://lucide.dev/) por los iconos

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella!**

Made with ❤️ by [Daniel Carvajal Patiño](https://github.com/DaielChom)

</div>
