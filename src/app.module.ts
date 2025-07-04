import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [DatabaseModule, CardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
