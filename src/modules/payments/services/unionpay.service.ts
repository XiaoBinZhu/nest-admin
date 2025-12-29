import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ConfigKeyPaths, IPaymentConfig, paymentRegToken } from '~/config'

import { CreatePaymentDto } from '../dto/payment.dto'

@Injectable()
export class UnionPayService {
  private readonly logger = new Logger(UnionPayService.name)
  private readonly config: IPaymentConfig

  constructor(private readonly configService: ConfigService<ConfigKeyPaths>) {
    this.config = this.configService.get<IPaymentConfig>(paymentRegToken)!
  }

  async createPayment(dto: CreatePaymentDto) {
    if (this.config.mockMode || !this.config.unionpayMerId) {
      return {
        mock: true,
        channel: 'unionpay',
        orderId: dto.orderId,
        tn: `mock-unionpay-tn-${dto.orderId}`,
      }
    }

    // 说明：生产环境需使用云闪付/银联 SDK 生成 tn，并完成证书签名。
    this.logger.warn('UnionPay real request is not implemented; please integrate official SDK.')
    return {
      channel: 'unionpay',
      orderId: dto.orderId,
      tip: '请在生产环境使用云闪付/银联 SDK 生成 tn 并签名。',
    }
  }

  async handleNotify(payload: any) {
    this.logger.log(`UnionPay notify payload: ${JSON.stringify(payload)}`)
    return 'success'
  }
}
