#!/usr/bin/env bash
# Render build script for frontend

# Exit on error
set -o errexit

# Clean install to avoid dependency issues
echo "Installing dependencies..."
npm ci || npm install

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"
