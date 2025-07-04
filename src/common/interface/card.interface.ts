export interface CardDescription {
  id: number;
  card_id: number;
  description: string;
  created_at: Date;
}

export interface Card {
  id: number;
  title: string;
  descriptions: CardDescription[];
  created_at: Date;
}