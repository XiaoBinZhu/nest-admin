import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { I18nContext } from 'nestjs-i18n'
import { QueryFailedError } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { isDev } from '~/global/env'

interface myError {
  readonly status: number
  readonly statusCode?: number

  readonly message?: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  constructor() {
    this.registerCatchAllExceptionsHook()
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<FastifyRequest>()
    const response = ctx.getResponse<FastifyReply>()

    const url = request.raw.url!

    const status = this.getStatus(exception)
    let message = this.getErrorMessage(exception)

    // 尝试使用 i18n 翻译错误消息
    const i18n = I18nContext.current()
    if (i18n) {
      try {
        // 如果是 BusinessException，尝试从 error.json 获取翻译
        if (exception instanceof BusinessException) {
          const errorCode = exception.getErrorCode()
          const errorKey = this.getErrorKey(errorCode)
          if (errorKey) {
            const translated = i18n.t(`error.${errorKey}`, { defaultValue: message })
            message = translated
          }
        }
        // 对于 HTTP 异常，尝试从 common.json 获取翻译
        else if (exception instanceof HttpException) {
          const httpStatusKey = this.getHttpStatusKey(status)
          if (httpStatusKey) {
            const translated = i18n.t(`common.${httpStatusKey}`, { defaultValue: message })
            message = translated
          }
        }
      }
      catch (error) {
        // i18n 翻译失败时使用原始消息
        this.logger.warn('I18n translation failed', error)
      }
    }

    // 系统内部错误时
    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR
      && !(exception instanceof BusinessException)
    ) {
      Logger.error(exception, undefined, 'Catch')

      // 生产环境下隐藏错误信息
      if (!isDev) {
        const defaultMessage = ErrorEnum.SERVER_ERROR?.split(':')[1] || 'Server Error'
        message = i18n?.t('common.serverError', { defaultValue: defaultMessage }) || defaultMessage
      }
    }
    else {
      this.logger.warn(
        `错误信息：(${status}) ${message} Path: ${decodeURI(url)}`,
      )
    }

    const apiErrorCode = exception instanceof BusinessException ? exception.getErrorCode() : status

    // 返回基础响应结果
    const resBody: IBaseResponse = {
      code: apiErrorCode,
      message,
      data: null,
    }

    response.status(status).send(resBody)
  }

  private getErrorKey(errorCode: number | string): string | null {
    const codeStr = String(errorCode)
    // 从 ErrorEnum 中提取错误键
    const errorMap: Record<string, string> = {
      1017: 'USER_NOT_FOUND',
      1003: 'INVALID_USERNAME_PASSWORD',
      500: 'SERVER_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      400: 'BAD_REQUEST',
    }
    return errorMap[codeStr] || null
  }

  private getHttpStatusKey(status: number): string | null {
    const statusMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'badRequest',
      [HttpStatus.UNAUTHORIZED]: 'unauthorized',
      [HttpStatus.FORBIDDEN]: 'forbidden',
      [HttpStatus.NOT_FOUND]: 'notFound',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'serverError',
    }
    return statusMap[status] || null
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    }
    else if (exception instanceof QueryFailedError) {
      // console.log('driverError', exception.driverError.code)
      return HttpStatus.INTERNAL_SERVER_ERROR
    }
    else {
      return (exception as myError)?.status
        ?? (exception as myError)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message
    }
    else if (exception instanceof QueryFailedError) {
      return exception.message
    }

    else {
      return (exception as any)?.response?.message ?? (exception as myError)?.message ?? `${exception}`
    }
  }

  registerCatchAllExceptionsHook() {
    process.on('unhandledRejection', (reason) => {
      console.error('unhandledRejection: ', reason)
    })

    process.on('uncaughtException', (err) => {
      console.error('uncaughtException: ', err)
    })
  }
}
