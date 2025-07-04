import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
import { Request } from 'express';

@Injectable()
export class ConnectionInterceptor<T = any> implements NestInterceptor<T, T> {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;

    this.loggerService.log(`Handling ${method} request to ${url}`, 'http');

    return next.handle().pipe(
      map((data: T) => {
        this.loggerService.log(`Request to ${url} was successful`, 'http');
        return data;
      }),
      catchError((error: any) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.loggerService.log(
          `Error during ${method} request to ${url}: ${errorMessage}`,
        );

        throw error;
      }),
    );
  }
}
