import { GameDetails, GameListItem } from "@/types/games";
import rawgApi from "./rawgApi";

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export const getGames = async (
  search?: string,
  page: number = 1,
): Promise<GameListItem[]> => {
  const res = await rawgApi.get(`/games`, {
    params: { key: API_KEY, search: search || undefined, page },
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

export const getUpcomingReleases = async (): Promise<GameListItem[]> => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedToday = `${year}-${month}-${day}`;

  // Next 6 months
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);
  const formattedFuture = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, "0")}-${String(futureDate.getDate()).padStart(2, "0")}`;

  const res = await rawgApi.get(`/games`, {
    params: {
      key: API_KEY,
      page_size: 4,
      dates: `${formattedToday},${formattedFuture}`,
      ordering: "released",
    },
  });

  return res.data.results.map((g: any) => ({
    id: g.id,
    title: g.name,
    releaseYear: g.released || "TBA",
    coverImageUrl: g.background_image,
  }));
};

export const getTrendingGames = async (): Promise<GameListItem[]> => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedToday = `${year}-${month}-${day}`;

  const res = await rawgApi.get(`/games`, {
    params: {
      key: API_KEY,
      page_size: 4,
      dates: `${year}-01-01,${formattedToday}`,
      ordering: "-added",
    },
  });

  return res.data.results.map((g: any) => ({
    id: g.id,
    title: g.name,
    releaseYear: g.released || "TBA",
    coverImageUrl: g.background_image,
  }));
};
