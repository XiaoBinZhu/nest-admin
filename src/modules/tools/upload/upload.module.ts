import { forwardRef, Module } from '@nestjs/common'

import { StorageModule } from '../storage/storage.module'

import { LocalStorageDriver } from './drivers/local-storage.driver'
import { S3StorageDriver } from './drivers/s3-storage.driver'
import { StorageDriverFactory } from './drivers/storage-driver.factory'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

const services = [UploadService]
const drivers = [LocalStorageDriver, S3StorageDriver, StorageDriverFactory]

@Module({
  imports: [forwardRef(() => StorageModule)],
  controllers: [UploadController],
  providers: [...services, ...drivers],
  exports: [...services],
})
export class UploadModule {}
