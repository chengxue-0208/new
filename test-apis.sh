#!/bin/bash

# API接口测试脚本
# 测试前后端API接口是否匹配

echo "=========================================="
echo "前端API接口测试脚本"
echo "=========================================="
echo ""

API_BASE_URL="http://localhost:3000"

# 测试接口列表
TESTED=0
PASSED=0
FAILED=0

# 1. POST /auth/login
echo "[测试1] POST /auth/login"
response=$(curl -s -X POST "${API_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}')

if echo "$response" | grep -q "token\|accessToken"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 未返回token或accessToken"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 2. GET /nodes
echo "[测试2] GET /nodes"
response=$(curl -s -X GET "${API_BASE_URL}/nodes")
if echo "$response" | grep -q "data\|nodes"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 3. GET /users
echo "[测试3] GET /users"
response=$(curl -s -X GET "${API_BASE_URL}/users")
if echo "$response" | grep -q "data\|users"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 4. GET /subscription-plans
echo "[测试4] GET /subscription-plans"
response=$(curl -s -X GET "${API_BASE_URL}/subscription-plans")
if echo "$response" | grep -q "data\|plans"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 5. GET /vpn-status
echo "[测试5] GET /vpn/status"
response=$(curl -s -X GET "${API_BASE_URL}/vpn/status")
if echo "$response" | grep -q "data\|status"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 6. GET /vpn-config
echo "[测试6] GET /vpn/config"
response=$(curl -s -X GET "${API_BASE_URL}/vpn/config")
if echo "$response" | grep -q "data\|config"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 7. POST /payment/create
echo "[测试7] POST /payment/create"
response=$(curl -s -X POST "${API_BASE_URL}/payment/create" \
  -H "Content-Type: application/json" \
  -d '{"planId":"1","paymentMethod":"ALIPAY","userId":"1"}')
if echo "$response" | grep -q "success\|transactionId"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 8. GET /payment/verify
echo "[测试8] GET /payment/verify?transactionId=123456"
response=$(curl -s -X GET "${API_BASE_URL}/payment/verify?transactionId=123456")
if echo "$response" | grep -q "success\|data"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 9. GET /vpn-configurations
echo "[测试9] GET /vpn-configurations"
response=$(curl -s -X GET "${API_BASE_URL}/vpn-configurations")
if echo "$response" | grep -q "data\|configs"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 10. POST /vpn/connect
echo "[测试10] POST /vpn/connect"
response=$(curl -s -X POST "${API_BASE_URL}/vpn/connect" \
  -H "Content-Type: application/json" \
  -d '{"nodeId":"1"}')
if echo "$response" | grep -q "data\|message"; then
  echo "✅ PASS"
  PASSED=$((PASSED + 1))
else
  echo "❌ FAIL - 返回数据不正确"
  FAILED=$((FAILED + 1))
fi
TESTED=$((TESTED + 1))

# 总结
echo ""
echo "=========================================="
echo "测试结果统计"
echo "=========================================="
echo "总测试数: $TESTED"
echo "通过: $PASSED"
echo "失败: $FAILED"
echo ""

# 计算成功率
if [ $TESTED -gt 0 ]; then
  success_rate=$((PASSED * 100 / TESTED))
  echo "成功率: ${success_rate}%"
fi

echo ""
echo "详细响应示例："
echo "=========================================="
echo ""

if [ $PASSED -gt 0 ]; then
  echo "【通过】的接口示例："
  echo "$response" | head -20
fi

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "【失败】的接口响应："
  echo "$response"
fi