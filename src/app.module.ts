import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CardModule } from './card/card.module';
import { ConnectionInterceptor } from './common/interceptors/connection.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    CardModule,
    LoggerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ConnectionInterceptor,
    },
  ],
})
export class AppModule {}
