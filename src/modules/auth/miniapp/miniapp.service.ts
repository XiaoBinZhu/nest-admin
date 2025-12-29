import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'

import { ConfigKeyPaths, IMiniAppConfig, miniAppRegToken } from '~/config'

@Injectable()
export class MiniProgramAuthService {
  private readonly logger = new Logger(MiniProgramAuthService.name)
  private readonly config: IMiniAppConfig

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<ConfigKeyPaths>,
  ) {
    this.config = this.configService.get<IMiniAppConfig>(miniAppRegToken)!
  }

  async wechatLogin(code: string) {
    if (this.config.mockMode || !this.config.wechatAppId || !this.config.wechatSecret) {
      return {
        provider: 'wechat',
        mock: true,
        openId: `mock-wechat-${code}`,
        sessionKey: `mock-session-${code}`,
      }
    }

    const url = 'https://api.weixin.qq.com/sns/jscode2session'
    const params = {
      appid: this.config.wechatAppId,
      secret: this.config.wechatSecret,
      js_code: code,
      grant_type: 'authorization_code',
    }

    const response = await lastValueFrom(this.httpService.get(url, { params }))
    if (response.data.errcode) {
      this.logger.error(`WeChat miniapp login failed: ${response.data.errmsg}`)
      throw new Error(`WeChat miniapp login failed: ${response.data.errmsg}`)
    }

    return {
      provider: 'wechat',
      openId: response.data.openid,
      sessionKey: response.data.session_key,
      unionId: response.data.unionid,
      raw: response.data,
    }
  }

  async alipayLogin(authCode: string, userId?: string) {
    if (this.config.mockMode || !this.config.alipayAppId || !this.config.alipayPrivateKey) {
      return {
        provider: 'alipay',
        mock: true,
        userId: userId || `mock-alipay-${authCode}`,
        openId: userId || `mock-alipay-${authCode}`,
      }
    }

    // 说明：完整的支付宝小程序登录需要签名调用 openapi，这里提供最小可用示例。
    // 生产环境请引入官方 SDK 并使用证书模式，避免在代码中存放私钥。
    const url = this.config.alipayServerUrl
    const payload = {
      method: 'alipay.system.oauth.token',
      grant_type: 'authorization_code',
      code: authCode,
      app_id: this.config.alipayAppId,
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      version: '1.0',
    }

    // 提示：此处未做签名，仅用于展示参数。生产请使用支付宝 SDK 完成签名请求。
    this.logger.warn('Alipay miniapp login payload (unsigned): %o', payload)

    return {
      provider: 'alipay',
      userId: userId || `mock-alipay-${authCode}`,
      openId: userId || `mock-alipay-${authCode}`,
      raw: payload,
    }
  }
}
