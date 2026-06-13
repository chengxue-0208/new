#!/usr/bin/env python3
"""
前端API接口验证脚本
对比前端需要的接口和后端提供的接口
"""

import requests
import json
import sys

# 前端需要的API列表
FRONTEND_APIS = {
    'auth': {
        'login': {'method': 'POST', 'path': '/auth/login', 'desc': '用户登录'},
        'register': {'method': 'POST', 'path': '/auth/register', 'desc': '用户注册'},
    },
    'nodes': {
        'list': {'method': 'GET', 'path': '/nodes', 'desc': '获取所有节点'},
        'detail': {'method': 'GET', 'path': '/nodes/{id}', 'desc': '获取节点详情'},
        'by_region': {'method': 'GET', 'path': '/nodes/by-region/{region}', 'desc': '按区域获取节点'},
        'create': {'method': 'POST', 'path': '/nodes', 'desc': '创建节点'},
        'update': {'method': 'PUT', 'path': '/nodes/{id}', 'desc': '更新节点'},
        'delete': {'method': 'DELETE', 'path': '/nodes/{id}', 'desc': '删除节点'},
        'health': {'method': 'GET', 'path': '/nodes/health', 'desc': '节点健康检查'},
    },
    'users': {
        'list': {'method': 'GET', 'path': '/users', 'desc': '用户列表'},
        'detail': {'method': 'GET', 'path': '/users/{id}', 'desc': '用户详情'},
        'update': {'method': 'PUT', 'path': '/users/{id}', 'desc': '更新用户'},
        'delete': {'method': 'DELETE', 'path': '/users/{id}', 'desc': '删除用户'},
    },
    'subscription': {
        'plans': {'method': 'GET', 'path': '/subscription-plans', 'desc': '订阅计划列表'},
        'plan_detail': {'method': 'GET', 'path': '/subscription-plans/{id}', 'desc': '订阅计划详情'},
        'create_plan': {'method': 'POST', 'path': '/subscription-plans', 'desc': '创建订阅计划'},
        'update_plan': {'method': 'PUT', 'path': '/subscription-plans/{id}', 'desc': '更新订阅计划'},
        'delete_plan': {'method': 'DELETE', 'path': '/subscription-plans/{id}', 'desc': '删除订阅计划'},
        'my': {'method': 'GET', 'path': '/subscription/my', 'desc': '我的订阅'},
        'purchase': {'method': 'POST', 'path': '/subscription/purchase', 'desc': '购买订阅'},
    },
    'orders': {
        'list': {'method': 'GET', 'path': '/orders', 'desc': '订单列表'},
        'detail': {'method': 'GET', 'path': '/orders/{id}', 'desc': '订单详情'},
        'update': {'method': 'PUT', 'path': '/orders/{id}', 'desc': '更新订单'},
        'delete': {'method': 'DELETE', 'path': '/orders/{id}', 'desc': '删除订单'},
    },
    'payment': {
        'create': {'method': 'POST', 'path': '/payment/create', 'desc': '创建支付'},
        'verify': {'method': 'GET', 'path': '/payment/verify', 'desc': '验证支付'},
        'alipay_callback': {'method': 'POST', 'path': '/payment/callback/alipay', 'desc': '支付宝回调'},
        'wechat_callback': {'method': 'POST', 'path': '/payment/callback/wechat', 'desc': '微信回调'},
    },
    'vpn': {
        'connect': {'method': 'POST', 'path': '/vpn/connect', 'desc': '连接VPN'},
        'disconnect': {'method': 'POST', 'path': '/vpn/disconnect', 'desc': '断开VPN'},
        'status': {'method': 'GET', 'path': '/vpn/status', 'desc': 'VPN状态'},
        'config': {'method': 'GET', 'path': '/vpn/config', 'desc': 'VPN配置'},
    },
    'vpn_config': {
        'list': {'method': 'GET', 'path': '/vpn-configurations', 'desc': 'VPN配置列表'},
        'create': {'method': 'POST', 'path': '/vpn-configurations', 'desc': '创建VPN配置'},
        'update': {'method': 'PUT', 'path': '/vpn-configurations/{id}', 'desc': '更新VPN配置'},
        'delete': {'method': 'DELETE', 'path': '/vpn-configurations/{id}', 'desc': '删除VPN配置'},
    },
    'dashboard': {
        'stats': {'method': 'GET', 'path': '/dashboard/stats', 'desc': '仪表盘统计'},
    }
}

def check_api(base_url, api_info):
    """检查单个API是否可用"""
    path = api_info['path']
    method = api_info['method']

    try:
        # 替换路径中的占位符
        if '{id}' in path:
            path = path.replace('{id}', 'test-id')
        if '{region}' in path:
            path = path.replace('{region}', 'asia')

        url = f"{base_url}{path}"

        if method == 'GET':
            response = requests.get(url, timeout=5)
        elif method == 'POST':
            response = requests.post(url, json={}, timeout=5)
        elif method == 'PUT':
            response = requests.put(url, json={}, timeout=5)
        elif method == 'DELETE':
            response = requests.delete(url, timeout=5)

        # 检查响应状态码
        if response.status_code < 500:
            return 'available', response.status_code, response.text[:200]
        else:
            return 'error', response.status_code, response.text[:200]

    except requests.exceptions.RequestException as e:
        return 'error', 0, str(e)

def verify_apis():
    """验证所有前端需要的API"""
    base_url = "http://localhost:3000"

    print("=" * 60)
    print("前端API接口验证")
    print("=" * 60)
    print()

    total = 0
    available = 0
    not_found = 0
    error = 0

    for category, apis in FRONTEND_APIS.items():
        print(f"【{category.upper()}】模块:")
        for name, api in apis.items():
            total += 1
            status_code, response_text = check_api(base_url, api)

            status_icon = "✅" if status_code != 404 else "❌"
            if status_code == 404:
                not_found += 1
            elif status_code < 500:
                available += 1
            else:
                error += 1

            print(f"  {status_icon} {method_color(method)} {api['path']} - {api['desc']}")

        print()

    print("=" * 60)
    print(f"总计: {total} 个接口")
    print(f"可用: {available} ({available*100//total}%)")
    print(f"未找到: {not_found}")
    print(f"错误: {error}")
    print("=" * 60)

    return total, available, not_found, error

def method_color(method):
    """根据HTTP方法返回不同颜色"""
    if method == 'GET':
        return 'GET'
    elif method == 'POST':
        return 'POST'
    elif method == 'PUT':
        return 'PUT'
    elif method == 'DELETE':
        return 'DELETE'
    return method

if __name__ == "__main__":
    try:
        verify_apis()
    except KeyboardInterrupt:
        print("\n\n验证已取消")
    except Exception as e:
        print(f"验证过程中发生错误: {e}")