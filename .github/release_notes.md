## New Version of Meeting Transcriber AI (v1.3.0)

### What's New in This Version

#### Improvements
- **Updated Gemini Models** - Now using gemini-3.1-pro-preview and gemini-3.5-flash for better performance and accuracy
- **Dependency Updates** - Updated Vite, PostCSS, WebSocket and other dependencies for improved stability and security

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
