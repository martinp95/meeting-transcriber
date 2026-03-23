## New Version of Meeting Transcriber AI

### What's New in This Version

#### Features Added
- **Multi-language transcriptions** - Generate transcriptions in different languages (English, Spanish, and more)
- **Translate transcription** - Option to translate the transcription output to different languages

---

## Installation Methods

### 1. Docker Compose
```bash
# 1. Clone the repository
git clone https://github.com/martinp95/meeting-transcriber.git
cd meeting-transcriber

# 2. Set your API key
cp .env.example .env
nano .env  # Edit with your GEMINI_API_KEY

# 3. Run
docker-compose up
```

---

### 2. Docker
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_api_key \
  ghcr.io/martinp95/meeting-transcriber:v1.0.0
```

---

### 3. Local Installation
```bash
npm install
cp .env.example .env.local
nano .env.local  # Edit with your GEMINI_API_KEY
npm run dev
```
