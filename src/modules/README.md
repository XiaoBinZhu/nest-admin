# nest-admin 模块文档索引

## 核心模块

### 认证授权模块
- **[AuthModule](./auth/auth.module.md)** - 用户认证和授权
- **[UserModule](./user/user.module.md)** - 用户管理

### 系统管理模块
- **[SystemModule](./system/system.module.md)** - 系统管理（用户、角色、菜单等）

### 工具模块
- **[ToolsModule](./tools/tools.module.md)** - 工具集合（上传、存储、邮件）
- **[UploadModule](./tools/upload/upload.module.md)** - 文件上传
- **[StorageModule](./tools/storage/storage.module.md)** - 存储管理
- **[EmailModule](./tools/email/email.module.md)** - 邮件发送

### 支付与小程序
- **MiniProgramAuthModule** - 微信/支付宝小程序登录
- **PaymentModule** - 微信/支付宝/云闪付支付

### 业务模块
- **[TasksModule](./tasks/tasks.module.md)** - 定时任务
- **[NetdiskModule](./netdisk/netdisk.module.md)** - 网盘管理
- **[SSEModule](./sse/sse.module.md)** - 服务器发送事件
- **[HealthModule](./health/health.module.md)** - 健康检查
- **[TodoModule](./todo/todo.module.md)** - 待办事项（示例模块）

## 模块分类

### 基础模块
- AuthModule - 认证授权
- UserModule - 用户管理

### 系统模块
- SystemModule - 系统管理
  - 用户管理
  - 角色管理
  - 菜单管理
  - 部门管理
  - 字典管理
  - 参数配置
  - 日志管理
  - 任务管理
  - 在线用户
  - 服务监控

### 工具模块
- ToolsModule - 工具集合
  - UploadModule - 文件上传
  - StorageModule - 存储管理
  - EmailModule - 邮件发送

### 业务模块
- TasksModule - 定时任务
- NetdiskModule - 网盘管理
- SSEModule - 服务器发送事件
- HealthModule - 健康检查
- TodoModule - 待办事项
- PaymentModule - 支付
- MiniProgramAuthModule - 小程序登录

## 快速导航

### 按功能查找

**认证授权**
- [AuthModule](./auth/auth.module.md)
- [UserModule](./user/user.module.md)

**文件管理**
- [UploadModule](./tools/upload/upload.module.md)
- [NetdiskModule](./netdisk/netdisk.module.md)

**系统管理**
- [SystemModule](./system/system.module.md)

**定时任务**
- [TasksModule](./tasks/tasks.module.md)

**实时通信**
- [SSEModule](./sse/sse.module.md)

**监控检查**
- [HealthModule](./health/health.module.md)

## 模块依赖关系

```
AppModule
├── AuthModule
├── UserModule
├── SystemModule
│   ├── UserModule
│   ├── RoleModule
│   ├── MenuModule
│   └── ...
├── ToolsModule
│   ├── UploadModule
│   ├── StorageModule
│   └── EmailModule
├── TasksModule
├── NetdiskModule
├── SSEModule
├── HealthModule
└── TodoModule
```

## 使用指南

1. **查看模块文档**: 点击上方链接查看各模块的详细文档
2. **查看使用示例**: 每个模块文档都包含使用示例
3. **查看配置说明**: 了解如何配置各模块
4. **查看最佳实践**: 了解使用各模块的最佳实践

## 贡献指南

添加新模块时，请：
1. 创建模块文档（.md 文件）
2. 添加使用示例
3. 更新本索引文件
4. 添加必要的注释

---

**最后更新**: 2024-01-XX
