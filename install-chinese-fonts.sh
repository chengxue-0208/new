#!/bin/bash
# Arch Linux 中文字体安装脚本
# 请使用 sudo 运行此脚本

echo "=== 安装中文字体 ==="
echo ""

# 安装常用的中文字体
echo "正在安装中文字体包..."

# 文泉驿字体（经典中文字体）
sudo pacman -S wqy-zenhei wqy-microhei

# Google Noto CJK 字体（现代、清晰的字体）
sudo pacman -S noto-fonts-cjk noto-fonts-extra

# 思源字体（Adobe开源）
sudo pacman -S adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts

# 清理包缓存（不需要 --yes 参数）
sudo pacman -Sc

echo ""
echo "=== 安装完成 ==="
echo ""
echo "已安装的字体："
echo "- Wqy-zenhei (文泉驿正黑体)"
echo "- Wqy-microhei (文泉驿微米黑)"
echo "- Noto Sans CJK (Google Noto 中文字体)"
echo "- Noto Sans CJK Extra (Google Noto 额外字符集)"
echo "- Adobe Source Han Sans CN (思源黑体)"
echo "- Adobe Source Han Serif CN (思源宋体)"
echo ""
echo "安装后需要刷新字体缓存："
echo "sudo fc-cache -fv"