#!/usr/bin/env bash

SERVICE="menu-system"

echo "Showing logs for $SERVICE..."
echo "Press CTRL+C to exit"
echo

journalctl -u $SERVICE -f
