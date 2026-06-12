# Arch Linux 安装中文字体指南

## 快速安装（推荐）

```bash
# 1. 更新软件包数据库
sudo pacman -Sy

# 2. 运行安装脚本
bash /home/cheng/Project/vpn-service/install-chinese-fonts.sh

# 3. 刷新字体缓存
sudo fc-cache -fv
```

## 手动安装字体包

### 方法1：安装基础中文字体

```bash
sudo pacman -S wqy-zenhei wqy-microhei
```

### 方法2：安装 Google Noto CJK 字体（推荐）

```bash
sudo pacman -S noto-fonts-cjk noto-fonts-extra
```

### 方法3：安装 Adobe 思源字体

```bash
sudo pacman -S adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts
```

### 方法4：安装全部字体（完整版）

```bash
sudo pacman -S \
  wqy-zenhei \
  wqy-microhei \
  noto-fonts-cjk \
  noto-fonts-extra \
  adobe-source-han-sans-cn-fonts \
  adobe-source-han-serif-cn-fonts
```

## 验证安装

```bash
# 查看所有中文字体
fc-list :lang=zh

# 查看 Noto CJK 字体
fc-list | grep -i "noto.*cjk"

# 查看思源字体
fc-list | grep -i "source.*han"
```

## 常用字体说明

### Wqy (文泉驿)
- **wqy-zenhei** - 文泉驿正黑体（无衬线）
- **wqy-microhei** - 文泉驿微米黑（无衬线）
- **wqy-bitmapfont** - 文泉驿位图字体（老旧）

### Noto Fonts (Google)
- **noto-fonts-cjk** - Noto CJK 中文字体（包含简中、繁中、日文、韩文）
- **noto-fonts-extra** - Noto CJK 额外字符集

### Adobe Source Han Sans
- **adobe-source-han-sans-cn-fonts** - 思源黑体（简体中文）
- **adobe-source-han-serif-cn-fonts** - 思源宋体（简体中文）

## 浏览器设置

### Chrome / Edge

1. 打开设置
2. 搜索 "字体"
3. 在 "网页字体" 中选择中文字体（推荐：Noto Sans CJK SC）

### Firefox

1. 打开设置
2. 搜索 "字体"
3. 在 "默认字体" 中选择中文字体（推荐：Noto Sans CJK SC）

### 清除浏览器缓存

```bash
# Chrome/Edge
Ctrl+Shift+Delete -> 清除缓存和Cookie

# Firefox
Ctrl+Shift+Delete -> 清除缓存
```

## 常见问题

### 1. 安装后不显示中文

```bash
# 刷新系统字体缓存
sudo fc-cache -fv

# 重启浏览器
```

### 2. 某些应用不显示中文字体

```bash
# 安装 Fcitx 输入法（如果需要中文输入）
sudo pacman -S fcitx-im

# 或安装 IBus 输入法
sudo pacman -S ibus libibus
```

### 3. 需要更多字体

```bash
# 安装完整的 Noto 字体集
sudo pacman -S noto-fonts

# 安装 Fira Code（如果是开发者）
sudo pacman -S fira-code
```

## 推荐的字体组合

### 无衬线字体（推荐）
1. Noto Sans CJK SC (首选)
2. Wqy-zenhei
3. Adobe Source Han Sans CN

### 衬线字体
1. Noto Serif CJK SC
2. Wqy-microhei
3. Adobe Source Han Serif CN

## 参考资源

- [Arch Linux Wiki - Fonts](https://wiki.archlinux.org/title/Fonts)
- [Google Noto Fonts](https://fonts.google.com/noto)
- [文泉驿字体介绍](https://zh.wikipedia.org/wiki/%E6%96%87%E6%B3%89%E9%A8%8B)