#!/bin/bash

# 简单的用户注册测试
BASE_URL="http://localhost:3000"

echo "测试用户注册功能..."

# 测试1: 注册新用户
echo ""
echo "测试1: 注册新用户"
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser43@example.com","password":"Test123456"}' \
  -w "\nHTTP状态码: %{http_code}\n" \
  2>&1 | tail -5

# 测试2: 注册相同邮箱（应该失败）
echo ""
echo "测试2: 注册相同邮箱（应该返回403错误）"
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser43@example.com","password":"Test123456"}' \
  -w "\nHTTP状态码: %{http_code}\n" \
  2>&1 | tail -5

# 测试3: 注册另一个用户
echo ""
echo "测试3: 注册另一个用户"
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser44@example.com","password":"Test123456"}' \
  -w "\nHTTP状态码: %{http_code}\n" \
  2>&1 | tail -5

echo ""
echo "测试完成"