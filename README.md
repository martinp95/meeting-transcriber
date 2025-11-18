<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Meeting Transcriber AI

Una aplicación para subir archivos de audio o video de reuniones y obtener transcripciones completas usando Gemini AI.

## 🚀 Inicio Rápido

### Opción 1: Docker Compose (Recomendado) ⭐

```bash
# 1. Clonar repositorio
git clone https://github.com/mpelaez/meeting-transcriber.git
cd meeting-transcriber

# 2. Configurar API key
cp .env.example .env
# Editar .env y añadir tu GEMINI_API_KEY
nano .env

# 3. Ejecutar
docker-compose up
```

La aplicación estará disponible en `http://localhost:3000`

### Opción 2: Docker directo (Sin clonar)

```bash
# Ejecutar directamente (sin autenticación necesaria)
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=tu_api_key \
  ghcr.io/mpelaez/meeting-transcriber:latest
```

### Opción 3: Instalación local

```bash
# 1. Clonar
git clone https://github.com/mpelaez/meeting-transcriber.git
cd meeting-transcriber

# 2. Instalar dependencias
npm install

# 3. Configurar API key
cp .env.example .env.local
# Editar .env.local con tu GEMINI_API_KEY
nano .env.local

# 4. Ejecutar
npm run dev
```

## 📋 Requisitos

- Node.js 18+ (para desarrollo local)
- Docker & Docker Compose (para Docker)
- [API key de Google Gemini](https://ai.google.dev/)

## 🔑 Obtener API Key

1. Ve a [https://ai.google.dev/](https://ai.google.dev/)
2. Haz clic en "Get API Key"
3. Copia tu clave y pégala en `.env` o `.env.local`

## 📦 Scripts Disponibles

```bash
npm run dev      # Ejecutar en desarrollo (puerto 3000)
npm run build    # Compilar para producción
npm run preview  # Ver build compilado
npm run clean    # Limpiar node_modules, dist y caché
```

## 🐳 Docker

### Variables de Entorno

```env
GEMINI_API_KEY=tu_clave_api_de_gemini
```

### Cambiar Puerto

```bash
# Con Docker Compose
docker-compose -f docker-compose.yml up -e 8000:3000
```

## ⚙️ Características

- 🎙️ Transcripción de audio y video con IA Gemini
- 👥 Identificación automática de hablantes (diarización)
- ⏱️ Marcas de tiempo opcionales
- 📋 Descarga en formatos TXT y Markdown
- 🎨 Interfaz moderna y responsive
- 🔒 Seguridad: API key configurable por usuario

## 🔒 Privacidad y Seguridad

⚠️ **IMPORTANTE:**
- ✅ Repositorio y Docker públicos - accesibles para todos
- ✅ Tu API key de Gemini se configura **localmente** en tiempo de ejecución
- ✅ Los archivos de audio/video **NO se suben** a nuestros servidores
- ✅ Se procesan directamente con Google Gemini en tu máquina
- ⚠️ **NUNCA** hagas commit de `.env` o `.env.local` con la API key real

## 🚀 Despliegue Rápido

### Con Docker

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=tu_key ghcr.io/mpelaez/meeting-transcriber:latest
```

### En producción

```bash
docker pull ghcr.io/mpelaez/meeting-transcribe:latest
docker run -d -p 80:3000 -e GEMINI_API_KEY=tu_key ghcr.io/mpelaez/meeting-transcriber:latest
```

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Autor

Maintained by [@martinp95](https://github.com/martinp95)