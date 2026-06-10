#!/bin/bash

# VPN Service API 实际测试脚本
# 基础URL: http://localhost:3000

BASE_URL="http://localhost:3000"
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

    if [ "$http_code" = "200" ]; then
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
echo "  VPN Service API 实际测试"
echo "========================================"
echo ""

# 1. 测试根路径
echo "========================================"
echo "  1. 根路径测试"
echo "========================================"
echo ""

test_api "获取根路径" "GET" "/" "" "" "200" ""

echo ""

# 2. 测试认证接口
echo "========================================"
echo "  2. 认证接口测试"
echo "========================================"
echo ""

# 测试注册新用户
test_api "用户注册" "POST" "/auth/register" "" '{"email":"test@example.com","password":"Test123456"}' "201" ""

# 测试登录
get_token "test@example.com" "Test123456"

if [ -n "$TOKEN" ]; then
    echo ""

    # 3. 测试节点接口
    echo "========================================"
    echo "  3. 节点接口测试"
    echo "========================================"
    echo ""

    # 测试获取节点列表
    test_api "获取节点列表" "GET" "/nodes" "" "" "200" ""

    # 测试获取单个节点
    test_api "获取单个节点信息" "GET" "/nodes/test-node-id" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试节点延迟检测
    test_api "测试节点延迟" "GET" "/node/delay/test-node-id" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    echo ""

    # 4. 测试 VPN 接口
    echo "========================================"
    echo "  4. VPN 接口测试"
    echo "========================================"
    echo ""

    # 测试建立 VPN 连接
    test_api "建立VPN连接" "POST" "/vpn/connect" "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\"" '{"nodeId":"test-node-id"}' "201" ""

    # 测试断开 VPN 连接
    test_api "断开VPN连接" "POST" "/vpn/disconnect" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试 VPN 状态
    test_api "获取VPN状态" "GET" "/vpn/status" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试 VPN 配置
    test_api "获取VPN配置" "GET" "/vpn/config" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    echo ""

    # 5. 测试订阅接口
    echo "========================================"
    echo "  5. 订阅接口测试"
    echo "========================================"
    echo ""

    # 测试订阅套餐列表
    test_api "获取订阅套餐列表" "GET" "/subscription/plans" "" "" "200" ""

    # 测试我的订阅
    test_api "获取我的订阅" "GET" "/subscription/my" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试购买订阅
    test_api "购买订阅" "POST" "/subscription/purchase" "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\"" '{"planId":"test-plan-id","paymentMethod":"alipay"}' "201" ""

    echo ""

    # 6. 测试订单接口
    echo "========================================"
    echo "  6. 订单接口测试"
    echo "========================================"
    echo ""

    # 测试订单列表
    test_api "获取订单列表" "GET" "/orders" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    # 测试订单详情
    test_api "获取订单详情" "GET" "/orders/test-order-id" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    echo ""

    # 7. 测试支付接口
    echo "========================================"
    echo "  7. 支付接口测试"
    echo "========================================"
    echo ""

    # 测试创建支付
    test_api "创建支付订单" "POST" "/payment/create" "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\"" '{"planId":"test-plan-id","paymentMethod":"alipay"}' "201" ""

    # 测试支付宝回调
    test_api "支付宝回调" "POST" "/payment/callback/alipay" "-H \"Content-Type: application/x-www-form-urlencoded\"" "status=success" "200" ""

    # 测试微信支付回调
    test_api "微信支付回调" "POST" "/payment/callback/wechat" "-H \"Content-Type: application/xml\"" "<xml>data</xml>" "200" ""

    # 测试验证支付
    test_api "验证支付结果" "GET" "/payment/verify" "" "" "200" ""

    echo ""

    # 8. 测试错误处理
    echo "========================================"
    echo "  8. 错误处理测试"
    echo "========================================"
    echo ""

    # 测试未授权访问
    test_api "未授权访问" "GET" "/user/profile" "" "" "401" ""

    # 测试无效的 token
    test_api "无效 token" "GET" "/vpn/connect" "-H \"Authorization: Bearer invalid-token\"" "" "401" ""

    echo ""

    # 9. 测试重复注册
    echo "========================================"
    echo "  9. 错误情况测试"
    echo "========================================"
    echo ""

    # 测试重复注册
    test_api "重复注册" "POST" "/auth/register" "" '{"email":"test@example.com","password":"Test123456"}' "403" ""

    # 测试错误登录
    test_api "错误登录" "POST" "/auth/login" "-H \"Content-Type: application/json\"" '{"email":"test@example.com","password":"WrongPassword"}' "401" ""

    echo ""

    # 10. 测试分页接口（如果存在）
    echo "========================================"
    echo "  10. 分页接口测试"
    echo "========================================"
    echo ""

    # 测试带分页的订单列表
    test_api "分页获取订单列表" "GET" "/orders?page=1&limit=20" "-H \"Authorization: Bearer $TOKEN\"" "" "200" ""

    echo ""

    # 11. 测试节点延迟统计
    echo "========================================"
    echo "  11. 节点延迟统计测试"
    echo "========================================"
    echo ""

    # 测试批量更新节点延迟
    test_api "批量更新节点延迟" "POST" "/node/delay/update" "" "" "200" ""

    # 测试延迟统计
    test_api "获取延迟统计" "GET" "/node/delay/stats" "" "" "200" ""

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
else
    echo -e "${RED}无法获取 token，跳过需要认证的测试${NC}\n"

    echo ""
    echo "========================================"
    echo "  测试总结（无 token）"
    echo "========================================"
    echo -e "通过: ${GREEN}$PASSED${NC}"
    echo -e "失败: ${RED}$FAILED${NC}"
    echo -e "跳过: ${YELLOW}$SKIPPED${NC}"
    echo "========================================"

    exit 0
fi