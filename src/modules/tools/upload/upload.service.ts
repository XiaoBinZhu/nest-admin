import { MultipartFile } from '@fastify/multipart'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import dayjs from 'dayjs'
import { isNil } from 'lodash'
import { I18nContext } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { Storage } from '~/modules/tools/storage/storage.entity'

import {
  fileRename,
  getExtname,
  getFilePath,
  getFileType,
  getSize,
} from '~/utils/file.util'
import { StorageDriverFactory } from './drivers/storage-driver.factory'

/**
 * 文件上传服务
 *
 * 功能说明：
 * - 支持多种存储驱动（本地、S3、七牛云）
 * - 自动根据配置选择存储驱动
 * - 保存文件元数据到数据库
 * - 支持 I18N 错误消息
 *
 * 使用示例：
 * ```typescript
 * // 在控制器中使用
 * @Post('upload')
 * async upload(@Req() req: FastifyRequest, @AuthUser() user: IAuthUser) {
 *   const file = await req.file()
 *   const path = await this.uploadService.saveFile(file, user.uid)
 *   return { filename: path }
 * }
 * ```
 *
 * 配置说明：
 * ```env
 * # 选择存储驱动：local | s3 | qiniu
 * STORAGE_DRIVER=local
 *
 * # S3 配置（当 STORAGE_DRIVER=s3 时）
 * S3_ACCESS_KEY_ID=your-key
 * S3_SECRET_ACCESS_KEY=your-secret
 * S3_REGION=us-east-1
 * S3_BUCKET=your-bucket
 * ```
 */
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Storage)
    private storageRepository: Repository<Storage>,
    private storageDriverFactory: StorageDriverFactory,
  ) { }

  /**
   * 保存文件上传记录
   *
   * @param file 上传的文件对象
   * @param userId 用户ID
   * @returns 文件存储路径
   *
   * @throws NotFoundException 当文件为空时
   *
   * 使用示例：
   * ```typescript
   * const file = await req.file()
   * const path = await uploadService.saveFile(file, 1)
   * // 返回: "/upload/2024-01-01/图片/image-20240101120000.jpg"
   * ```
   */
  async saveFile(file: MultipartFile, userId: number): Promise<string> {
    if (isNil(file)) {
      // 使用 I18N 翻译错误消息
      const i18n = I18nContext.current()
      const message = i18n?.t('common.fileRequired', { defaultValue: 'Have not any file to upload!' }) || 'Have not any file to upload!'
      throw new NotFoundException(message)
    }

    const fileName = file.filename
    const size = getSize(file.file.bytesRead)
    const extName = getExtname(fileName)
    const type = getFileType(extName)
    const name = fileRename(fileName)
    const currentDate = dayjs().format('YYYY-MM-DD')
    const path = getFilePath(name, currentDate, type)

    // 使用存储驱动上传文件
    const driver = this.storageDriverFactory.create()
    const uploadResult = await driver.upload(file, path)

    await this.storageRepository.save({
      name,
      fileName,
      extName,
      path: uploadResult.path,
      type,
      size,
      userId,
    })

    return uploadResult.path
  }
}
