#!/bin/bash
echo "=== VPN API 测试 ==="
echo ""
echo "1. 测试健康检查:"
curl -v http://localhost:3000/api/health 2>&1 | grep -E "(HTTP|success|status|error)" | head -5
echo ""

echo "2. 测试注册:"
curl -v -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test$(date +%s)@test.com","password":"Test123456"}' 2>&1 | grep -E "(HTTP|success|error|accessToken)" | head -5
echo ""

echo "3. 测试登录:"
curl -v -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}' 2>&1 | grep -E "(HTTP|success|error|accessToken)" | head -5
echo ""

echo "4. 测试获取节点列表:"
curl -v http://localhost:3000/api/nodes 2>&1 | grep -E "(HTTP|success|error|data)" | head -5
echo ""

echo "5. 测试订阅套餐列表:"
curl -v http://localhost:3000/api/subscription/plans 2>&1 | grep -E "(HTTP|success|error|data)" | head -5
echo ""

echo "=== 测试完成 ==="