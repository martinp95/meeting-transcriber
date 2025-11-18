FROM node:22-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código
COPY . .

# Build
RUN npm run build

# Instalar servidor para producción
RUN npm install -g serve

# Puerto
EXPOSE 3000

# Script de inicio que inyecta la API key
RUN printf '#!/bin/sh\nif [ -z "$GEMINI_API_KEY" ]; then\n  echo "Error: GEMINI_API_KEY no está configurada"\n  exit 1\nfi\necho "Starting Meeting Transcriber AI..."\nserve -s dist -l 3000\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/bin/sh", "/app/start.sh"]