import { Injectable, Logger } from '@nestjs/common'

import { CreatePaymentDto, PayChannel } from './dto/payment.dto'
import { AlipayPayService } from './services/alipay-pay.service'
import { UnionPayService } from './services/unionpay.service'
import { WechatPayService } from './services/wechat-pay.service'

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name)

  constructor(
    private readonly wechatPayService: WechatPayService,
    private readonly alipayPayService: AlipayPayService,
    private readonly unionPayService: UnionPayService,
  ) {}

  async create(dto: CreatePaymentDto) {
    this.logger.log(`Create payment, channel=${dto.channel}, orderId=${dto.orderId}`)
    switch (dto.channel) {
      case PayChannel.WeChat:
        return this.wechatPayService.createPayment(dto)
      case PayChannel.Alipay:
        return this.alipayPayService.createPayment(dto)
      case PayChannel.UnionPay:
        return this.unionPayService.createPayment(dto)
      default:
        throw new Error(`Unsupported channel: ${dto.channel}`)
    }
  }

  async handleNotify(channel: PayChannel, payload: any) {
    switch (channel) {
      case PayChannel.WeChat:
        return this.wechatPayService.handleNotify(payload)
      case PayChannel.Alipay:
        return this.alipayPayService.handleNotify(payload)
      case PayChannel.UnionPay:
        return this.unionPayService.handleNotify(payload)
      default:
        throw new Error(`Unsupported channel: ${channel}`)
    }
  }
}
