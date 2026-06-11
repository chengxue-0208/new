#!/bin/bash

# VPN服务管理后台 - 局域网访问启动脚本

echo "🚀 启动VPN服务管理后台（局域网模式）..."

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
fi

# 检查并启动开发服务器
if ! ss -tuln | grep -q :5173; then
    echo "🖥️  启动开发服务器 (http://0.0.0.0:5173)"
    npm run dev > /tmp/vite-dev.log 2>&1 &
    echo "⏳ 等待服务器启动..."
    sleep 3
fi

# 启动预览服务器
if ! ss -tuln | grep -q :4173; then
    echo "🌐 启动预览服务器 (http://0.0.0.0:4173)"
    npm run preview > /tmp/vite-preview.log 2>&1 &
    echo "⏳ 等待服务器启动..."
    sleep 3
fi

# 显示访问地址
echo ""
echo "✅ VPN服务管理后台已启动！"
echo ""
echo "📱 本地访问:"
echo "   - 开发服务器: http://localhost:5173/"
echo "   - 预览服务器: http://localhost:4173/"
echo ""
echo "🌐 局域网访问 (请将localhost替换为你的局域网IP):"
echo "   - 开发服务器: http://192.168.100.22:5173/"
echo "   - 预览服务器: http://192.168.100.22:4173/"
echo ""
echo "📝 查看日志: tail -f /tmp/vite-dev.log"
echo "🛑 停止服务: ./stop.sh"
echo ""

# 查看实际网络接口IP
echo "🖥️  检测到的网络接口:"
if command -v ip &> /dev/null; then
    ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1
else
    echo "使用 'ip addr' 或 'ifconfig' 查看IP地址"
fi