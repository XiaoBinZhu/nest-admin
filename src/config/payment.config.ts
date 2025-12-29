import { ConfigType, registerAs } from '@nestjs/config'

import { env } from '~/global/env'

export const paymentRegToken = 'payment'

export interface IPaymentConfig {
  mockMode: boolean

  // WeChat Pay v3
  wechatAppId: string
  wechatMchId: string
  wechatApiV3Key: string
  wechatNotifyUrl: string

  // Alipay
  alipayAppId: string
  alipayPrivateKey: string
  alipayServerUrl: string
  alipayNotifyUrl: string

  // UnionPay (云闪付)
  unionpayMerId: string
  unionpayCertPath: string
  unionpayCertPwd: string
  unionpayNotifyUrl: string
}

export const PaymentConfig = registerAs(
  paymentRegToken,
  (): IPaymentConfig => ({
    mockMode: env('PAYMENT_MOCK_MODE', 'true') === 'true',

    wechatAppId: env('WECHAT_PAY_APPID', ''),
    wechatMchId: env('WECHAT_PAY_MCHID', ''),
    wechatApiV3Key: env('WECHAT_PAY_API_V3_KEY', ''),
    wechatNotifyUrl: env('WECHAT_PAY_NOTIFY_URL', ''),

    alipayAppId: env('ALIPAY_APPID', ''),
    alipayPrivateKey: env('ALIPAY_PRIVATE_KEY', ''),
    alipayServerUrl: env('ALIPAY_SERVER_URL', 'https://openapi.alipay.com/gateway.do'),
    alipayNotifyUrl: env('ALIPAY_NOTIFY_URL', ''),

    unionpayMerId: env('UNIONPAY_MER_ID', ''),
    unionpayCertPath: env('UNIONPAY_CERT_PATH', ''),
    unionpayCertPwd: env('UNIONPAY_CERT_PWD', ''),
    unionpayNotifyUrl: env('UNIONPAY_NOTIFY_URL', ''),
  }),
)

export type IPaymentConfigType = ConfigType<typeof PaymentConfig>
