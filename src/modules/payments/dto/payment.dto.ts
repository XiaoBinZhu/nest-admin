import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export enum PayChannel {
  WeChat = 'wechat',
  Alipay = 'alipay',
  UnionPay = 'unionpay',
}

export class CreatePaymentDto {
  @ApiProperty({ description: '订单号' })
  @IsString()
  @IsNotEmpty()
  orderId: string

  @ApiProperty({ description: '商品/业务标题' })
  @IsString()
  @IsNotEmpty()
  subject: string

  @ApiProperty({ description: '金额，单位：元' })
  @IsNumber()
  @Min(0.01)
  amount: number

  @ApiProperty({ enum: PayChannel, description: '支付渠道' })
  @IsEnum(PayChannel)
  channel: PayChannel

  @ApiProperty({ description: '附加数据', required: false })
  @IsOptional()
  @IsString()
  attach?: string
}
