import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export const verifyToken = (token: string) => {
  const configService = new ConfigService();
  const jwtSecret: string =
    configService.get<string>('JWT_SECRET') || 'your_jwt_secret_key';
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido o expirado', error);
  }
};
