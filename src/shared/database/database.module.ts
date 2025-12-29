import { Module } from '@nestjs/common'

import { MongooseModule } from '@nestjs/mongoose'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DataSource, DataSourceOptions } from 'typeorm'

import { DatabaseConfig, IDatabaseConfig } from '~/config'

import { EntityExistConstraint } from './constraints/entity-exist.constraint'
import { UniqueConstraint } from './constraints/unique.constraint'
import { MongooseConfigService } from './mongoose-config.service'
import { TypeOrmConfigService } from './typeorm-config.service'

const providers = [EntityExistConstraint, UniqueConstraint]

// 根据配置选择数据库模块
const databaseConfig = DatabaseConfig()
const isDocumentDatabase = (databaseConfig as IDatabaseConfig).isDocumentDatabase

const infrastructureDatabaseModule = isDocumentDatabase
  ? MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
  : TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource
      },
    })

@Module({
  imports: [infrastructureDatabaseModule],
  providers: [...providers, TypeOrmConfigService, MongooseConfigService],
  exports: providers,
})
export class DatabaseModule {}
