#!/bin/bash

# VPN Service API 测试脚本
# 基础URL: http://localhost:3000/api

BASE_URL="http://localhost:3000/api"
PASSED=0
FAILED=0
SKIPPED=0

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试函数
test_api() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local headers="$4"
    local body="$5"
    local expected_status="$6"
    local expected_content="$7"

    echo -e "${BLUE}测试: $test_name${NC}"
    echo "请求: $method $endpoint"

    if [ -n "$body" ]; then
        echo "请求体: $body"
    fi

    response=$(curl -s -w "\n%{http_code}" -X "$method" \
        -H "Content-Type: application/json" \
        $headers \
        "$BASE_URL$endpoint" \
        -d "$body" 2>/dev/null)

    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')

    echo "响应状态码: $http_code"
    echo "响应内容: $response_body"

    # 检查状态码
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ 通过${NC}\n"
        ((PASSED++))
    else
        echo -e "${RED}✗ 失败 (期望状态码: $expected_status)${NC}\n"
        ((FAILED++))
    fi
}

# 获取 token（用于需要认证的接口）
get_token() {
    local email="$1"
    local password="$2"

    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
        "$BASE_URL/auth/login")

    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "201" ]; then
        token=$(echo "$response_body" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$token" ]; then
            export TOKEN="$token"
            echo "获取到 token: ${token:0:20}..."
            return 0
        fi
    fi

    return 1
}

# 主测试
echo "========================================"
echo "  VPN Service API 测试"
echo "========================================"
echo ""

# 1. 测试公共接口（不需要认证）
echo "========================================"
echo "  1. 公共接口测试（不需要认证）"
echo "========================================"
echo ""

# 测试节点列表
test_api "获取节点列表" "GET" "/nodes" "" "" "200" ""

# 测试节点延迟统计
test_api "获取节点延迟统计" "GET" "/node/delay/stats" "" "" "200" ""

# 测试健康检查（如果存在）
test_api "系统健康检查" "GET" "/health" "" "" "200" ""

echo ""

# 2. 测试认证接口
echo "========================================"
echo "  2. 认证接口测试"
echo "========================================"
echo ""

# 注册新用户
test_api "用户注册" "POST" "/auth/register" "" '{"email":"test@example.com","password":"Test123456"}' "201" ""

# 登录
get_token "test@example.com" "Test123456"

if [ -n "$TOKEN" ]; then
    echo ""

    # 3. 测试需要认证的接口
    echo "========================================"
    echo "  3. 业务接口测试（需要认证）"
    echo "========================================"
    echo ""

    # 测试用户信息
    test_api "获取用户信息" "GET" "/user/profile" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试流量统计
    test_api "获取流量统计" "GET" "/user/traffic" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试订阅套餐列表
    test_api "获取订阅套餐列表" "GET" "/subscription/plans" "" "" "200" ""

    # 测试我的订阅
    test_api "获取我的订阅" "GET" "/subscription/my" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试购买订阅
    test_api "购买订阅" "POST" "/subscription/purchase" "-H \"Authorization: Bearer $TOKEN\"" '{"planId":"test-plan-id","paymentMethod":"alipay"}' "201" ""

    # 测试订单列表
    test_api "获取订单列表" "GET" "/orders" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    echo ""

    # 4. 测试管理接口
    echo "========================================"
    echo "  4. 管理接口测试（需要认证）"
    echo "========================================"
    echo ""

    # 测试统计数据
    test_api "获取统计数据" "GET" "/admin/stats" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    echo ""

    # 5. 测试 VPN 接口
    echo "========================================"
    echo "  5. VPN 接口测试"
    echo "========================================"
    echo ""

    # 测试 VPN 连接
    test_api "建立VPN连接" "POST" "/vpn/connect" "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\"" '{"nodeId":"test-node-id"}' "201" ""

    # 测试 VPN 配置
    test_api "获取VPN配置" "GET" "/vpn/config" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    echo ""

    # 6. 测试支付接口
    echo "========================================"
    echo "  6. 支付接口测试"
    echo "========================================"
    echo ""

    # 测试创建支付
    test_api "创建支付订单" "POST" "/payment/create" "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\"" '{"planId":"test-plan-id","paymentMethod":"alipay"}' "201" ""

    echo ""
fi

# 7. 测试错误情况
echo "========================================"
echo "  7. 错误处理测试"
echo "========================================"
echo ""

# 测试未授权访问
test_api "未授权访问" "GET" "/user/profile" "" "" "401" ""

# 测试无效的 token
test_api "无效 token" "GET" "/user/profile" "-H \"Authorization: Bearer invalid-token\"" "" "401" ""

echo ""

# 8. 测试分页接口
echo "========================================"
echo "  8. 分页接口测试"
echo "========================================"
echo ""

# 测试带分页的订单列表
test_api "分页获取订单列表" "GET" "/orders?page=1&limit=20" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

# 测试带分页的用户列表
test_api "分页获取用户列表" "GET" "/admin/users?page=1&limit=20" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

echo ""

# 9. 测试节点延迟检测
echo "========================================"
echo "  9. 节点延迟检测测试"
echo "========================================"
echo ""

# 测试单个节点延迟
test_api "测试单个节点延迟" "GET" "/node/delay/test-node-id" "" "" "200" ""

# 测试批量更新节点延迟
test_api "批量更新节点延迟" "POST" "/node/delay/update" "" "" "200" ""

echo ""

# 测试总结
echo "========================================"
echo "  测试总结"
echo "========================================"
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo -e "跳过: ${YELLOW}$SKIPPED${NC}"
echo "========================================"

# 退出码
if [ $FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi