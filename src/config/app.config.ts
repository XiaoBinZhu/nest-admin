import { ConfigType, registerAs } from '@nestjs/config'

import { env, envBoolean, envNumber } from '~/global/env'

export const appRegToken = 'app'

const globalPrefix = env('GLOBAL_PREFIX', 'api')
export const AppConfig = registerAs(appRegToken, () => ({
  name: env('APP_NAME'),
  port: envNumber('APP_PORT', 3000),
  baseUrl: env('APP_BASE_URL'),
  globalPrefix,
  locale: env('APP_LOCALE', 'zh-CN'),
  /** 是否允许多端登录 */
  multiDeviceLogin: envBoolean('MULTI_DEVICE_LOGIN', true),
  /** I18N 配置 */
  fallbackLanguage: env('APP_FALLBACK_LANGUAGE', 'zh'),
  headerLanguage: env('APP_HEADER_LANGUAGE', 'x-custom-lang'),

  logger: {
    level: env('LOGGER_LEVEL'),
    maxFiles: envNumber('LOGGER_MAX_FILES'),
  },
}))

export type IAppConfig = ConfigType<typeof AppConfig>

export const RouterWhiteList: string[] = [
  `${globalPrefix ? '/' : ''}${globalPrefix}/auth/captcha/img`,
  `${globalPrefix ? '/' : ''}${globalPrefix}/auth/login`,
]
