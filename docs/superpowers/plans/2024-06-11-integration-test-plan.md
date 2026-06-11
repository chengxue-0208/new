# VPN服务 - Admin Panel 集成测试计划

## 测试环境
- **PostgreSQL**: 运行中 (端口5432)
- **Redis**: 运行中 (端口6379)
- **数据库**: vpn_db
- **用户认证**: admin/admin1234

## 测试模块

### Module 1: 用户管理 (Users)
- [ ] GET /api/users - 获取所有用户
- [ ] GET /api/users/:id - 获取单个用户
- [ ] GET /api/users/search/:keyword - 搜索用户
- [ ] GET /api/users/:id/subscription-status - 用户订阅状态
- [ ] GET /api/users/:id/balance - 用户余额
- [ ] GET /api/users/:id/usage - 用户使用情况
- [ ] PUT /api/users/:id - 更新用户
- [ ] DELETE /api/users/:id - 删除用户

### Module 2: 节点管理 (Nodes)
- [ ] GET /api/nodes - 获取所有节点
- [ ] GET /api/nodes/:id - 获取单个节点
- [ ] GET /api/nodes/by-region/:region - 按区域获取节点
- [ ] GET /api/nodes/health - 健康检查
- [ ] PUT /api/nodes/:id - 更新节点
- [ ] DELETE /api/nodes/:id - 删除节点

### Module 3: 订阅和订单管理 (Subscriptions & Orders)
- [ ] GET /api/subscription-plans - 获取所有订阅计划
- [ ] GET /api/subscription-plans/:id - 获取单个计划
- [ ] PUT /api/subscription-plans/:id - 更新计划
- [ ] DELETE /api/subscription-plans/:id - 删除计划
- [ ] GET /api/orders - 获取所有订单
- [ ] GET /api/orders/:id - 获取单个订单
- [ ] GET /api/orders/user/:userId - 用户订单
- [ ] GET /api/orders/status/:status - 订单状态
- [ ] PUT /api/orders/:id - 更新订单
- [ ] DELETE /api/orders/:id - 删除订单

### Module 4: 连接和系统管理 (Connections & System)
- [ ] GET /api/vpn-configurations - 获取所有VPN配置
- [ ] GET /api/vpn-configurations/:id - 获取单个配置
- [ ] PUT /api/vpn-configurations/:id - 更新配置
- [ ] DELETE /api/vpn-configurations/:id - 删除配置
- [ ] GET /api/user-connections - 获取所有连接日志
- [ ] GET /api/user-connections/:userId - 用户连接日志
- [ ] GET /api/user-connections/:nodeId - 节点连接日志
- [ ] GET /api/system-logs - 获取系统日志
- [ ] GET /api/system-logs/user/:userId - 用户日志
- [ ] GET /api/system-logs/level/:level - 级别日志
- [ ] GET /api/system-logs/source/:source - 源日志
- [ ] GET /api/system-logs/search?message=xxx - 搜索日志
- [ ] GET /api/system-logs/stats - 日志统计
- [ ] DELETE /api/system-logs - 清理旧日志
- [ ] GET /api/user-subscriptions - 获取用户订阅
- [ ] GET /api/user-subscriptions/:id - 获取单个订阅
- [ ] GET /api/user-subscriptions/user/:userId - 用户订阅
- [ ] PUT /api/user-subscriptions/:id - 更新订阅
- [ ] DELETE /api/user-subscriptions/:id - 删除订阅

## 前端测试
- [ ] 启动前端应用
- [ ] 用户管理页面 - 列表、搜索、编辑、删除
- [ ] 节点管理页面 - 列表、健康检查、编辑、删除
- [ ] 订阅管理页面 - 计划CRUD、订单管理
- [ ] VPN配置页面 - 配置CRUD、预览
- [ ] 日志页面 - 连接日志、系统日志

## 预期结果
- 所有API端点返回正确的数据格式
- 前端页面正常加载和交互
- 数据库查询返回预期的结果
- 错误处理正常工作

## 测试方法
1. 使用Postman或curl测试API端点
2. 在浏览器中测试前端页面
3. 验证数据库数据正确性
4. 检查日志输出