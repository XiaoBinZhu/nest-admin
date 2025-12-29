import { registerAs } from '@nestjs/config'

import dotenv from 'dotenv'

import { DataSource, DataSourceOptions } from 'typeorm'

import { env, envBoolean, envNumber } from '~/global/env'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// 当前通过 npm scripts 执行的命令
const currentScript = process.env.npm_lifecycle_event

export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRES = 'postgres',
  MONGODB = 'mongodb',
}

export interface IDatabaseConfig {
  isDocumentDatabase: boolean
  type: DatabaseType | string
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
  synchronize?: boolean
  multipleStatements?: boolean
  entities?: string[]
  migrations?: (string | Function)[]
  subscribers?: (string | Function)[]
  // MongoDB 配置
  url?: string
  dbName?: string
}

const dbType = (env('DB_TYPE') || 'mysql').toLowerCase()
const isDocumentDatabase = dbType === DatabaseType.MONGODB

const dataSourceOptions: DataSourceOptions = {
  type: dbType as any,
  host: env('DB_HOST', '127.0.0.1'),
  port: envNumber('DB_PORT', dbType === 'postgres' ? 5432 : 3306),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  synchronize: envBoolean('DB_SYNCHRONIZE', false),
  // 解决通过 pnpm migration:run 初始化数据时，遇到的 SET FOREIGN_KEY_CHECKS = 0; 等语句报错问题, 仅在执行数据迁移操作时设为 true
  multipleStatements: currentScript === 'typeorm',
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
}

export const dbRegToken = 'database'

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): IDatabaseConfig => ({
    isDocumentDatabase,
    type: dbType,
    host: dataSourceOptions.host,
    port: dataSourceOptions.port,
    username: dataSourceOptions.username,
    password: dataSourceOptions.password,
    database: dataSourceOptions.database,
    synchronize: dataSourceOptions.synchronize,
    multipleStatements: dataSourceOptions.multipleStatements,
    entities: dataSourceOptions.entities as string[],
    migrations: dataSourceOptions.migrations as (string | Function)[],
    subscribers: dataSourceOptions.subscribers as (string | Function)[],
    // MongoDB 配置
    url: env('DB_URL'),
    dbName: env('DB_DATABASE'),
  }),
)

// 仅当使用关系型数据库时创建 DataSource
const dataSource = !isDocumentDatabase ? new DataSource(dataSourceOptions) : null

export default dataSource
