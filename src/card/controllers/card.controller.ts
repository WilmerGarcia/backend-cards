import { Controller } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { CreateCardDto, UpdateCardDto } from '../DTOS/card.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectionInterceptor } from 'src/common/interceptors/connection.interceptor';
import {
  UseInterceptors,
  Query,
  Param,
  Body,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
@ApiTags('cards')
@UseInterceptors(ConnectionInterceptor)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una tarjeta con varias descripciones' })
  async createCard(@Body() createCard: CreateCardDto) {
    const response = await this.cardService.createCard(createCard);
    return response;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarjetas con sus descripciones' })
  async getAllCards(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const response = await this.cardService.getCards(page, limit);
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarjeta por su ID' })
  async getCardById(@Param('id') id: number) {
    const response = await this.cardService.getCardById(id);
    return response;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarjeta con varias descripciones' })
  async updateCard(@Param('id') id: number, @Body() updateCard: UpdateCardDto) {
    const response = await this.cardService.updateCard(id, updateCard);
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarjeta y sus descripciones' })
  async deleteCard(@Param('id') id: number) {
    const response = await this.cardService.deleteCard(id);
    return response;
  }
}
