import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardService } from '../services/card.service';
import { CreateCardDto, UpdateCardDto } from '../DTOS/card.dto';
import { Card } from 'src/common/interface/card.interface';

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una tarjeta con varias descripciones' })
  @ApiResponse({ status: 201, description: 'Tarjeta creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  async createCard(@Body() createCard: CreateCardDto): Promise<Card> {
    return this.cardService.createCard(createCard);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tarjetas con sus descripciones' })
  @ApiResponse({ status: 200, description: 'Lista de tarjetas.' })
  async getAllCards(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Card[]; total: number }> {
    return this.cardService.getCards(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarjeta por su ID' })
  @ApiResponse({ status: 200, description: 'Tarjeta encontrada.' })
  @ApiResponse({ status: 404, description: 'Tarjeta no encontrada.' })
  async getCardById(@Param('id') id: number): Promise<Card | null> {
    return this.cardService.getCardById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarjeta con varias descripciones' })
  @ApiResponse({ status: 200, description: 'Tarjeta actualizada.' })
  async updateCard(
    @Param('id') id: number,
    @Body() updateCard: UpdateCardDto,
  ): Promise<Card | null> {
    return this.cardService.updateCard(id, updateCard);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarjeta y sus descripciones' })
  @ApiResponse({ status: 200, description: 'Tarjeta eliminada.' })
  async deleteCard(@Param('id') id: number): Promise<void> {
    return this.cardService.deleteCard(id);
  }
}
