import { BadRequestException, Controller, Post, Req } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { I18nContext } from 'nestjs-i18n'

import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'

import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { FileUploadDto } from './upload.dto'
import { UploadService } from './upload.service'

export const permissions = definePermission('upload', {
  UPLOAD: 'upload',
} as const)

/**
 * 文件上传控制器
 *
 * 功能说明：
 * - 处理文件上传请求
 * - 支持 multipart/form-data 格式
 * - 自动使用配置的存储驱动（本地/S3/七牛云）
 * - 支持 I18N 错误消息
 *
 * 使用示例：
 * ```bash
 * # 使用 curl 上传文件
 * curl -X POST http://localhost:3000/api/tools/upload \
 *   -H "Authorization: Bearer <token>" \
 *   -H "x-custom-lang: zh" \
 *   -F "file=@/path/to/image.jpg"
 *
 * # 响应示例
 * {
 *   "filename": "/upload/2024-01-01/图片/image-20240101120000.jpg"
 * }
 * ```
 *
 * 前端使用示例：
 * ```typescript
 * const formData = new FormData()
 * formData.append('file', file)
 *
 * const response = await fetch('/api/tools/upload', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${token}`,
 *     'x-custom-lang': 'zh' // 指定语言
 *   },
 *   body: formData
 * })
 * ```
 */
@ApiSecurityAuth()
@ApiTags('Tools - 上传模块')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  /**
   * 上传文件
   *
   * @param req Fastify 请求对象
   * @param user 当前登录用户
   * @returns 文件存储路径
   *
   * 请求格式：
   * - Content-Type: multipart/form-data
   * - Body: file (文件对象)
   *
   * 权限要求：
   * - 需要登录
   * - 需要 upload:upload 权限
   *
   * 错误处理：
   * - 400: 请求不是 multipart 格式
   * - 400: 上传失败（错误消息支持 I18N）
   */
  @Post()
  @Perm(permissions.UPLOAD)
  @ApiOperation({ summary: '上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async upload(@Req() req: FastifyRequest, @AuthUser() user: IAuthUser) {
    if (!req.isMultipart()) {
      const i18n = I18nContext.current()
      const message = i18n?.t('common.invalidRequest', { defaultValue: 'Request is not multipart' }) || 'Request is not multipart'
      throw new BadRequestException(message)
    }

    const file = await req.file()

    // https://github.com/fastify/fastify-multipart
    // 支持多文件上传（示例）：
    // const parts = req.files()
    // for await (const part of parts)
    //   console.log(part.file)

    try {
      const path = await this.uploadService.saveFile(file, user.uid)

      return {
        filename: path,
      }
    }
    catch (error) {
      console.log(error)
      const i18n = I18nContext.current()
      const message = i18n?.t('common.uploadFailed', { defaultValue: '上传失败' }) || '上传失败'
      throw new BadRequestException(message)
    }
  }
}
