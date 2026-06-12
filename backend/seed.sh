#!/bin/bash

# Database Seed Script Runner

DB_USER="admin"
DB_PASS="admin1234"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="vpn_db"

echo "=== VPN Service Database Seed ==="
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Check if docker is running
if ! docker ps 2>/dev/null | grep -q "vpn-service-postgres-1"; then
    echo "❌ PostgreSQL container not found!"
    echo "Please start the Docker container first."
    exit 1
fi

echo "✓ PostgreSQL container is running"
echo ""
echo "Executing seed script..."
echo ""

docker exec vpn-service-postgres-1 psql -U "$DB_USER" -d "$DB_NAME" < /home/cheng/Project/vpn-service/backend/seed.ts

echo ""
echo "✓ Seed data inserted successfully!"
echo ""
echo "You can now test the API with the sample data."