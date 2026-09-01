# 🌊 inFlow - Maestro de Flujo Financiero (v3)

inFlow es una aplicación web premium diseñada para personas con ingresos variables. Permite el registro inteligente de finanzas a través de un asesor de IA que comprende métricas temporales y estados de flujo de caja.

## 🚀 Características Principales
- **Asesor IA Conversacional:** Registra ingresos y gastos mediante lenguaje natural.
- **Métricas Temporales v3:** Soporta prorrateo por minutos, horas, días, etc.
- **Flujo de Caja Inteligente:** Distingue entre dinero `acumulado_trabajo` (pendiente de cobro) y `depositado_banco` (líquido).
- **Modo Oscuro Premium:** UI optimizada para pantallas OLED y uso en la calle.
- **PWA & Offline Sync:** Instalable en el móvil y sincronización automática de datos cuando vuelve la conexión.
- **Acceso Seguro:** Bloqueo por PIN táctil.

## 🛠️ Stack Tecnológico
- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **Base de Datos & Auth:** Supabase (PostgreSQL)
- **Iconografía:** Lucide React

## ⚙️ Configuración y Despliegue

### 1. Base de Datos (Supabase)
Ejecuta el código SQL contenido en `schema.sql` en el editor SQL de tu proyecto de Supabase para crear las tablas necesarias.

### 2. Variables de Entorno
Crea un archivo `.env.local` en la raíz con las siguientes claves:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
\`\`\`

### 3. Instalación Local
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📱 Despliegue en Producción
Recomendado: **Vercel** o **Netlify**.
1. Sube el código a un repositorio de GitHub.
2. Conecta el repositorio a la plataforma elegida.
3. Agrega las variables de entorno en la configuración del proyecto en la plataforma.
\`\`\`
