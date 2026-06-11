#!/bin/bash

# VPN Service Backend Start Script

cd "$(dirname "$0")"

echo "Starting VPN Service Backend..."
echo "Using ts-node for development..."

# Kill any existing process
pkill -f "ts-node.*main.ts" || true
sleep 2

# Start the backend
nohup npx ts-node src/main.ts > logs/backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Logs are being written to: logs/backend.log"
echo "Press Ctrl+C to stop the backend"

# Monitor the log
tail -f logs/backend.log &
TAIL_PID=$!

trap "kill $TAIL_PID" EXIT

wait $BACKEND_PID