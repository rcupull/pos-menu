#!/bin/bash

set -e

echo "Installing dependencies..."

npm install --prefix menu-backend
npm install --prefix  menu-frontend

echo "Building backend..."
npm run build --prefix menu-backend

echo "Building frontend..."
npm run build --prefix menu-frontend

echo "Build finished successfully"