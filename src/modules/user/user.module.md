# UserModule - 用户模块

## 概述

UserModule 提供了用户管理功能，包括用户信息管理、密码修改、用户状态管理等。

## 功能特性

- ✅ 用户信息管理
- ✅ 密码修改
- ✅ 用户状态管理
- ✅ 用户查询
- ✅ 用户注册

## 使用示例

### 获取用户信息

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <token>"
```

### 更新用户信息

```bash
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "新昵称",
    "email": "newemail@example.com"
  }'
```

### 修改密码

```bash
curl -X POST http://localhost:3000/api/user/password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "old123",
    "newPassword": "new123"
  }'
```

### 用户注册

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "user@example.com"
  }'
```

## 数据模型

### User 实体

```typescript
{
  id: number
  username: string
  password: string
  nickname?: string
  email?: string
  avatar?: string
  status: 'active' | 'inactive' | 'banned'
  deptId?: number
  roleIds: number[]
  createdAt: Date
  updatedAt: Date
}
```

## 用户状态

- **active**: 活跃
- **inactive**: 未激活
- **banned**: 已禁用

## 权限控制

- **查看个人信息**: 需要登录
- **修改个人信息**: 只能修改自己的信息
- **修改密码**: 需要提供旧密码
- **用户注册**: 公开接口（可配置）

## 安全注意事项

1. **密码加密**: 密码使用 MD5 + Salt 加密存储
2. **密码强度**: 建议实现密码强度验证
3. **敏感信息**: 返回数据时排除密码字段
4. **登录限制**: 建议实现登录失败次数限制

## 相关文档

- [认证模块文档](../auth/auth.module.md)
- [系统模块文档](../system/system.module.md)
