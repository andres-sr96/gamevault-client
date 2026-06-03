"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getGameById } from "@/services/rawgService";
import { GameDetails } from "@/types/games";
import { addGameToList } from "@/services/userGameListService";

export default function GameDetailsPage() {
  const params = useParams();

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string | undefined;

    if (!id) return;

    setLoading(true);

    getGameById(id)
      .then(setGame)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!game) {
    return <div className="p-10">Game not found.</div>;
  }

  const handleAdd = async () => {
    try {
      await addGameToList(Number(game.id), 0, 5);
    } catch (err: any) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">{game.title}</h1>
      <p className="mt-4 text-gray-700 line-clamp-5">
        {game.description || "No description available"}
      </p>{" "}
      <div className="mt-4 text-sm text-gray-600">
        Release Year: {game.releaseYear}
      </div>
      {game.coverImageUrl && (
        <img
          src={game.coverImageUrl || "/placeholder.png"}
          alt={game.title}
          className="mt-6 rounded w-64"
        />
      )}
      <button
        onClick={handleAdd}
        className="mt-4 border rounded px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        Add To My List
      </button>
    </main>
  );
}
