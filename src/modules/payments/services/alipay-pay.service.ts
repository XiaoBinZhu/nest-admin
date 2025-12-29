import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ConfigKeyPaths, IPaymentConfig, paymentRegToken } from '~/config'

import { CreatePaymentDto } from '../dto/payment.dto'

@Injectable()
export class AlipayPayService {
  private readonly logger = new Logger(AlipayPayService.name)
  private readonly config: IPaymentConfig

  constructor(private readonly configService: ConfigService<ConfigKeyPaths>) {
    this.config = this.configService.get<IPaymentConfig>(paymentRegToken)!
  }

  async createPayment(dto: CreatePaymentDto) {
    if (this.config.mockMode || !this.config.alipayAppId || !this.config.alipayPrivateKey) {
      return {
        mock: true,
        channel: 'alipay',
        orderId: dto.orderId,
        orderString: `mock-alipay-order-${dto.orderId}`,
      }
    }

    // 说明：此处提供最小可用的参数示例，生产环境请使用 Alipay SDK 生成 orderString。
    this.logger.warn('Alipay real request is not implemented; please integrate official Alipay SDK.')
    return {
      channel: 'alipay',
      orderId: dto.orderId,
      tip: '请在生产环境使用 Alipay SDK 生成 orderString 并签名。',
    }
  }

  async handleNotify(payload: any) {
    this.logger.log(`Alipay notify payload: ${JSON.stringify(payload)}`)
    return 'success'
  }
}
