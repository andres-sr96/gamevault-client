"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";

export default function GameDetailsPage() {
  const params = useParams();
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/games/${params.id}`);
        setGame(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGame();
  }, [params.id]);

  if (!game) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">{game.title}</h1>
      <p className="mt-4">{game.description}</p>
      <div className="mt-4 text-sm text-gray-600">
        Release Year: {game.releaseYear}
      </div>
    </main>
  );
}
