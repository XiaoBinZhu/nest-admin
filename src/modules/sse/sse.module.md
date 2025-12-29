# SSEModule - 服务器发送事件模块

## 概述

SSEModule 提供了服务器发送事件（Server-Sent Events, SSE）功能，用于实现服务器向客户端的实时数据推送。

## 功能特性

- ✅ 实时数据推送
- ✅ 长连接支持
- ✅ 自动重连
- ✅ 事件类型区分
- ✅ 连接管理

## 使用场景

- 实时通知推送
- 系统状态监控
- 日志实时输出
- 任务执行进度

## 使用方法

### 客户端连接

```javascript
// 浏览器端
const eventSource = new EventSource('/api/sse/connect')

eventSource.onmessage = (event) => {
  console.log('收到消息:', event.data)
}

eventSource.addEventListener('notification', (event) => {
  console.log('通知:', JSON.parse(event.data))
})

eventSource.onerror = (error) => {
  console.error('连接错误:', error)
}
```

### 服务端发送事件

```typescript
import { Injectable } from '@nestjs/common'
import { SseService } from '~/modules/sse/sse.service'

@Injectable()
export class MyService {
  constructor(private sseService: SseService) {}

  sendNotification(userId: number, message: string) {
    this.sseService.send(userId, 'notification', {
      type: 'info',
      message,
    })
  }
}
```

## 事件类型

### 1. message - 普通消息
默认事件类型，用于发送普通消息。

### 2. notification - 通知消息
用于发送通知类型的消息。

### 3. custom - 自定义事件
可以定义自定义事件类型。

## 连接管理

### 连接标识

每个连接都有唯一的标识符，通常使用用户 ID。

### 连接状态

- **connected**: 已连接
- **disconnected**: 已断开
- **reconnecting**: 重连中

## 最佳实践

1. **心跳检测**: 定期发送心跳消息保持连接
2. **错误处理**: 处理连接错误和重连逻辑
3. **资源清理**: 及时清理断开的连接
4. **消息格式**: 使用 JSON 格式传递结构化数据

## 注意事项

1. **浏览器限制**: 浏览器对 SSE 连接数有限制（通常 6 个）
2. **代理配置**: 需要配置代理服务器支持 SSE
3. **超时处理**: 设置合理的超时时间
4. **内存管理**: 及时清理不活跃的连接

## 相关文档

- [MDN SSE 文档](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
