"use client";

import { useEffect, useState } from "react";
import { getGames } from "@/services/rawgService";
import GameCard from "@/components/GameCard";
import { GameListItem } from "@/types/games";

export default function GamesPage() {
  const [games, setGames] = useState<GameListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGames()
      .then(setGames)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Games</h1>
      <div className="space-y-4">
        {games.map((game: GameListItem) => (
          <GameCard key={game.id} game={game}></GameCard>
        ))}
      </div>
    </main>
  );
}
