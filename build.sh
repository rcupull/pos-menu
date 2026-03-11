#!/bin/bash

# Nos situamos en la carpeta del script
cd "$(dirname "$0")"

echo "Updating repositories..."
git pull

echo "Installing dependencies..."

npm install --prefix menu-backend
npm install --prefix  menu-frontend

echo "Building backend..."
npm run build --prefix menu-backend

echo "Building frontend..."
npm run build --prefix menu-frontend

echo "Build finished successfully"