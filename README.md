# Meeting Transcriber AI

[![Node.js](https://img.shields.io/badge/node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-18+-61DAFB.svg?logo=react)](https://react.dev/)
[![License](https://img.shields.io/github/license/martinp95/meeting-transcriber.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg?logo=docker)](https://www.docker.com/)

Meeting Transcriber AI is a modern web application designed to generate high-quality transcriptions from audio or video files using Google Gemini AI. It provides speaker diarization, timestamps, export to TXT/Markdown/DOCX, local history, light/dark mode, and multi-language support (English/Spanish).

Built with simplicity in mind, it offers multiple installation methods including Docker, Docker Compose, and local development. Perfect for meeting summaries, interviews, podcasts, research, and productivity workflows.

## Features

- **Transcription of audio and video** using Gemini AI
- **Automatic speaker identification** (diarization)
- **Optional timestamps** for precise referencing
- **Export formats**: TXT, Markdown, and DOCX
- **Transcription history** with search and sort functionality (stores last 10 locally)
- **AI Model selection**: Choose between Gemini Pro (high quality) or Gemini Flash (faster)
- **Built-in media player**: Preview audio and video files before transcription
  - Native browser video player for video files (MP4, MOV, MKV)
  - Clean audio player for audio files (MP3, WAV)
  - Local playback without external server uploads
  - **Interactive timestamps**: Click any timestamp in the transcription to seek to that point in the player
- **Light and dark mode** with theme persistence
- **Multi-language interface**: English and Spanish support
- **Multi-language transcriptions**: Generate transcriptions in different languages (English, Spanish, and more)
- **Sample audio file** (Apollo 11) included for testing
- **MKV file support** for video transcriptions
- **Translate transcription**: Option to translate the transcription to different languages

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/martinp95/meeting-transcriber.git
cd meeting-transcriber

# 2. Configure your API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
nano .env

# 3. Run
docker-compose up
```

The app will be available at:
http://localhost:3000

### Option 2: Direct Docker Run (No cloning required)

```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_api_key \
  ghcr.io/martinp95/meeting-transcriber:latest
```

### Option 3: Local Installation (Development)

```bash
# 1. Clone the repository
git clone https://github.com/martinp95/meeting-transcriber.git
cd meeting-transcriber

# 2. Install dependencies
npm install

# 3. Configure your API key
cp .env.example .env.local
nano .env.local  # Add your GEMINI_API_KEY

# 4. Run the development server
npm run dev
```

## Requirements

- Node.js 20+ (for local development)
- Docker & Docker Compose (for containerized execution)
- Google Gemini API Key (https://ai.google.dev/)

## Get Your API Key

1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Copy your key and paste it into your .env or .env.local file

## Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Create production build
npm run clean    # Remove node_modules, dist, and cache
```

## Internationalization (i18n)

Meeting Transcriber AI supports multiple languages. Currently available: **English** and **Spanish**.

To add new language support or customize existing translations, see the [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) guide.

## Docker Details

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Changing the Port

```bash
# Using Docker Compose
docker-compose -f docker-compose.yml up -p 8000:3000
```

---

## Author
Maintained by [@martinp95](https://github.com/martinp95)

---

## License

Licensed under the [MIT License](LICENSE).