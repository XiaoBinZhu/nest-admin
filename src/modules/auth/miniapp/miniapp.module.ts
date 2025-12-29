import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MiniProgramAuthController } from './miniapp.controller'
import { MiniProgramAuthService } from './miniapp.service'

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [MiniProgramAuthController],
  providers: [MiniProgramAuthService],
  exports: [MiniProgramAuthService],
})
export class MiniProgramAuthModule {}
