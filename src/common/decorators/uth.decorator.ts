import { SetMetadata } from '@nestjs/common';
export const AuthRequired = () => SetMetadata('auth', true);
