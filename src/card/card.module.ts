import { Module } from '@nestjs/common';
import { CardService } from './services/card.service';
import { CardController } from './controllers/card.controller';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
