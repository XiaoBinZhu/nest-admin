import fs from 'node:fs'
import path from 'node:path'
import { MultipartFile } from '@fastify/multipart'
import { Injectable } from '@nestjs/common'

import { saveLocalFile } from '~/utils/file.util'
import { IStorageDriver, UploadResult } from '../interfaces/storage-driver.interface'

@Injectable()
export class LocalStorageDriver implements IStorageDriver {
  async upload(file: MultipartFile, key: string): Promise<UploadResult> {
    const buffer = await file.toBuffer()
    // 路径格式: /upload/2024-01-01/图片/file.jpg
    const pathParts = key.split('/').filter(Boolean) // 移除空字符串
    const fileName = pathParts[pathParts.length - 1]
    const datePath = pathParts[pathParts.length - 3] // upload/2024-01-01/图片/file.jpg -> 2024-01-01
    const typePath = pathParts[pathParts.length - 2] // upload/2024-01-01/图片/file.jpg -> 图片

    await saveLocalFile(buffer, fileName, datePath, typePath)

    return {
      path: key,
    }
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(__dirname, '../../../../public', key)
    try {
      await fs.promises.unlink(filePath)
    }
    catch (error) {
      // 文件不存在时忽略错误
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }

  async getUrl(key: string): Promise<string> {
    // 本地存储直接返回路径，由静态文件服务提供访问
    return key
  }
}
