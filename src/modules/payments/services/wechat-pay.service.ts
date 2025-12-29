import { randomUUID } from 'node:crypto'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ConfigKeyPaths, IPaymentConfig, paymentRegToken } from '~/config'

import { CreatePaymentDto } from '../dto/payment.dto'

@Injectable()
export class WechatPayService {
  private readonly logger = new Logger(WechatPayService.name)
  private readonly config: IPaymentConfig

  constructor(private readonly configService: ConfigService<ConfigKeyPaths>) {
    this.config = this.configService.get<IPaymentConfig>(paymentRegToken)!
  }

  async createPayment(dto: CreatePaymentDto) {
    if (this.config.mockMode || !this.config.wechatAppId || !this.config.wechatMchId || !this.config.wechatApiV3Key) {
      return {
        mock: true,
        channel: 'wechat',
        orderId: dto.orderId,
        nonceStr: randomUUID(),
        prepayId: `mock-prepay-${dto.orderId}`,
        paySign: `mock-sign-${dto.orderId}`,
      }
    }

    // 说明：此处提供最小可用的参数示例，实际需要使用微信支付 v3 SDK 完成签名与请求。
    this.logger.warn('WeChat Pay real request is not implemented; please integrate official SDK for production.')
    return {
      channel: 'wechat',
      orderId: dto.orderId,
      tip: '请在生产环境使用微信支付 v3 SDK 完成签名与下单。',
    }
  }

  async handleNotify(payload: any) {
    this.logger.log(`WeChat Pay notify payload: ${JSON.stringify(payload)}`)
    return 'success'
  }
}
