# Common - 公共模块文档

## 概述

Common 目录包含了 nest-admin 项目的公共功能模块，包括装饰器、拦截器、过滤器、异常处理等。

## 目录结构

```
common/
├── adapters/          # 适配器
├── decorators/       # 装饰器
├── dto/              # 数据传输对象
├── entity/           # 公共实体
├── examples/         # 使用示例
├── exceptions/       # 异常类
├── filters/          # 异常过滤器
├── interceptors/     # 拦截器
├── model/            # 数据模型
├── pipes/            # 管道
├── resolvers/        # 解析器
└── README.md         # 本文档
```

## 核心功能

### 1. 适配器 (adapters)

#### FastifyAdapter
Fastify 框架适配器配置。

#### SocketAdapter
Socket.IO 适配器，支持 Redis 集群。

### 2. 装饰器 (decorators)

#### @ApiResult()
Swagger API 响应装饰器。

#### @Public()
标记接口为公开接口，跳过认证。

#### @Perm()
权限验证装饰器。

#### @Resource()
资源权限装饰器。

#### @AuthUser()
获取当前登录用户装饰器。

#### @Ip()
获取客户端 IP 装饰器。

### 3. 异常处理 (exceptions/filters)

#### BusinessException
业务异常类。

#### AllExceptionsFilter
全局异常过滤器，支持 I18N。

### 4. 拦截器 (interceptors)

#### TransformInterceptor
响应数据转换拦截器。

#### TimeoutInterceptor
请求超时拦截器。

#### IdempotenceInterceptor
幂等性拦截器。

#### LoggingInterceptor
日志记录拦截器。

### 5. 管道 (pipes)

#### ParseIntPipe
整数解析管道。

#### CreatorPipe
创建者信息管道。

#### UpdaterPipe
更新者信息管道。

### 6. 解析器 (resolvers)

#### CustomLanguageResolver
自定义语言解析器，支持 I18N。

## 使用示例

### 装饰器使用

```typescript
import { Controller, Get } from '@nestjs/common'
import { AuthUser, Perm, Public } from '~/common/decorators'

@Controller('example')
export class ExampleController {
  @Public()
  @Get('public')
  getPublic() {
    return '公开接口'
  }

  @Perm('user:read')
  @Get('users')
  getUsers(@AuthUser() user: IAuthUser) {
    return { userId: user.uid }
  }
}
```

### 异常处理

```typescript
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
// 错误消息会自动通过 I18N 翻译
```

### I18N 使用

```typescript
import { I18nContext } from 'nestjs-i18n'

const i18n = I18nContext.current()
const message = i18n.t('common.welcome')
```

## 相关文档

- [I18N 使用示例](./examples/i18n-usage.example.ts)
- [自定义语言解析器](./resolvers/custom-language.resolver.ts)
