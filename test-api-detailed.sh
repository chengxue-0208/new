#!/bin/bash

# VPN Service API 详细测试脚本

BASE_URL="http://localhost:3000"
PASSED=0
FAILED=0

echo "========================================"
echo "  VPN Service API 详细测试"
echo "========================================"
echo ""

# 1. 测试根路径
echo "测试 1: 根路径"
curl -s -X GET http://localhost:3000/
if [ $? -eq 0 ]; then
    echo "✓ 通过"
    ((PASSED++))
else
    echo "✗ 失败"
    ((FAILED++))
fi
echo ""

# 2. 测试注册接口
echo "测试 2: 用户注册"
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test4@example.com","password":"Test123456"}' \
    "$BASE_URL/auth/register")

http_code=$(echo "$response" | tail -n1)
echo "响应状态码: $http_code"
if [ "$http_code" = "201" ]; then
    echo "✓ 通过"
    ((PASSED++))
else
    echo "✗ 失败 (期望 201，得到 $http_code)"
    ((FAILED++))
fi
echo ""

# 3. 测试登录接口
echo "测试 3: 用户登录"
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test4@example.com","password":"Test123456"}' \
    "$BASE_URL/auth/login")

http_code=$(echo "$response" | tail -n1)
echo "响应状态码: $http_code"
response_body=$(echo "$response" | sed '$d')
echo "响应内容: $response_body"
if [ "$http_code" = "200" ]; then
    echo "✓ 通过"
    ((PASSED++))
else
    echo "✗ 失败 (期望 200，得到 $http_code)"
    ((FAILED++))
fi
echo ""

# 4. 测试节点列表
echo "测试 4: 获取节点列表"
curl -s -X GET http://localhost:3000/nodes
echo ""
echo ""

# 5. 测试 VPN 连接
echo "测试 5: 建立VPN连接"
if [ -n "$response_body" ] && echo "$response_body" | grep -q "accessToken"; then
    token=$(echo "$response_body" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

    curl -s -X POST \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{"nodeId":"test-node-id"}' \
        "$BASE_URL/vpn/connect"

    echo ""
    echo ""
fi
echo ""

# 6. 测试订阅套餐列表
echo "测试 6: 获取订阅套餐列表"
curl -s -X GET http://localhost:3000/subscription/plans
echo ""
echo ""

# 7. 测试订单列表
echo "测试 7: 获取订单列表"
if [ -n "$token" ] && echo "$response_body" | grep -q "accessToken"; then
    curl -s -X GET \
        -H "Authorization: Bearer $token" \
        http://localhost:3000/orders

    echo ""
    echo ""
fi
echo ""

# 8. 测试支付创建
echo "测试 8: 创建支付订单"
if [ -n "$token" ] && echo "$response_body" | grep -q "accessToken"; then
    curl -s -X POST \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{"planId":"test-plan-id","paymentMethod":"alipay"}' \
        "$BASE_URL/payment/create"

    echo ""
    echo ""
fi
echo ""

# 总结
echo "========================================"
echo "  测试总结"
echo "========================================"
echo "通过: $PASSED"
echo "失败: $FAILED"
echo "========================================"

if [ $FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi