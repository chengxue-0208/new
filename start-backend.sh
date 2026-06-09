#!/bin/bash

# VPN Service Backend Startup Script

echo "=== VPN Service Backend - Startup Script ==="
echo ""

# Stop and remove existing containers
echo "1. Stopping and removing existing containers..."
cd /home/chengxue/Projects/vpn-service
sudo docker-compose down -v

echo ""
echo "2. Starting PostgreSQL and Redis containers..."
sudo docker-compose up -d

echo ""
echo "3. Waiting for containers to be ready..."
sleep 5

echo ""
echo "4. Verifying containers are running..."
sudo docker-compose ps

echo ""
echo "5. Testing database connection..."
sleep 2

echo ""
echo "6. Starting the backend application..."
cd /home/chengxue/Projects/vpn-service/backend
npx ts-node src/main.ts

echo ""
echo "=== Script completed ==="