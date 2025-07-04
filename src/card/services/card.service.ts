import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateCardDto, UpdateCardDto } from '../DTOS/card.dto';
import { Card, CardDescription } from 'src/common/interface/card.interface';

@Injectable()
export class CardService {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
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
        .where({
          card_id: cardId,
        })
        .select('id', 'description', 'created_at');
      await trx.commit();
      return createdCard;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async getCards(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Card[]; total: number }> {
    const offset = (page - 1) * limit;

    try {
      // Contar el total de tarjetas
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

      return { data: cards, total: Number(totalResult.count) };
    } catch (error: any) {
      throw new Error(`Error al obtener las tarjetas: ${error}`);
    }
  }

  async getCardById(id: number): Promise<Card | null> {
    try {
      const card: Card = await this.knex('card')
        .where('id', id)
        .first()
        .select('id', 'title', 'created_at');

      if (!card) {
        return null;
      }

      const descriptions: CardDescription[] = await this.knex(
        'card_description',
      )
        .where('card_id', id)
        .select('id', 'description', 'created_at');

      card.descriptions = descriptions;
      return card;
    } catch (error: any) {
      throw new Error(`Error al obtener la tarjeta con ID ${id}: ${error}`);
    }
  }

  async updateCard(
    id: number,
    updateCardDto: UpdateCardDto,
  ): Promise<Card | null> {
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
        return null;
      }

      const updatedDescriptions: CardDescription[] = await trx(
        'card_description',
      )
        .where({ card_id: id })
        .select('id', 'description', 'created_at');

      updatedCard.descriptions = updatedDescriptions;
      await trx.commit();

      return updatedCard;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async deleteCard(id: number): Promise<void> {
    const trx = await this.knex.transaction();
    try {
      await trx('card_description').where({ card_id: id }).del();
      await trx('card').where({ id }).del();
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}