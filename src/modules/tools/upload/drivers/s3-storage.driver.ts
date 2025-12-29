import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { MultipartFile } from '@fastify/multipart'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IOssConfig, ossRegToken } from '~/config/oss.config'
import { IStorageDriver, UploadResult } from '../interfaces/storage-driver.interface'

@Injectable()
export class S3StorageDriver implements IStorageDriver {
  private s3Client: S3Client
  private bucket: string
  private region: string
  private endpoint?: string

  constructor(private configService: ConfigService) {
    const config = this.configService.get<IOssConfig>(ossRegToken)!
    this.bucket = config.s3Bucket || ''
    this.region = config.s3Region || 'us-east-1'
    this.endpoint = config.s3Endpoint

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.s3AccessKeyId || '',
        secretAccessKey: config.s3SecretAccessKey || '',
      },
      ...(this.endpoint && { endpoint: this.endpoint }),
    })
  }

  async upload(file: MultipartFile, key: string): Promise<UploadResult> {
    const buffer = await file.toBuffer()
    const contentType = file.mimetype || 'application/octet-stream'

    // 移除开头的 /，S3 key 不应该以 / 开头
    const s3Key = key.startsWith('/') ? key.slice(1) : key

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    })

    await this.s3Client.send(command)

    // 生成访问 URL
    const url = await this.getUrl(key)

    return {
      path: key,
      url,
    }
  }

  async delete(key: string): Promise<void> {
    const s3Key = key.startsWith('/') ? key.slice(1) : key

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    })

    await this.s3Client.send(command)
  }

  async getUrl(key: string): Promise<string> {
    const s3Key = key.startsWith('/') ? key.slice(1) : key

    // 如果配置了自定义 endpoint（如 MinIO），使用该 endpoint
    if (this.endpoint) {
      return `${this.endpoint}/${this.bucket}/${s3Key}`
    }

    // 标准 S3 URL 格式
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${s3Key}`
  }
}
