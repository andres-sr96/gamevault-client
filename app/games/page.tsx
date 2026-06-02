"use client";

import { useEffect, useState } from "react";
import { getGames } from "@/services/rawgService";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";
import { GameListItem } from "@/types/games";

export default function GamesPage() {
  const [games, setGames] = useState<GameListItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await getGames(debouncedSearch, page);
        setGames(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [debouncedSearch, page]);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Games</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search games..."
        className="border rounded px-3 py-2 w-full mb-6"
        autoComplete="off"
      />
      <div className="relative">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl font-semibold">No games found</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={() => {
            const newPage = page - 1;
            setPage(newPage);
          }}
          disabled={page === 1}
          className="border px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="py-2">Page {page}</span>

        <button
          onClick={() => {
            const newPage = page + 1;
            setPage(newPage);
          }}
          className="border px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </main>
  );
}
