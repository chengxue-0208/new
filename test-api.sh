#!/bin/bash

# API 测试脚本

BACKEND_URL="http://localhost:3000"
LOG_FILE="/tmp/api-test.log"

echo "=== VPN Service API 测试 ==="
echo "日志文件: $LOG_FILE"
echo ""

# 启动后端
echo "正在启动后端服务..."
cd /home/cheng/Project/vpn-service/backend
npx ts-node src/main.ts > $LOG_FILE 2>&1 &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"
echo "等待服务启动..."
sleep 30

# 测试根路径
echo ""
echo "=== 测试 1: 根路径 ==="
curl -s "$BACKEND_URL/" | head -5

# 测试节点列表
echo ""
echo "=== 测试 2: 获取节点列表 ==="
curl -s "$BACKEND_URL/nodes" | head -20

# 测试登录
echo ""
echo "=== 测试 3: 用户登录 ==="
curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"admin1234"}' | head -20

# 测试订阅计划
echo ""
echo "=== 测试 4: 获取订阅计划 ==="
curl -s "$BACKEND_URL/subscription/plans" | head -20

# 测试订单列表
echo ""
echo "=== 测试 5: 获取订单列表 ==="
curl -s "$BACKEND_URL/orders" | head -20

# 测试节点详情
echo ""
echo "=== 测试 6: 获取节点详情 ==="
curl -s "$BACKEND_URL/nodes/1" | head -20

echo ""
echo "测试完成！"
echo "后端 PID: $BACKEND_PID"
echo "日志文件: $LOG_FILE"
echo ""
echo "按 Ctrl+C 停止后端服务"