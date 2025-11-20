#!/bin/bash

set -e

echo "Meeting Transcriber AI - Release"
echo "======================================"

# Clean
echo "Cleaning..."
npm run clean

# Install
echo "Installing dependencies..."
npm install

# Build
echo "Building..."
npm run build

# Version
VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')

if [ -z "$VERSION" ]; then
  echo "No version found in package.json"
  exit 1
fi

echo "Current version: $VERSION"

# Ask for new version
read -p "New version (current: $VERSION)? e.g. 1.0.0 (Press Enter to skip): " NEW_VERSION

if [ ! -z "$NEW_VERSION" ]; then
  echo "Updating version to $NEW_VERSION..."
  npm version $NEW_VERSION --no-git-tag-version
  VERSION=$NEW_VERSION
fi

# Git
echo "Pushing changes to GitHub..."
git add -A
git commit -m "chore: release v$VERSION" || echo "No changes to commit"
git push origin main

# Tag and release
echo "Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "Release version $VERSION" || echo "Tag already exists"
git push origin main --tags

echo ""
echo "Done!"
echo ""
echo "Next steps:"
echo "   1. GitHub Actions will automatically publish the Docker image"
echo "   2. Go to: https://github.com/mpelaez/meeting-transcriber/releases"
echo "   3. Edit the release if necessary"
echo ""