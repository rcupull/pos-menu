#!/usr/bin/env bash
set -e

SERVICE="menu-system"

echo "Stopping $SERVICE..."
sudo systemctl stop $SERVICE

echo "Service stopped."