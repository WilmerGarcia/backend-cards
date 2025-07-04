import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}