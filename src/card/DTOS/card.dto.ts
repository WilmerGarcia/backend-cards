import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateDescriptionDto {
  @ApiProperty({
    description: 'El ID de la tarjeta a la que pertenece la descripción',
  })
  card_id: number;

  @ApiProperty({ description: 'La descripción de la tarjeta' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateDescriptionDto extends PartialType(CreateDescriptionDto) {}

export class CreateCardDto {
  @ApiProperty({ description: 'El título de la tarjeta' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Lista de descripciones de la tarjeta',
    type: [CreateDescriptionDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  descriptions: CreateDescriptionDto[];
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}