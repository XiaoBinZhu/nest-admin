import type { FastifyRequest } from 'fastify'
import path from 'node:path'

import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { ThrottlerGuard } from '@nestjs/throttler'
import { ClsModule } from 'nestjs-cls'
import { I18nModule } from 'nestjs-i18n'

import config from '~/config'
import { SharedModule } from '~/shared/shared.module'
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { IdempotenceInterceptor } from './common/interceptors/idempotence.interceptor'

import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'

import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { CustomLanguageResolver } from './common/resolvers/custom-language.resolver'
import { ConfigKeyPaths } from './config'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RbacGuard } from './modules/auth/guards/rbac.guard'
import { MiniProgramAuthModule } from './modules/auth/miniapp/miniapp.module'
import { HealthModule } from './modules/health/health.module'
import { NetdiskModule } from './modules/netdisk/netdisk.module'
import { PaymentModule } from './modules/payments/payment.module'
import { SseModule } from './modules/sse/sse.module'
import { SystemModule } from './modules/system/system.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { TodoModule } from './modules/todo/todo.module'
import { ToolsModule } from './modules/tools/tools.module'
import { DatabaseModule } from './shared/database/database.module'

import { SocketModule } from './socket/socket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    // 启用 CLS 上下文
    ClsModule.forRoot({
      global: true,
      // https://github.com/Papooch/nestjs-cls/issues/92
      interceptor: {
        mount: true,
        setup: (cls, context) => {
          const req = context.switchToHttp().getRequest<FastifyRequest<{ Params: { id?: string } }>>()
          if (req.params?.id && req.body) {
            // 供自定义参数验证器(UniqueConstraint)使用
            cls.set('operateId', Number.parseInt(req.params.id))
          }
        },
      },
    }),
    SharedModule,
    DatabaseModule,
    /**
     * I18N 国际化模块配置
     *
     * 功能说明：
     * - 支持多语言（中文、英文等）
     * - 自动语言检测（用户偏好 → header → Accept-Language → 默认）
     * - 错误消息自动翻译
     * - 开发模式下自动监听语言文件变化
     *
     * 配置说明：
     * ```env
     * APP_FALLBACK_LANGUAGE=zh        # 默认语言
     * APP_HEADER_LANGUAGE=x-custom-lang # 自定义语言 header 名称
     * ```
     *
     * 使用方式：
     * 1. 在请求头中指定语言：
     *    - x-custom-lang: zh 或 en
     * 2. 在代码中使用：
     *    ```typescript
     *    import { I18nContext } from 'nestjs-i18n'
     *    const i18n = I18nContext.current()
     *    const message = i18n.t('common.welcome')
     *    ```
     * 3. 错误消息自动翻译（通过全局异常过滤器）
     *
     * 语言资源文件位置：
     * - src/i18n/zh/common.json（中文通用消息）
     * - src/i18n/zh/error.json（中文错误消息）
     * - src/i18n/en/common.json（英文通用消息）
     * - src/i18n/en/error.json（英文错误消息）
     */
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const appConfig = configService.get('app')!
        return {
          fallbackLanguage: appConfig.fallbackLanguage || 'zh',
          loaderOptions: {
            path: path.join(__dirname, '../i18n/'),
            watch: true, // 开发模式下自动监听文件变化
          },
        }
      },
      resolvers: [
        CustomLanguageResolver,
      ],
    }),

    AuthModule,
    MiniProgramAuthModule,
    PaymentModule,
    SystemModule,
    TasksModule.forRoot(),
    ToolsModule,
    SocketModule,
    HealthModule,
    SseModule,
    NetdiskModule,

    // biz

    // end biz

    TodoModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
    { provide: APP_INTERCEPTOR, useClass: IdempotenceInterceptor },

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RbacGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },

  ],
})
export class AppModule { }
