import { ConfigType, registerAs } from '@nestjs/config'
import * as qiniu from 'qiniu'

import { env } from '~/global/env'

function parseZone(zone: string) {
  switch (zone) {
    case 'Zone_as0':
      return qiniu.zone.Zone_as0
    case 'Zone_na0':
      return qiniu.zone.Zone_na0
    case 'Zone_z0':
      return qiniu.zone.Zone_z0
    case 'Zone_z1':
      return qiniu.zone.Zone_z1
    case 'Zone_z2':
      return qiniu.zone.Zone_z2
  }
}

export enum StorageDriver {
  LOCAL = 'local',
  QINIU = 'qiniu',
  S3 = 's3',
}

export const ossRegToken = 'oss'

export const OssConfig = registerAs(ossRegToken, () => ({
  driver: (env('STORAGE_DRIVER') as StorageDriver) || StorageDriver.LOCAL,
  // 七牛云配置
  accessKey: env('OSS_ACCESSKEY'),
  secretKey: env('OSS_SECRETKEY'),
  domain: env('OSS_DOMAIN'),
  bucket: env('OSS_BUCKET'),
  zone: parseZone(env('OSS_ZONE') || 'Zone_z2'),
  access: (env('OSS_ACCESS_TYPE') as any) || 'public',
  // S3 配置
  s3AccessKeyId: env('S3_ACCESS_KEY_ID'),
  s3SecretAccessKey: env('S3_SECRET_ACCESS_KEY'),
  s3Region: env('S3_REGION'),
  s3Bucket: env('S3_BUCKET'),
  s3Endpoint: env('S3_ENDPOINT'), // 可选，用于兼容 S3 协议的其他服务
}))

export type IOssConfig = ConfigType<typeof OssConfig>
