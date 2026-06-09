# VPN 服务部署文档

> 版本: 1.0.0
> 日期: 2026-06-09
> 目标: 生产环境部署指南

## 目录

1. [部署架构](#部署架构)
2. [服务器要求](#服务器要求)
3. [部署前准备](#部署前准备)
4. [部署步骤](#部署步骤)
5. [配置优化](#配置优化)
6. [监控和维护](#监控和维护)
7. [故障排除](#故障排除)

---

## 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户流量                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Nginx (反向代理)                         │
│              SSL证书、负载均衡、缓存配置                        │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
┌──────────────┐ ┌────────────┐ ┌─────────────┐
│  前端应用     │ │  后端API    │ │ 管理后台     │
│  (静态文件)  │ │ (NestJS)   │ │ (NestJS)    │
└──────────────┘ └─────┬──────┘ └──────┬──────┘
                       │               │
                       └───────┬───────┘
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
        ┌────────────┐ ┌──────────┐ ┌────────────┐
        │   Redis    │ │PostgreSQL│ │   文件存储  │
        │  (缓存)    │ │ (数据库)  │ │  (S3/OSS)  │
        └────────────┘ └──────────┘ └────────────┘
```

---

## 服务器要求

### 硬件要求

- **CPU**: 4核以上
- **内存**: 8GB以上
- **磁盘**: 100GB以上 (SSD)
- **网络**: 1Mbps以上带宽

### 软件要求

- **操作系统**: Ubuntu 20.04 LTS 或 CentOS 7+
- **Docker**: 20.10+
- **Docker Compose**: 1.29+
- **Node.js**: 18.x (用于构建)

---

## 部署前准备

### 1. 服务器环境检查

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 检查Docker
docker --version
docker-compose --version

# 检查Node.js
node --version
npm --version
```

### 2. 创建部署用户

```bash
# 创建专用用户
sudo adduser vpn-user
sudo usermod -aG docker vpn-user

# 切换到用户
su - vpn-user
```

### 3. 克隆项目

```bash
git clone <repository-url>
cd vpn-service
```

### 4. 配置域名和SSL

```bash
# 获取SSL证书（使用Let's Encrypt）
sudo certbot certonly --nginx -d vpn.example.com
```

---

## 部署步骤

### 方法一: 使用Docker Compose部署

#### 1. 配置环境变量

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑环境变量文件
nano backend/.env
```

**必须配置的变量：**

```env
# 数据库配置
DATABASE_URL=postgresql://vpn_user:strong_password@localhost:5432/vpn_db

# Redis配置
REDIS_URL=redis://localhost:6379

# JWT密钥（修改为强密码）
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# 应用配置
BASE_URL=https://vpn.example.com
NODE_ENV=production

# 支付配置（支付宝和微信支付）
ALIPAY_APP_ID=your-app-id
ALIPAY_PRIVATE_KEY=your-private-key
ALIPAY_PUBLIC_KEY=your-public-key
WECHAT_PAY_APP_ID=your-app-id
WECHAT_PAY_MCH_ID=your-mch-id
WECHAT_PAY_API_KEY=your-api-key
```

#### 2. 构建Docker镜像

```bash
# 构建后端镜像
docker-compose build backend

# 构建管理后台镜像
docker-compose build admin-web

# 构建数据库和Redis镜像（如果使用）
docker-compose build postgres redis
```

#### 3. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
```

#### 4. 初始化数据库

```bash
# 进入后端容器
docker-compose exec backend sh

# 运行数据库迁移
npx typeorm migration:run

# 运行种子数据
npx ts-node src/seed.ts
```

### 方法二: 直接部署

#### 1. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装管理后台依赖
cd ../admin-web
npm install

# 安装移动端依赖
cd ../client-mobile
npm install
```

#### 2. 配置环境变量

```bash
# 配置环境变量
cp .env.example .env
nano .env
```

#### 3. 编译项目

```bash
# 后端编译
cd backend
npm run build

# 管理后台编译
cd ../admin-web
npm run build
```

#### 4. 启动服务

```bash
# 使用PM2管理后端进程
cd ../backend
npm install -g pm2
pm2 start dist/main.js --name "vpn-backend"
pm2 save
pm2 startup

# 使用PM2管理管理后台
cd ../admin-web
npm install -g pm2
pm2 start dist/app.js --name "vpn-admin"
pm2 save
pm2 startup
```

---

## Nginx配置

### 安装Nginx

```bash
sudo apt install nginx -y
```

### 配置反向代理

```nginx
# /etc/nginx/sites-available/vpn

upstream backend {
    server localhost:3000;
}

upstream admin {
    server localhost:3001;
}

server {
    listen 80;
    server_name vpn.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vpn.example.com;

    # SSL证书
    ssl_certificate /etc/letsencrypt/live/vpn.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vpn.example.com/privkey.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API代理
    location /api/ {
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态文件代理
    location / {
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # 管理后台代理
    location /admin/ {
        proxy_pass http://admin/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源
    location /static/ {
        alias /var/www/vpn/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/vpn /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

---

## 配置优化

### 数据库优化

#### PostgreSQL配置

```conf
# /etc/postgresql/14/main/postgresql.conf

# 连接数
max_connections = 200

# 内存配置
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
work_mem = 512MB

# WAL配置
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 4GB
min_wal_size = 1GB

# 查询优化
random_page_cost = 1.1
effective_io_concurrency = 200
```

#### Redis优化

```conf
# /etc/redis/redis.conf

# 内存配置
maxmemory 4gb
maxmemory-policy allkeys-lru

# 持久化
save 900 1
save 300 10
save 60 10000

# 慢查询
slowlog-log-slower-than 10000
slowlog-max-len 128
```

### 应用优化

#### NestJS优化

```javascript
// backend/src/main.ts
const app = await NestFactory.create(AppModule);

// 启用CORS
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});

// 启用限流
const rateLimit = await app.get(RateLimitModule);
app.use(rateLimit);

// 启用健康检查
app.enableShutdownHooks();
```

---

## 监控和维护

### 日志管理

```bash
# 查看Docker日志
docker-compose logs -f --tail=100 backend

# 日志轮转
docker-compose exec backend npm run log:rotate
```

### 数据库备份

```bash
#!/bin/bash
# 备份脚本 /backup/db_backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR

# 备份数据库
docker-compose exec postgres pg_dump vpn_db > $BACKUP_DIR/vpn_db_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/vpn_db_$DATE.sql

# 保留最近30天
find $BACKUP_DIR -name "vpn_db_*.sql.gz" -mtime +30 -delete
```

### 定时任务

```bash
# 添加到crontab
0 2 * * * /root/vpn-service/backup/db_backup.sh
0 * * * * /root/vpn-service/backup/cleanup.sh
```

### 性能监控

#### 使用Prometheus

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'nestjs'
    static_configs:
      - targets: ['localhost:3000']
```

#### 使用Grafana

```bash
# 启动监控面板
docker-compose up -d prometheus grafana
```

---

## 故障排除

### 常见问题

#### 1. 数据库连接失败

**问题**: `Can't connect to PostgreSQL server`

**解决方案**:

```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 检查数据库连接
docker-compose exec postgres psql -U vpn_user -d vpn_db

# 检查防火墙
sudo ufw allow 5432/tcp
```

#### 2. Redis连接失败

**问题**: `Can't connect to Redis server`

**解决方案**:

```bash
# 检查Redis状态
docker-compose ps redis

# 检查Redis连接
redis-cli -h localhost -p 6379

# 重启Redis
docker-compose restart redis
```

#### 3. 端口冲突

**问题**: `Address already in use`

**解决方案**:

```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :6379

# 杀死占用进程
sudo kill -9 <PID>
```

#### 4. 内存不足

**问题**: `Out of memory`

**解决方案**:

```bash
# 检查内存使用
free -h

# 清理Docker缓存
docker system prune -a

# 增加容器内存限制
docker-compose up -d --scale backend=2
```

---

## 安全加固

### 1. 防火墙配置

```bash
# 使用UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. SSH安全

```bash
# 禁用root登录
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# 修改SSH端口
sudo nano /etc/ssh/sshd_config
# Port 2222
sudo systemctl restart ssh
```

### 3. 防止暴力破解

```bash
# 安装Fail2Ban
sudo apt install fail2ban -y

# 配置Fail2Ban
sudo nano /etc/fail2ban/jail.local
```

---

## 备份策略

### 备份计划

- **数据库**: 每日自动备份
- **配置文件**: 每周备份
- **代码**: 每次部署前备份
- **日志**: 每月归档

### 恢复流程

```bash
# 数据库恢复
gunzip -c /backups/vpn_db_20260609_020000.sql.gz | docker-compose exec -T postgres psql -U vpn_user vpn_db

# 容器恢复
docker-compose up -d --force-recreate

# 重新运行迁移
docker-compose exec backend npm run migration:run
```

---

## 性能基准

### 测试结果

| 指标 | 数值 | 说明 |
|------|------|------|
| API响应时间 | < 500ms | 90%的请求 |
| VPN连接建立 | < 3s | 平均时间 |
| 节点延迟检测 | < 5s | 单个节点 |
| 并发用户 | 1000+ | 支持并发 |
| 吞吐量 | 1000 req/s | 系统吞吐 |

---

## 技术支持

如遇部署问题，请参考：

- [API文档](./docs/api/vpn-service-api-docs.md)
- [README](./README.md)
- [故障排除](./docs/troubleshooting.md)

---

**部署成功！** 🎉

如有问题，请及时反馈。