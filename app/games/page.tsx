"use client";

import { useEffect, useState } from "react";
import { getGames } from "@/services/gameService";
import Link from "next/link";

export default function GamesPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames().then(setGames).catch(console.error);
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Games</h1>
      <div className="space-y-4">
        {games.map((game: any) => (
          <Link key={game.id} href={`/games/${game.id}`}>
            <div className="border p-4 rounded cursor-pointer hover:bg-gray-50">
              <h2 className="text-xl font-semibold">{game.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
