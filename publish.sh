#!/bin/bash

set -e

echo "📦 Meeting Transcriber AI - Publicación"
echo "======================================"

# Limpiar
echo "🧹 Limpiando..."
npm run clean

# Instalar
echo "📥 Instalando dependencias..."
npm install

# Build
echo "🔨 Compilando..."
npm run build

# Versión
VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')

if [ -z "$VERSION" ]; then
  echo "❌ No se encontró versión en package.json"
  exit 1
fi

echo "🔖 Versión: $VERSION"

# Preguntar versión nueva
read -p "¿Nueva versión (actual: $VERSION)? Ej: 1.0.0 (Presiona Enter para saltar): " NEW_VERSION

if [ ! -z "$NEW_VERSION" ]; then
  echo "📝 Actualizando versión a $NEW_VERSION..."
  npm version $NEW_VERSION --no-git-tag-version
  VERSION=$NEW_VERSION
fi

# Git
echo "📤 Subiendo cambios a GitHub..."
git add -A
git commit -m "chore: release v$VERSION" || echo "ℹ️ No hay cambios para commit"
git push origin main

# Tag y release
echo "🏷️ Creando tag v$VERSION..."
git tag -a "v$VERSION" -m "Release version $VERSION" || echo "ℹ️ Tag ya existe"
git push origin main --tags

echo ""
echo "✅ ¡Listo!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. GitHub Actions publicará automáticamente el Docker"
echo "   2. Ve a: https://github.com/mpelaez/meeting-transcribe/releases"
echo "   3. Edita la release si es necesario"
echo ""