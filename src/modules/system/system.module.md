# SystemModule - 系统管理模块

## 概述

SystemModule 是 nest-admin 的核心系统管理模块，提供了完整的后台管理系统功能。

## 功能模块

### 1. 用户管理 (UserModule)
- 用户 CRUD 操作
- 用户信息管理
- 用户状态管理

### 2. 角色管理 (RoleModule)
- 角色 CRUD 操作
- 角色权限分配
- 角色用户关联

### 3. 菜单管理 (MenuModule)
- 菜单 CRUD 操作
- 菜单树结构管理
- 菜单权限配置

### 4. 部门管理 (DeptModule)
- 部门 CRUD 操作
- 部门树结构管理
- 部门用户关联

### 5. 字典管理
- **字典类型** (DictTypeModule): 字典类型管理
- **字典项** (DictItemModule): 字典项管理

### 6. 参数配置 (ParamConfigModule)
- 系统参数配置
- 参数键值对管理

### 7. 日志管理 (LogModule)
- 登录日志
- 验证码日志
- 任务日志

### 8. 任务管理 (TaskModule)
- 定时任务管理
- 任务执行记录
- 任务状态监控

### 9. 在线用户 (OnlineModule)
- 在线用户列表
- 用户会话管理
- 强制下线功能

### 10. 服务监控 (ServeModule)
- 服务器信息监控
- 系统资源监控

## 路由结构

所有系统模块的路由都挂载在 `/system` 路径下：

```
/system/users      - 用户管理
/system/roles      - 角色管理
/system/menus      - 菜单管理
/system/depts      - 部门管理
/system/dict-types - 字典类型
/system/dict-items - 字典项
/system/params     - 参数配置
/system/logs       - 日志管理
/system/tasks      - 任务管理
/system/online     - 在线用户
/system/serve      - 服务监控
```

## 使用示例

### 导入模块

```typescript
import { SystemModule } from './modules/system/system.module'

@Module({
  imports: [SystemModule],
})
export class AppModule {}
```

### 在控制器中使用

```typescript
import { Controller, Get } from '@nestjs/common'
import { UserService } from '~/modules/system/user/user.service'

@Controller('api')
export class ApiController {
  constructor(private userService: UserService) {}

  @Get('users')
  async getUsers() {
    return this.userService.findAll()
  }
}
```

## 权限控制

所有系统模块的接口都需要：
1. JWT 认证（通过 `JwtAuthGuard`）
2. RBAC 权限验证（通过 `RbacGuard`）

## 相关文档

- [用户管理文档](./user/user.module.md)
- [角色管理文档](./role/role.module.md)
- [菜单管理文档](./menu/menu.module.md)
