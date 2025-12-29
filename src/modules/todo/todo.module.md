# TodoModule - 待办事项模块

## 概述

TodoModule 提供了待办事项管理功能，这是一个示例业务模块，展示了如何创建标准的 CRUD 模块。

## 功能特性

- ✅ 待办事项 CRUD
- ✅ 待办状态管理
- ✅ 待办分类
- ✅ 用户关联

## 使用示例

### 创建待办

```bash
curl -X POST http://localhost:3000/api/todo \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成项目文档",
    "description": "编写项目使用文档",
    "status": "pending",
    "priority": "high"
  }'
```

### 获取待办列表

```bash
curl -X GET "http://localhost:3000/api/todo?page=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

### 更新待办

```bash
curl -X PATCH http://localhost:3000/api/todo/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### 删除待办

```bash
curl -X DELETE http://localhost:3000/api/todo/1 \
  -H "Authorization: Bearer <token>"
```

## 数据模型

### Todo 实体

```typescript
{
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  userId: number
  createdAt: Date
  updatedAt: Date
}
```

## 状态管理

### 待办状态

- **pending**: 待处理
- **in_progress**: 进行中
- **completed**: 已完成

### 优先级

- **low**: 低优先级
- **medium**: 中优先级
- **high**: 高优先级

## 权限控制

所有待办操作都需要：
1. JWT 认证
2. 用户只能操作自己的待办事项

## 扩展建议

这个模块可以作为创建新业务模块的模板：

1. **复制模块结构**: 复制 todo 模块作为新模块的基础
2. **修改实体定义**: 根据业务需求修改实体
3. **实现业务逻辑**: 在 Service 中实现业务逻辑
4. **添加权限控制**: 根据需要添加权限验证

## 相关文档

- [NestJS CRUD 最佳实践](https://docs.nestjs.com/)
