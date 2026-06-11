# VPN服务管理后台 - 启动指南

## 🚀 快速启动

### 方法1：使用启动脚本（推荐）

```bash
./start.sh
```

### 方法2：手动启动

```bash
# 安装依赖（首次运行）
npm install

# 开发服务器（支持局域网）
npm run dev

# 预览服务器（构建后版本）
npm run preview
```

## 🌐 访问地址

### 本地访问
- 开发服务器：http://localhost:5173/
- 预览服务器：http://localhost:4173/

### 局域网访问
确保在同一WiFi或网络下，访问以下地址：

```
http://192.168.100.22:5173/   (开发服务器)
http://192.168.100.22:4173/   (预览服务器)
```

如果无法访问，请检查你的实际IP地址：

```bash
ip addr show | grep "inet (192\.168|172\.|10\.)" | grep -v 127.0.0.1
```

## 🔧 端口说明

- **5173** - Vite开发服务器（支持热更新）
- **4173** - Vite预览服务器（构建后的静态文件）

## 📋 常用命令

```bash
# 启动服务
./start.sh

# 停止服务
./stop.sh

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 运行测试
npm test
```

## 🔥 防火墙配置

如果局域网内其他设备无法访问，请检查防火墙设置：

### Ubuntu/Debian
```bash
sudo ufw allow 5173/tcp
sudo ufw allow 4173/tcp
```

### CentOS/RHEL
```bash
sudo firewall-cmd --permanent --add-port=5173/tcp
sudo firewall-cmd --permanent --add-port=4173/tcp
sudo firewall-cmd --reload
```

### macOS
```bash
sudo pfctl -e -f /etc/pf.conf
```

添加以下规则到pf.conf：
```
pass in inet proto tcp from any to any port 5173
pass in inet proto tcp from any to any port 4173
```

## 📝 配置说明

### 环境变量
创建 `.env` 文件来配置API基础URL：

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

### Vite配置
`vite.config.ts` 中已配置局域网访问：
```typescript
server: {
  host: '0.0.0.0',  // 允许所有网络接口访问
  port: 5173,
  strictPort: false
}
```

## 🐛 常见问题

### 1. 局域网访问超时
- 检查防火墙设置
- 确认设备在同一网络
- 尝试刷新页面或重启服务

### 2. 热更新不生效
- 确保使用开发服务器 (`npm run dev`)
- 清除浏览器缓存
- 检查控制台是否有错误

### 3. API请求失败
- 检查 `VITE_API_BASE_URL` 配置
- 确保后端API服务已启动
- 检查CORS设置

## 🎉 完成！

现在你可以通过局域网访问VPN服务管理后台了！

如有问题，请查看控制台输出或运行 `./stop.sh` 重新启动。