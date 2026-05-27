import api from "./api";

export const getGames = async () => {
  const res = await api.get("/games");
  
  return res.data;
};
