import { MultipartFile } from '@fastify/multipart'

export interface UploadResult {
  path: string
  url?: string
}

export interface IStorageDriver {
  /**
   * 上传文件
   * @param file 文件对象
   * @param key 存储键（路径）
   * @returns 上传结果
   */
  upload: (file: MultipartFile, key: string) => Promise<UploadResult>

  /**
   * 删除文件
   * @param key 存储键（路径）
   */
  delete: (key: string) => Promise<void>

  /**
   * 获取文件访问 URL
   * @param key 存储键（路径）
   * @returns 文件访问 URL
   */
  getUrl: (key: string) => Promise<string>
}
