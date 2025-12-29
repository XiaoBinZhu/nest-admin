import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose'

import { ConfigKeyPaths, dbRegToken, IDatabaseConfig } from '~/config'

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService<ConfigKeyPaths>) {}

  createMongooseOptions(): MongooseModuleOptions {
    const config = this.configService.get<IDatabaseConfig>(dbRegToken)!

    return {
      uri: config.url || `mongodb://${config.host || 'localhost'}:${config.port || 27017}/${config.dbName || config.database}`,
      dbName: config.dbName || config.database,
      user: config.username,
      pass: config.password,
    }
  }
}
