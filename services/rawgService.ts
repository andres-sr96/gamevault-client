import { GameDetails, GameListItem } from "@/types/games";
import rawgApi from "./rawgApi";

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export const getGames = async (): Promise<GameListItem[]> => {
  const res = await rawgApi.get(`/games`, {
    params: { key: API_KEY },
  });

  return res.data.results.map((g: any) => ({
    id: g.id,
    title: g.name,
    releaseYear: g.released,
    coverImageUrl: g.background_image,
  }));
};

export const getGameById = async (id: string): Promise<GameDetails> => {
  const res = await rawgApi.get(`/games/${id}`, {
    params: { key: API_KEY },
  });

  return {
    id: res.data.id,
    title: res.data.name,
    description: res.data.description_raw,
    releaseYear: res.data.released,
    coverImageUrl: res.data.background_image,
  };
};
