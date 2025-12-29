# HealthModule - 健康检查模块

## 概述

HealthModule 提供了应用健康检查功能，用于监控应用和依赖服务的运行状态。

## 功能特性

- ✅ 应用健康检查
- ✅ 数据库连接检查
- ✅ Redis 连接检查
- ✅ 磁盘空间检查
- ✅ 内存使用检查

## 使用示例

### 健康检查接口

```bash
# 基础健康检查
curl http://localhost:3000/api/health

# 详细健康检查
curl http://localhost:3000/api/health/detailed
```

### 响应示例

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up"
    }
  }
}
```

## 健康检查项

### 1. 数据库检查
检查数据库连接是否正常。

### 2. Redis 检查
检查 Redis 连接是否正常。

### 3. 磁盘检查
检查磁盘空间使用情况。

### 4. 内存检查
检查内存使用情况。

## 状态说明

- **up**: 服务正常
- **down**: 服务异常
- **shutting_down**: 服务正在关闭

## 使用场景

1. **负载均衡**: 用于负载均衡器的健康检查
2. **监控系统**: 用于监控系统收集健康状态
3. **容器编排**: 用于 Kubernetes 等容器编排系统的健康检查
4. **CI/CD**: 用于部署后的健康验证

## 配置说明

### 健康检查路径

默认路径：`/health`

可以通过配置修改：

```typescript
app.getHttpAdapter().getInstance().get('/health', (req, res) => {
  // 自定义健康检查逻辑
})
```

## 最佳实践

1. **定期检查**: 设置定期健康检查
2. **告警机制**: 当健康检查失败时发送告警
3. **日志记录**: 记录健康检查结果
4. **性能优化**: 避免健康检查影响应用性能

## 相关文档

- [@nestjs/terminus 文档](https://docs.nestjs.com/recipes/terminus)
