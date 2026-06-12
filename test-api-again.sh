#!/bin/bash

API_BASE="http://localhost:3000/api"

echo "=== Testing API Endpoints ==="
echo ""

# Test Users endpoints
echo "1. GET /api/users"
curl -s "$API_BASE/users"
echo ""
echo ""
echo "2. GET /api/users/:id"
curl -s "$API_BASE/users/test-id-123"
echo ""
echo ""

# Test Nodes endpoints
echo "3. GET /api/nodes"
curl -s "$API_BASE/nodes"
echo ""
echo ""
echo "4. GET /api/nodes/:id"
curl -s "$API_BASE/nodes/node-id-123"
echo ""
echo ""

# Test Subscription Plans endpoints
echo "5. GET /api/subscription-plans"
curl -s "$API_BASE/subscription-plans"
echo ""
echo ""

# Test Orders endpoints
echo "6. GET /api/orders"
curl -s "$API_BASE/orders"
echo ""
echo ""

# Test User Subscriptions endpoints
echo "7. GET /api/user-subscriptions"
curl -s "$API_BASE/user-subscriptions"
echo ""
echo ""

# Test VPN Configurations endpoints
echo "8. GET /api/vpn-configurations"
curl -s "$API_BASE/vpn-configurations"
echo ""
echo ""

# Test Connection Logs endpoints
echo "9. GET /api/connection-logs"
curl -s "$API_BASE/connection-logs"
echo ""
echo ""

# Test System Logs endpoints
echo "10. GET /api/system-logs"
curl -s "$API_BASE/system-logs"
echo ""
echo ""

echo "=== Test Complete ==="