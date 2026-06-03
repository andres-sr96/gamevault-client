export type GameListItem = {
  id: number;
  title: string;
  releaseYear: string;
  coverImageUrl: string;
};

export type GameDetails = {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  releaseYear: string;
};

export type UserGameListItem = {
  id: number;
  gameId: number;
  status: number;
  rating: number;

  title?: string;
  coverImageUrl?: string;
}