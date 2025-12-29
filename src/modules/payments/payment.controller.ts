import { Body, Controller, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'

import { CreatePaymentDto, PayChannel } from './dto/payment.dto'
import { PaymentService } from './payment.service'

@ApiTags('Payment - 支付')
@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  @ApiOperation({ summary: '创建支付订单', description: '根据 channel 创建微信/支付宝/云闪付支付参数。mockMode 下返回模拟数据。' })
  @ApiResult({})
  async create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto)
  }

  @Public()
  @Post('notify/:channel')
  @ApiOperation({ summary: '支付回调', description: '接收第三方支付回调，当前示例直接记录并返回 success。' })
  async notify(@Param('channel') channel: PayChannel, @Body() payload: any) {
    return this.service.handleNotify(channel, payload)
  }
}
