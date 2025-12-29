import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IOssConfig, ossRegToken, StorageDriver } from '~/config/oss.config'
import { IStorageDriver } from '../interfaces/storage-driver.interface'
import { LocalStorageDriver } from './local-storage.driver'
import { S3StorageDriver } from './s3-storage.driver'

@Injectable()
export class StorageDriverFactory {
  constructor(
    private configService: ConfigService,
    private localStorageDriver: LocalStorageDriver,
    private s3StorageDriver: S3StorageDriver,
  ) {}

  create(): IStorageDriver {
    const config = this.configService.get<IOssConfig>(ossRegToken)!
    const driver = config.driver || StorageDriver.LOCAL

    switch (driver) {
      case StorageDriver.S3:
        return this.s3StorageDriver
      case StorageDriver.LOCAL:
      default:
        return this.localStorageDriver
    }
  }
}
