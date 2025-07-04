import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateCardDto, UpdateCardDto } from '../DTOS/card.dto';
import { Card, CardDescription } from 'src/common/interface/card.interface';
import { LoggerService } from 'src/common/logger/logger.service';
import { ResponseStatus } from 'src/common/enum/response-status.enum';
import { Response } from 'src/common/interface/response.interface';
import { createResponse } from 'src/common/utils/response.util';

@Injectable()
export class CardService {
  constructor(
    @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    private readonly logger: LoggerService,
  ) {}

  async createCard(createCardDto: CreateCardDto): Promise<Response<Card>> {
    const { title, descriptions } = createCardDto;
    const trx = await this.knex.transaction();

    try {
      const [cardId] = await trx('card')
        .insert({ title })
        .then((ids) => ids);

      if (descriptions && descriptions.length > 0) {
        const descriptionData = descriptions.map((description) => ({
          card_id: cardId,
          description: description.description,
        }));

        await trx('card_description').insert(descriptionData);
      }

      const createdCard = (await trx('card')
        .where({ id: cardId })
        .first()) as Card;

      createdCard.descriptions = await trx('card_description')
        .where({ card_id: cardId })
        .select('id', 'description', 'created_at');

      await trx.commit();
      this.logger.log(`Creada tarjeta con ID: ${cardId}`, 'database');

      return createResponse(
        ResponseStatus.SUCCESS,
        'Tarjeta creada con éxito',
        createdCard,
      );
    } catch (error) {
      await trx.rollback();
      this.logger.log(`Error al crear tarjeta: ${error}`, 'error');

      return createResponse(ResponseStatus.ERROR, 'Error al crear la tarjeta');
    }
  }

  async getCards(
    page: number = 1,
    limit: number = 10,
  ): Promise<Response<{ data: Card[]; total: number }>> {
    const offset = (page - 1) * limit;

    try {
      const [totalResult] =
        await this.knex('card').count<{ count: string | number }[]>(
          '* as count',
        );

      const cards: Card[] = await this.knex('card')
        .offset(offset)
        .limit(limit)
        .select('id', 'title', 'created_at');

      for (const card of cards) {
        card.descriptions = await this.knex('card_description')
          .where('card_id', card.id)
          .select('id', 'description', 'created_at');
      }

      return createResponse(
        ResponseStatus.SUCCESS,
        'Tarjetas obtenidas con éxito',
        {
          data: cards,
          total: Number(totalResult.count),
        },
      );
    } catch (error) {
      this.logger.log(`Error al obtener las tarjetas: ${error}`, 'error');

      return createResponse(
        ResponseStatus.ERROR,
        'Error al obtener las tarjetas',
      );
    }
  }

  async getCardById(id: number): Promise<Response<Card | null>> {
    try {
      const card: Card = await this.knex('card')
        .where('id', id)
        .first()
        .select('id', 'title', 'created_at');

      if (!card) {
        return createResponse(ResponseStatus.ERROR, 'Tarjeta no encontrada');
      }

      const descriptions: CardDescription[] = await this.knex(
        'card_description',
      )
        .where('card_id', id)
        .select('id', 'description', 'created_at');

      card.descriptions = descriptions;
      return createResponse(ResponseStatus.SUCCESS, 'Tarjeta encontrada', card);
    } catch (error) {
      this.logger.log(
        `Error al obtener la tarjeta con ID ${id}: ${error}`,
        'error',
      );

      return createResponse(
        ResponseStatus.ERROR,
        'Error al obtener la tarjeta',
      );
    }
  }

  async updateCard(
    id: number,
    updateCardDto: UpdateCardDto,
  ): Promise<Response<Card | null>> {
    const { title, descriptions } = updateCardDto;
    const trx = await this.knex.transaction();

    try {
      await trx('card').where({ id }).update({ title });
      await trx('card_description').where({ card_id: id }).del();

      if (descriptions && descriptions.length > 0) {
        const descriptionData = descriptions.map((description) => ({
          card_id: id,
          description: description.description,
        }));
        await trx('card_description').insert(descriptionData);
      }

      const updatedCard = (await trx('card').where({ id }).first()) as Card;

      if (!updatedCard) {
        await trx.rollback();
        return createResponse(
          ResponseStatus.ERROR,
          'Tarjeta no encontrada para actualizar',
        );
      }

      const updatedDescriptions: CardDescription[] = await trx(
        'card_description',
      )
        .where({ card_id: id })
        .select('id', 'description', 'created_at');

      updatedCard.descriptions = updatedDescriptions;
      await trx.commit();
      this.logger.log(`Actualizada tarjeta con ID: ${id}`, 'database');

      return createResponse(
        ResponseStatus.SUCCESS,
        'Tarjeta actualizada con éxito',
        updatedCard,
      );
    } catch (error) {
      await trx.rollback();
      this.logger.log(`Error al actualizar tarjeta: ${error}`, 'error');

      return createResponse(
        ResponseStatus.ERROR,
        'Error al actualizar la tarjeta',
      );
    }
  }

  async deleteCard(id: number): Promise<Response<void>> {
    const trx = await this.knex.transaction();
    try {
      await trx('card_description').where({ card_id: id }).del();
      await trx('card').where({ id }).del();
      await trx.commit();
      this.logger.log(`Eliminada tarjeta con ID: ${id}`, 'database');

      return createResponse(
        ResponseStatus.SUCCESS,
        'Tarjeta eliminada con éxito',
      );
    } catch (error) {
      await trx.rollback();
      this.logger.log(`Error al eliminar tarjeta: ${error}`, 'error');

      return createResponse(
        ResponseStatus.ERROR,
        'Error al eliminar la tarjeta',
      );
    }
  }
}
