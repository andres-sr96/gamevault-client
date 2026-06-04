import api from "./api";

export interface CreateReviewPayload {
  gameId: number;
  content: string;
  rating: number;
}

// Get all reviews for a game
export const getGameReview = async (gameId: number) => {
  const res = await api.get(`/Reviews/game/${gameId}`);
  return res.data;
};

// Submit a review
export const createReview = async (payload: CreateReviewPayload) => {
  const res = await api.post("/Reviews", payload);
  return res.data;
};

// Update an existing review
export const updateReview = async (
  id: number,
  payload: CreateReviewPayload,
) => {
  const res = await api.put(`/Reviews/${id}`, payload);
  return res.data;
};

// Delete a review
export const deleteReview = async (id: number) => {
  await api.delete(`/Reviews/${id}`);
};
