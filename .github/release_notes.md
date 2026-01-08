## New Version of Meeting Transcriber AI

### What's New in This Version

#### Features Added
- **MKV file support** for video transcriptions
- **Built-in media player** for audio and video preview
  - Native video player for MP4, MOV, MKV files
  - Clean audio player for MP3, WAV files
  - Local playback without server uploads
- **Transcription history improvements** with search and sort functionality
- **AI Model selection** - Choose between Gemini Pro (high quality) or Gemini Flash (faster processing)
- **Improved UI/UX** for better user experience across all platforms

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
