import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

import { ConfigKeyPaths, dbRegToken, IDatabaseConfig } from '~/config'
import { env } from '~/global/env'
import { TypeORMLogger } from './typeorm-logger'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<ConfigKeyPaths>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config = this.configService.get<IDatabaseConfig>(dbRegToken)!
    let loggerOptions: any = env('DB_LOGGING') as 'all'

    try {
      // 解析成 js 数组 ['error']
      loggerOptions = JSON.parse(loggerOptions)
    }
    catch {
      // ignore
    }

    return {
      type: config.type as any,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: config.synchronize,
      multipleStatements: config.multipleStatements,
      entities: config.entities || ['dist/modules/**/*.entity{.ts,.js}'],
      migrations: config.migrations || ['dist/migrations/*{.ts,.js}'],
      subscribers: config.subscribers || ['dist/modules/**/*.subscriber{.ts,.js}'],
      autoLoadEntities: true,
      logging: loggerOptions,
      logger: new TypeORMLogger(loggerOptions),
    }
  }
}
