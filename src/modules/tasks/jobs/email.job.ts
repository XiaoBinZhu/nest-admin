import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { LoggerService } from '~/shared/logger/logger.service'
import { MailerService } from '~/shared/mailer/mailer.service'

import { Mission } from '../mission.decorator'

/**
 * Api接口请求类型任务
 */
@Injectable()
@Mission()
export class EmailJob {
  constructor(
    private readonly emailService: MailerService,
    private readonly logger: LoggerService,
  ) {}

  async send(config: any): Promise<void> {
    if (config) {
      const { to, subject, content } = config
      const result = await this.emailService.send(to, subject, content)
      this.logger.log(result, EmailJob.name)
    }
    else {
      const i18n = I18nContext.current()
      const message = i18n?.t('error.EMAIL_SEND_JOB_PARAM_EMPTY', { defaultValue: 'Email send job param is empty' }) || 'Email send job param is empty'
      throw new BadRequestException(message)
    }
  }
}
