#!/usr/bin/env bash
set -e

SERVICE="menu-system"

echo "Restarting $SERVICE..."
sudo systemctl restart $SERVICE

echo "Service restarted."