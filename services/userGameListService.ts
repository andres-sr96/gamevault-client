import api from "./api";

// Add game to list
export const addGameToList = async (
  gameId: number,
  status: number,
  rating: number,
) => {
  const res = await api.post("/UserGameLists", {
    gameId,
    status,
    rating,
  });

  return res.data;
};

// Get list of games
export const getMyList = async () => {
  const res = await api.get("/UserGameLists");
  return res.data;
};

// Update game in list
export const updateGameInList = async (
  id: number,
  gameId: number,
  status: number,
  rating: number,
) => {
  const res = await api.put(`/UserGameLists/${id}`, {
    gameId,
    status,
    rating,
  });

  return res.data;
};

// Delete game in list
export const deleteGameFromList = async (id: number) => {
  await api.delete(`/UserGameLists/${id}`);
};
