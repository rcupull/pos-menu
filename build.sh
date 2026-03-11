#!/bin/bash

# 1. Cargar NVM para que reconozca los comandos de Node
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. (Opcional) Asegurarte de usar la v20.1.0
nvm use v20.1.0 --silent


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