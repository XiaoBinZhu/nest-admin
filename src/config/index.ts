import { AppConfig, appRegToken, IAppConfig } from './app.config'
import { DatabaseConfig, DatabaseType, dbRegToken, IDatabaseConfig } from './database.config'
import { IMailerConfig, MailerConfig, mailerRegToken } from './mailer.config'
import { IMiniAppConfig, MiniAppConfig, miniAppRegToken } from './miniapp.config'
import { IOssConfig, OssConfig, ossRegToken, StorageDriver } from './oss.config'
import { IPaymentConfig, PaymentConfig, paymentRegToken } from './payment.config'
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config'
import { ISecurityConfig, SecurityConfig, securityRegToken } from './security.config'
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config'

export * from './app.config'
export * from './database.config'
export * from './mailer.config'
export * from './miniapp.config'
export * from './oss.config'
export * from './payment.config'
export * from './redis.config'
export * from './security.config'
export * from './swagger.config'

export { DatabaseType, StorageDriver }

export interface AllConfigType {
  [appRegToken]: IAppConfig
  [dbRegToken]: IDatabaseConfig
  [mailerRegToken]: IMailerConfig
  [redisRegToken]: IRedisConfig
  [securityRegToken]: ISecurityConfig
  [swaggerRegToken]: ISwaggerConfig
  [ossRegToken]: IOssConfig
  [miniAppRegToken]: IMiniAppConfig
  [paymentRegToken]: IPaymentConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
  DatabaseConfig,
  MailerConfig,
  OssConfig,
  MiniAppConfig,
  PaymentConfig,
  RedisConfig,
  SecurityConfig,
  SwaggerConfig,
}
