#!/bin/bash
export DATABASE_URL="postgresql://admin:admin1234@localhost:5432/vpn_db"
export NODE_ENV=production
export REDIS_URL="redis://localhost:6379"

while true; do
    node /home/cheng/Project/vpn-service/backend/dist/main.js
    sleep 5
done
