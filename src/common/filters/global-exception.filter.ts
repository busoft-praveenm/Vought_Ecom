import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Default values for unexpected errors
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
        // Validation errors usually return { message: [...] }
        const msg = (exceptionResponse as any).message;
        message = Array.isArray(msg) ? msg[0] : msg;
      }
      
      // Try to translate the message if it's an i18n key
      if (typeof message === 'string' && message.startsWith('messages.')) {
        try {
          message = await this.i18n.translate(message, {
            lang: (request.headers as any)['accept-language'] || 'en',
          });
        } catch {
          // keep original message if translation fails
        }
      }
    } else {
      // Log unexpected error internally, don't expose to frontend
      this.logger.error(`Unexpected error: ${exception}`, (exception as any)?.stack);
      
      // We translate the "Something went wrong" message here
      try {
        message = await this.i18n.translate('messages.ERROR.SOMETHING_WENT_WRONG', {
          lang: (request.headers as any)['accept-language'] || 'en',
        });
      } catch (err) {
        // Fallback if i18n fails
        message = 'Something went wrong';
      }
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
