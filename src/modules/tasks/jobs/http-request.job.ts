import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { LoggerService } from '~/shared/logger/logger.service'

import { Mission } from '../mission.decorator'

/**
 * Api接口请求类型任务
 */
@Injectable()
@Mission()
export class HttpRequestJob {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 发起请求
   * @param config {AxiosRequestConfig}
   */
  async handle(config: unknown): Promise<void> {
    if (config) {
      const result = await this.httpService.request(config)
      this.logger.log(result, HttpRequestJob.name)
    }
    else {
      const i18n = I18nContext.current()
      const message = i18n?.t('error.HTTP_REQUEST_JOB_PARAM_EMPTY', { defaultValue: 'Http request job param is empty' }) || 'Http request job param is empty'
      throw new BadRequestException(message)
    }
  }
}
