# TasksModule - 定时任务模块

## 概述

TasksModule 提供了定时任务管理功能，支持通过装饰器定义定时任务，并自动注册到系统中。

## 功能特性

- ✅ 基于 `@nestjs/schedule` 的定时任务
- ✅ 通过 `@Mission` 装饰器定义任务
- ✅ 自动注册任务服务
- ✅ 任务执行日志记录
- ✅ 任务状态监控

## 内置任务

### 1. LogClearJob - 日志清理任务
- **功能**: 定期清理过期日志
- **装饰器**: `@Mission(LogClearJob.name, '0 0 2 * * *')`
- **执行时间**: 每天凌晨 2 点

### 2. HttpRequestJob - HTTP 请求任务
- **功能**: 执行 HTTP 请求任务
- **装饰器**: `@Mission(HttpRequestJob.name, '0 */5 * * * *')`
- **执行时间**: 每 5 分钟

### 3. EmailJob - 邮件发送任务
- **功能**: 发送邮件任务
- **装饰器**: `@Mission(EmailJob.name, '0 */10 * * * *')`
- **执行时间**: 每 10 分钟

## 使用方法

### 1. 定义任务服务

```typescript
import { Injectable } from '@nestjs/common'
import { Mission } from '~/modules/tasks/mission.decorator'

@Injectable()
export class MyCustomJob {
  @Mission(MyCustomJob.name, '0 0 * * * *') // 每小时执行
  async execute() {
    console.log('执行自定义任务')
    // 任务逻辑
  }
}
```

### 2. 注册任务模块

```typescript
import { Module } from '@nestjs/common'
import { TasksModule } from '~/modules/tasks/tasks.module'
import { MyCustomJob } from './jobs/my-custom.job'

@Module({
  imports: [TasksModule.forRoot()],
  providers: [MyCustomJob],
})
export class AppModule {}
```

### 3. 在 TasksModule 中注册

```typescript
// tasks.module.ts
const providers = [LogClearJob, HttpRequestJob, EmailJob, MyCustomJob]
```

## @Mission 装饰器

### 语法

```typescript
@Mission(name: string, cron: string)
```

### 参数说明

- **name**: 任务名称（唯一标识）
- **cron**: Cron 表达式，定义执行时间

### Cron 表达式格式

```
秒 分 时 日 月 周
* * * * * *
```

### 常用示例

```typescript
'0 0 0 * * *' // 每天凌晨执行
'0 0 */2 * * *' // 每 2 小时执行
'0 */5 * * * *' // 每 5 分钟执行
'0 0 9 * * 1' // 每周一上午 9 点执行
```

## 任务执行日志

所有任务执行都会记录日志：
- 执行时间
- 执行状态（成功/失败）
- 错误信息（如有）

## 安全注意事项

1. **任务命名**: 确保任务名称唯一
2. **执行频率**: 避免过于频繁的任务执行
3. **错误处理**: 任务中应包含错误处理逻辑
4. **资源清理**: 长时间运行的任务应定期清理资源

## 最佳实践

1. **任务隔离**: 每个任务应该是独立的服务
2. **幂等性**: 确保任务可以安全地重复执行
3. **日志记录**: 记录任务执行的关键信息
4. **异常处理**: 捕获并处理所有可能的异常

## 相关文档

- [@nestjs/schedule 文档](https://docs.nestjs.com/techniques/task-scheduling)
- [Cron 表达式生成器](https://crontab.guru/)
