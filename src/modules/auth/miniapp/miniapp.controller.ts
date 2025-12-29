import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'

import { AlipayMiniappLoginDto, WechatMiniappLoginDto } from './miniapp.dto'
import { MiniProgramAuthService } from './miniapp.service'

@ApiTags('Auth - 小程序登录')
@Controller('auth/miniapp')
export class MiniProgramAuthController {
  constructor(private readonly service: MiniProgramAuthService) {}

  @Public()
  @Post('wechat')
  @ApiOperation({ summary: '微信小程序登录', description: '传入 wx.login 获取的 code，返回 openId/sessionKey。mockMode 下返回模拟数据。' })
  @ApiResult({})
  async wechatLogin(@Body() dto: WechatMiniappLoginDto) {
    return this.service.wechatLogin(dto.code)
  }

  @Public()
  @Post('alipay')
  @ApiOperation({ summary: '支付宝小程序登录', description: '传入 my.getAuthCode 获取的 authCode，返回用户标识。mockMode 下返回模拟数据。' })
  @ApiResult({})
  async alipayLogin(@Body() dto: AlipayMiniappLoginDto) {
    return this.service.alipayLogin(dto.authCode, dto.userId)
  }
}
