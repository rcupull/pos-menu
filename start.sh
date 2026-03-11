#!/usr/bin/env bash
set -e

SERVICE="menu-system"

echo "Starting $SERVICE..."
sudo systemctl start $SERVICE

echo "Service started."