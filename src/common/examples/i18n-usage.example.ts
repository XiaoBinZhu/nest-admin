/**
 * I18N 使用示例
 *
 * 本文件展示了在 nest-admin 项目中使用 I18N 的各种方式
 */

import { Body, Controller, Get, Injectable, Post } from '@nestjs/common'
import { I18nContext, I18nLang, I18nService } from 'nestjs-i18n'

/**
 * 示例 1: 在服务中使用 I18N
 *
 * 使用场景：在业务逻辑中需要返回多语言消息
 */
@Injectable()
export class ExampleService {
  /**
   * 方法 1: 使用 I18nContext.current()
   *
   * 使用示例：
   * ```typescript
   * const message = await this.getWelcomeMessage()
   * ```
   */
  async getWelcomeMessage(): Promise<string> {
    const i18n = I18nContext.current()

    if (!i18n) {
      throw new Error('I18nContext is not available')
    }

    // 从 common.json 获取翻译
    // zh: "欢迎使用 nest-admin"
    // en: "Welcome to nest-admin"
    return i18n.t('common.welcome', { defaultValue: 'Welcome' })
  }

  /**
   * 方法 2: 使用 I18nService（需要注入）
   *
   * 使用示例：
   * ```typescript
   * constructor(private i18n: I18nService) {}
   * const message = await this.getErrorMessage('USER_NOT_FOUND')
   * ```
   */
  constructor(private i18n: I18nService) {}

  async getErrorMessage(errorKey: string): Promise<string> {
    // 从 error.json 获取翻译
    return this.i18n.t(`error.${errorKey}`, {
      defaultValue: 'Unknown error',
    })
  }

  /**
   * 方法 3: 带参数的翻译
   *
   * 使用示例：
   * ```typescript
   * const message = await this.getGreeting('John')
   * // zh: "你好，John"
   * // en: "Hello, John"
   * ```
   */
  async getGreeting(name: string): Promise<string> {
    const i18n = I18nContext.current()
    if (!i18n)
      return `Hello, ${name}`

    // 在语言资源文件中使用参数：
    // zh: { "greeting": "你好，{{name}}" }
    // en: { "greeting": "Hello, {{name}}" }
    return i18n.t('common.greeting', { args: { name } })
  }
}

/**
 * 示例 2: 在控制器中使用 I18N
 *
 * 使用场景：在 API 响应中返回多语言消息
 */
@Controller('example')
export class ExampleController {
  constructor(private i18n: I18nService) {}

  /**
   * 方法 1: 使用 @I18nLang() 装饰器获取当前语言
   *
   * 请求示例：
   * ```bash
   * curl -H "x-custom-lang: en" http://localhost:3000/api/example/lang
   * ```
   */
  @Get('lang')
  async getCurrentLang(@I18nLang() lang: string) {
    return {
      currentLanguage: lang,
      message: this.i18n.t('common.welcome', { lang }),
    }
  }

  /**
   * 方法 2: 在响应中使用 I18N
   *
   * 请求示例：
   * ```bash
   * curl -H "x-custom-lang: zh" http://localhost:3000/api/example/message
   * ```
   */
  @Get('message')
  async getMessage() {
    const i18n = I18nContext.current()
    return {
      message: i18n?.t('common.confirmEmail') || 'Confirm Email',
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * 方法 3: 在业务逻辑中使用 I18N
   *
   * 请求示例：
   * ```bash
   * curl -X POST http://localhost:3000/api/example/create \
   *   -H "x-custom-lang: en" \
   *   -H "Content-Type: application/json" \
   *   -d '{"name": "Test"}'
   * ```
   */
  @Post('create')
  async create(@Body() dto: { name: string }) {
    const i18n = I18nContext.current()

    // 验证逻辑
    if (!dto.name) {
      throw new Error(i18n?.t('common.validationError') || 'Validation failed')
    }

    return {
      success: true,
      message: i18n?.t('common.success', { defaultValue: 'Success' }),
      data: dto,
    }
  }
}

/**
 * 示例 3: 在异常处理中使用 I18N
 *
 * 注意：全局异常过滤器已自动集成 I18N，无需手动处理
 * 但可以在自定义异常中使用：
 */
export class CustomBusinessException extends Error {
  constructor(errorKey: string) {
    const i18n = I18nContext.current()
    const message = i18n?.t(`error.${errorKey}`, { defaultValue: errorKey }) || errorKey
    super(message)
  }
}

/**
 * 示例 4: 在验证管道中使用 I18N
 *
 * 可以在自定义验证器中返回多语言错误消息：
 */
export function customValidator(value: any): boolean {
  if (!value) {
    const i18n = I18nContext.current()
    const message = i18n?.t('common.validationError', { defaultValue: 'Validation failed' })
    throw new Error(message)
  }
  return true
}

/**
 * 语言资源文件结构示例：
 *
 * src/i18n/zh/common.json:
 * {
 *   "welcome": "欢迎使用 nest-admin",
 *   "greeting": "你好，{{name}}",
 *   "confirmEmail": "确认邮箱",
 *   "success": "操作成功"
 * }
 *
 * src/i18n/en/common.json:
 * {
 *   "welcome": "Welcome to nest-admin",
 *   "greeting": "Hello, {{name}}",
 *   "confirmEmail": "Confirm Email",
 *   "success": "Success"
 * }
 */
