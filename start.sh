#!/bin/bash


# 1. Cargar NVM para que reconozca los comandos de Node
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. (Opcional) Asegurarte de usar la v20.1.0
nvm use v20.1.0 --silent

# Nos situamos en la carpeta del script
cd "$(dirname "$0")"

echo "------------------------------------------"
echo "🚀 Iniciando POS-Menu Backend..."
echo "------------------------------------------"

# Abrir el navegador en segundo plano tras 2 segundos 
# (Damos tiempo a que el proceso de Node empiece a levantar)
(sleep 2; open "http://localhost:4000") &

# Ejecutar el backend
npm start --prefix menu-backend || {
    echo "❌ Error al iniciar el servidor."
    read
}
