import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { AlipayPayService } from './services/alipay-pay.service'
import { UnionPayService } from './services/unionpay.service'
import { WechatPayService } from './services/wechat-pay.service'

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService, WechatPayService, AlipayPayService, UnionPayService],
  exports: [PaymentService],
})
export class PaymentModule {}
