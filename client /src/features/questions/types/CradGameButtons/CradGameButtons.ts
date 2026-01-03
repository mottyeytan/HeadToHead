export interface GameCard {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface CategorySection {
  id: string;
  name: string;
  games: GameCard[];
}
