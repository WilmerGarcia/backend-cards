import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { verifyToken } from '../utils/jsonwebtoken.util';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAuthRequired = this.reflector.get<boolean>(
      'auth',
      context.getHandler(),
    );

    if (!isAuthRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = (request.headers['authorization'] as string)?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      verifyToken(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
