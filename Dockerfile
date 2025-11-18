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
RUN echo '#!/bin/sh\n\
if [ -z "$GEMINI_API_KEY" ]; then\n\
  echo "Error: GEMINI_API_KEY no está configurada"\n\
  exit 1\n\
fi\n\
echo "Starting Meeting Transcriber AI..."\n\
serve -s dist -l 3000' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]