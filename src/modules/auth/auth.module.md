# AuthModule - 认证授权模块

## 概述

AuthModule 是 nest-admin 的核心认证授权模块，提供了完整的用户认证、授权和权限管理功能。

## 功能特性

- ✅ JWT 认证
- ✅ 本地认证（用户名密码）
- ✅ 验证码验证
- ✅ 角色权限控制（RBAC）
- ✅ Token 刷新
- ✅ 登录日志记录
- ✅ 多设备登录控制
- ✅ 支持 I18N 错误消息

## 子模块

### 1. 认证控制器 (AuthController)
- 用户登录
- 用户注册

### 2. 账户控制器 (AccountController)
- 获取用户信息
- 更新用户信息
- 修改密码

### 3. 验证码控制器 (CaptchaController)
- 图形验证码生成
- 验证码校验

### 4. 邮件控制器 (EmailController)
- 发送验证邮件
- 邮件验证

## 路由结构

```
/auth/login          - 用户登录
/auth/register       - 用户注册
/auth/captcha/img    - 获取验证码图片
/auth/profile        - 获取用户信息
/auth/password       - 修改密码
```

## 使用示例

### 用户登录

```bash
# 1. 获取验证码
curl -X GET http://localhost:3000/api/auth/captcha/img

# 响应
{
  "img": "data:image/svg+xml;base64,...",
  "id": "captcha-id-123"
}

# 2. 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "x-custom-lang: zh" \
  -d '{
    "username": "admin",
    "password": "123456",
    "captchaId": "captcha-id-123",
    "verifyCode": "1234"
  }'

# 响应
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 获取用户信息

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

### 修改密码

```bash
curl -X POST http://localhost:3000/api/auth/password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "old123",
    "newPassword": "new123"
  }'
```

## 认证流程

### 1. 登录流程

```
1. 客户端请求验证码
   ↓
2. 用户输入用户名、密码、验证码
   ↓
3. 服务端验证验证码
   ↓
4. 服务端验证用户名密码
   ↓
5. 生成 JWT Token
   ↓
6. 记录登录日志
   ↓
7. 返回 Token
```

### 2. 请求认证流程

```
1. 客户端在请求头中携带 Token
   Authorization: Bearer <token>
   ↓
2. JwtAuthGuard 验证 Token
   ↓
3. RbacGuard 验证权限
   ↓
4. 执行业务逻辑
```

## 权限控制

### 装饰器

#### @Public() - 公开接口
```typescript
@Public()
@Get('public')
getPublic() {
  return '公开接口'
}
```

#### @Perm() - 权限验证
```typescript
@Perm('user:read')
@Get('users')
getUsers() {
  return this.userService.findAll()
}
```

#### @Resource() - 资源权限
```typescript
@Resource('user')
@Get('users')
getUsers() {
  return this.userService.findAll()
}
```

## 配置说明

### JWT 配置

```env
JWT_SECRET=your-secret-key
JWT_EXPIRE=3600
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=604800
```

### 多设备登录

```env
MULTI_DEVICE_LOGIN=true  # 是否允许多设备登录
```

## 安全特性

### 1. 密码加密
- 使用 MD5 + Salt 加密
- Salt 随机生成，每个用户唯一

### 2. Token 管理
- Access Token: 短期有效（默认 1 小时）
- Refresh Token: 长期有效（默认 7 天）
- Token 黑名单机制

### 3. 验证码
- 图形验证码
- 防止暴力破解
- 验证码有效期限制

### 4. 登录限制
- 登录失败次数限制（可配置）
- IP 地址记录
- 设备信息记录

## I18N 支持

所有错误消息都支持多语言：

```bash
# 中文错误消息
curl -H "x-custom-lang: zh" http://localhost:3000/api/auth/login
# 响应: {"message": "用户名或密码错误"}

# 英文错误消息
curl -H "x-custom-lang: en" http://localhost:3000/api/auth/login
# 响应: {"message": "Invalid username or password"}
```

## 错误代码

| 错误代码 | 说明 | I18N Key |
|---------|------|----------|
| 1003 | 用户名或密码错误 | `error.INVALID_USERNAME_PASSWORD` |
| 1017 | 用户不存在 | `error.USER_NOT_FOUND` |
| 1002 | 验证码错误 | `error.INVALID_VERIFICATION_CODE` |
| 1101 | 登录无效 | `error.INVALID_LOGIN` |
| 1105 | 账号在其他地方登录 | `error.ACCOUNT_LOGGED_IN_ELSEWHERE` |

## 最佳实践

1. **Token 存储**: 客户端应安全存储 Token（如 httpOnly cookie）
2. **Token 刷新**: 定期刷新 Token 保持登录状态
3. **错误处理**: 处理 Token 过期和无效的情况
4. **权限验证**: 前端也应进行权限验证（双重验证）

## 相关文档

- [用户模块文档](../user/user.module.md)
- [系统模块文档](../system/system.module.md)
- [I18N 使用指南](../../docs/03-I18N国际化.md)
