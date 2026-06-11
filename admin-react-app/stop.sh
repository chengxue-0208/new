#!/bin/bash

# VPN服务管理后台 - 停止脚本

echo "🛑 停止VPN服务管理后台..."

# 停止Vite进程
pkill -f "vite.*admin-react-app"

# 等待进程关闭
sleep 2

# 清理临时日志文件
if [ -f /tmp/vite-dev.log ]; then
    rm /tmp/vite-dev.log
fi

if [ -f /tmp/vite-preview.log ]; then
    rm /tmp/vite-preview.log
fi

echo "✅ 服务已停止"