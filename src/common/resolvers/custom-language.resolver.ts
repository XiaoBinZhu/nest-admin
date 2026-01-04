import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyRequest } from 'fastify'
import { I18nResolver } from 'nestjs-i18n'
import { ConfigKeyPaths } from '~/config'

/**
 * 自定义语言解析器
 *
 * 功能说明：
 * - 根据请求自动检测用户语言偏好
 * - 支持多种语言检测方式，按优先级顺序：
 *   1. 用户偏好（可从用户实体获取，需扩展实现）
 *   2. 自定义 Header (x-custom-lang)
 *   3. Accept-Language Header
 *   4. 默认语言（fallback language）
 *
 * 使用示例：
 * ```typescript
 * // 在请求头中指定语言
 * // GET /api/users
 * // Headers: x-custom-lang: en
 *
 * // 或使用 Accept-Language
 * // GET /api/users
 * // Headers: Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8
 * ```
 *
 * 配置方式：
 * ```env
 * APP_FALLBACK_LANGUAGE=zh
 * APP_HEADER_LANGUAGE=x-custom-lang
 * ```
 */
@Injectable()
export class CustomLanguageResolver implements I18nResolver {
  private readonly headerName: string

  constructor(private readonly configService: ConfigService<ConfigKeyPaths>) {
    const appConfig = this.configService.get('app')
    this.headerName = appConfig?.headerLanguage || 'x-custom-lang'
  }

  /**
   * 解析请求语言
   * @param context 请求上下文
   * @returns 语言代码（如 'zh', 'en'）或 undefined（使用默认语言）
   */
  resolve(context: any): string | Promise<string> | undefined {
    const request = context.switchToHttp().getRequest() as FastifyRequest

    // 1. 优先从用户偏好获取（如果用户已登录，可以从用户实体获取）
    // 扩展示例：
    // const user = request.user as IAuthUser
    // if (user?.language) {
    //   return user.language
    // }

    // 2. 从自定义 header 获取
    // 使用方式：在请求头中添加 x-custom-lang: en
    const customLang = request.headers[this.headerName] || request.headers[this.headerName.toLowerCase()]
    if (customLang && typeof customLang === 'string') {
      return customLang
    }

    // 3. 从 Accept-Language header 获取
    // 使用方式：浏览器会自动发送，或手动设置 Accept-Language: en-US,en;q=0.9
    const acceptLanguage = request.headers['accept-language']
    if (acceptLanguage && typeof acceptLanguage === 'string') {
      // 解析 Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7
      const languages = acceptLanguage
        .split(',')
        .map((lang) => {
          const [code, q = '1'] = lang.trim().split(';q=')
          return { code: code.split('-')[0], q: Number.parseFloat(q) }
        })
        .sort((a, b) => b.q - a.q)

      if (languages.length > 0) {
        return languages[0].code
      }
    }

    // 4. 返回 undefined，使用默认语言（在 I18nModule 配置中设置）
    return undefined
  }
}
