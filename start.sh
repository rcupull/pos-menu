#!/bin/bash

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