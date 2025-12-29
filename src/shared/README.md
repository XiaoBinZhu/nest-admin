# Shared - 共享模块文档

## 概述

Shared 目录包含了 nest-admin 项目的共享功能模块，包括数据库、日志、邮件、Redis 等基础设施。

## 目录结构

```
shared/
├── database/         # 数据库模块
├── helper/           # 辅助工具
├── logger/           # 日志模块
├── mailer/           # 邮件模块
├── redis/            # Redis 模块
└── README.md         # 本文档
```

## 核心功能

### 1. 数据库模块 (database)

#### DatabaseModule
数据库模块，支持 TypeORM 和 Mongoose。

**功能特性**:
- 支持 MySQL（默认）
- 支持 PostgreSQL
- 支持 MongoDB
- 自动根据配置选择驱动

**配置说明**:
```env
DB_TYPE=mysql  # mysql | postgres | mongodb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=nest_admin
```

**使用示例**:
```typescript
import { Module } from '@nestjs/common'
import { DatabaseModule } from '~/shared/database/database.module'

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
```

**详细文档**: [多数据库支持文档](../../docs/02-多数据库支持.md)

### 2. 日志模块 (logger)

#### LoggerModule
日志模块，基于 Winston。

**功能特性**:
- 日志级别控制
- 日志文件轮转
- 日志格式自定义
- 开发/生产环境区分

**使用示例**:
```typescript
import { Injectable } from '@nestjs/common'
import { LoggerService } from '~/shared/logger/logger.service'

@Injectable()
export class MyService {
  constructor(private logger: LoggerService) {}

  doSomething() {
    this.logger.log('信息日志')
    this.logger.warn('警告日志')
    this.logger.error('错误日志')
  }
}
```

### 3. 邮件模块 (mailer)

#### MailerModule
邮件发送模块，基于 Nodemailer。

**功能特性**:
- SMTP 邮件发送
- 模板邮件支持
- 批量发送
- 发送记录

**配置说明**:
```env
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASS=your-password
```

**使用示例**:
```typescript
import { Injectable } from '@nestjs/common'
import { MailerService } from '~/shared/mailer/mailer.service'

@Injectable()
export class MyService {
  constructor(private mailer: MailerService) {}

  async sendEmail(to: string, subject: string, content: string) {
    await this.mailer.sendMail({
      to,
      subject,
      html: content,
    })
  }
}
```

### 4. Redis 模块 (redis)

#### RedisModule
Redis 模块，基于 ioredis。

**功能特性**:
- Redis 连接管理
- 缓存服务
- 发布订阅
- 集群支持

**配置说明**:
```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

**使用示例**:
```typescript
import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { InjectRedis } from '~/common/decorators/inject-redis.decorator'

@Injectable()
export class MyService {
  constructor(@InjectRedis() private redis: Redis) {}

  async setCache(key: string, value: string) {
    await this.redis.set(key, value, 'EX', 3600)
  }

  async getCache(key: string) {
    return await this.redis.get(key)
  }
}
```

### 5. 辅助工具 (helper)

#### CronService
Cron 表达式服务。

#### QQService
QQ 相关服务。

## 模块导入

### 在 AppModule 中导入

```typescript
import { Module } from '@nestjs/common'
import { SharedModule } from '~/shared/shared.module'

@Module({
  imports: [SharedModule],
})
export class AppModule {}
```

### SharedModule 包含的模块

- DatabaseModule
- LoggerModule
- MailerModule
- RedisModule

## 相关文档

- [多数据库支持](../../docs/02-多数据库支持.md)
- [数据库模块文档](./database/database.module.md)
