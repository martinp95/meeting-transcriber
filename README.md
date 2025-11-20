# Meeting Transcriber AI

A web application that allows you to upload meeting audio or video files and generate full transcriptions using Google Gemini AI.

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

- Node.js 18+ (for local development)
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
npm run preview  # Preview the production build
npm run clean    # Remove node_modules, dist, and cache
```

## Docker

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Changing the Port

```bash
# Using Docker Compose
docker-compose -f docker-compose.yml up -p 8000:3000
```

## Features

- Transcription of audio and video using Gemini AI
- Automatic speaker identification (diarization)
- Optional timestamps
- Export to TXT, Markdown, and DOCX
- Transcription history (stores last 10 locally)
- Light and dark mode
- Multilanguage interface (English and Spanish)
- Includes example audio file for testing

## License

This project is licensed under the MIT License.  
See the LICENSE file for details.

## Author

Maintained by @martinp95 (https://github.com/martinp95)