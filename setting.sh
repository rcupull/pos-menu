#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="menu-system"
APP_USER="${SUDO_USER:-$USER}"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
START_SCRIPT="$ROOT_DIR/start.sh"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

echo "======================================"
echo " CONFIGURANDO MENU SYSTEM"
echo "======================================"

echo "Root dir: $ROOT_DIR"
echo "Usuario del servicio: $APP_USER"

if [ ! -f "$START_SCRIPT" ]; then
  echo "No se encontró $START_SCRIPT"
  exit 1
fi

echo "Instalando dependencias del sistema..."
sudo apt update
sudo apt install -y nodejs npm

echo "Dando permisos al script de arranque..."
chmod +x "$START_SCRIPT"

echo "Creando servicio systemd..."
sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Menu System Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$ROOT_DIR
ExecStart=$START_SCRIPT
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo "Recargando systemd..."
sudo systemctl daemon-reload

echo "Habilitando servicio para arranque automático..."
sudo systemctl enable "$SERVICE_NAME"

echo "Iniciando servicio..."
sudo systemctl restart "$SERVICE_NAME"

echo
echo "======================================"
echo " CONFIGURACIÓN COMPLETADA"
echo "======================================"
echo
echo "Estado del servicio:"
sudo systemctl --no-pager --full status "$SERVICE_NAME" || true
echo
echo "Logs en vivo:"
echo "journalctl -u $SERVICE_NAME -f"
echo