import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const duplicate = (exception as { code?: number })?.code === 11000;
    const status = duplicate ? HttpStatus.CONFLICT : exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = status >= 500 ? 'Internal server error' : duplicate ? 'Une ressource avec cette valeur existe déjà' : exception instanceof HttpException ? exception.getResponse() : 'Internal server error';
    response.status(status).json({ statusCode: status, error: typeof body === 'string' ? body : body, path: request.url, timestamp: new Date().toISOString() });
  }
}
