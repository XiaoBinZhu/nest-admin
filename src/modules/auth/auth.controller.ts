import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Ip } from '~/common/decorators/http.decorator'

import { UserService } from '../user/user.service'

import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { LocalGuard } from './guards/local.guard'
import { LoginToken } from './models/auth.model'
import { CaptchaService } from './services/captcha.service'

/**
 * 认证控制器
 *
 * 功能说明：
 * - 用户登录认证
 * - 用户注册
 * - JWT Token 生成
 * - 验证码校验
 * - 支持 I18N 错误消息（通过全局异常过滤器自动处理）
 *
 * 使用示例：
 * ```bash
 * # 登录请求
 * curl -X POST http://localhost:3000/api/auth/login \
 *   -H "Content-Type: application/json" \
 *   -H "x-custom-lang: zh" \
 *   -d '{
 *     "username": "admin",
 *     "password": "123456",
 *     "captchaId": "xxx",
 *     "verifyCode": "1234"
 *   }'
 *
 * # 响应示例
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * ```
 *
 * 前端使用示例：
 * ```typescript
 * const response = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'x-custom-lang': 'zh' // 指定语言，错误消息会自动翻译
 *   },
 *   body: JSON.stringify({
 *     username: 'admin',
 *     password: '123456',
 *     captchaId: 'xxx',
 *     verifyCode: '1234'
 *   })
 * })
 * ```
 *
 * 注意：
 * - 错误消息会根据请求头中的语言自动翻译
 * - 支持的语言：zh（中文）、en（英文）
 * - 语言检测优先级：x-custom-lang > Accept-Language > 默认语言
 */
@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private captchaService: CaptchaService,
  ) {}

  /**
   * 用户登录
   *
   * @param dto 登录数据（用户名、密码、验证码）
   * @param ip 客户端IP地址
   * @param ua 用户代理（User-Agent）
   * @returns JWT Token
   *
   * 请求参数：
   * - username: 用户名
   * - password: 密码
   * - captchaId: 验证码ID
   * - verifyCode: 验证码
   *
   * 错误处理（支持 I18N）：
   * - 401: 用户名或密码错误（自动翻译）
   * - 422: 验证码错误（自动翻译）
   * - 404: 用户不存在（自动翻译）
   */
  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult({ type: LoginToken })
  async login(@Body() dto: LoginDto, @Ip()ip: string, @Headers('user-agent')ua: string): Promise<LoginToken> {
    await this.captchaService.checkImgCaptcha(dto.captchaId, dto.verifyCode)
    const token = await this.authService.login(
      dto.username,
      dto.password,
      ip,
      ua,
    )
    return { token }
  }

  /**
   * 用户注册
   *
   * @param dto 注册数据
   *
   * 请求参数：
   * - username: 用户名
   * - password: 密码
   * - email: 邮箱（可选）
   *
   * 错误处理（支持 I18N）：
   * - 422: 用户名已存在（自动翻译）
   * - 400: 参数验证失败（自动翻译）
   */
  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.userService.register(dto)
  }
}
