import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class WechatMiniappLoginDto {
  @ApiProperty({ description: 'wx.login 获取的临时 code' })
  @IsString()
  @IsNotEmpty()
  code: string
}

export class AlipayMiniappLoginDto {
  @ApiProperty({ description: 'my.getAuthCode 获取的 authCode' })
  @IsString()
  @IsNotEmpty()
  authCode: string

  @ApiProperty({ description: '支付宝用户 id，可选，回调场景可带上', required: false })
  @IsString()
  @IsOptional()
  userId?: string
}
