import { ConfigType, registerAs } from '@nestjs/config'

import { env } from '~/global/env'

export const miniAppRegToken = 'miniApp'

export interface IMiniAppConfig {
  wechatAppId: string
  wechatSecret: string
  alipayAppId: string
  alipayPrivateKey: string
  alipayServerUrl: string
  alipayAlipayPublicKey?: string
  mockMode: boolean
}

export const MiniAppConfig = registerAs(
  miniAppRegToken,
  (): IMiniAppConfig => ({
    wechatAppId: env('WECHAT_MINIAPP_APPID', ''),
    wechatSecret: env('WECHAT_MINIAPP_SECRET', ''),
    alipayAppId: env('ALIPAY_MINIAPP_APPID', ''),
    alipayPrivateKey: env('ALIPAY_MINIAPP_PRIVATE_KEY', ''),
    alipayServerUrl: env('ALIPAY_SERVER_URL', 'https://openapi.alipay.com/gateway.do'),
    alipayAlipayPublicKey: env('ALIPAY_MINIAPP_ALIPAY_PUBLIC_KEY'),
    mockMode: env('MINIAPP_MOCK_MODE', 'true') === 'true',
  }),
)

export type IMiniAppConfigType = ConfigType<typeof MiniAppConfig>
