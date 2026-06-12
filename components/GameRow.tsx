"use client";

import { useEffect, useState } from "react";
import { getUpcomingReleases, getTrendingGames } from "@/services/rawgService";
import { GameListItem } from "@/types/games";
import Link from "next/link";

interface GameRowProps {
  title: string;
  subtitle: string;
  fetchType: "upcoming" | "trending";
}

export default function GameRow({ title, subtitle, fetchType }: GameRowProps) {
  const [games, setGames] = useState<GameListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const data =
          fetchType === "upcoming"
            ? await getUpcomingReleases()
            : await getTrendingGames();

        setGames(data);
      } catch (err: any) {
        console.error("Ledger query error: ", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchType]);

  return (
    <section className="text-white py-16 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Headers */}
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {title}
          </h2>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-72 bg-gray-900/50 animate-pulse rounded-2xl border border-gray-800"
              />
            ))}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group relative bg-gray-900/20 border border-gray-900 rounded-2xl overflow-hidden hover:border-gray-800 transition duration-300 flex flex-col justify-end min-h-[18rem] p-4 shadow-xl"
              >
                {/* Background Artwork */}
                <img
                  src={
                    game.coverImageUrl ||
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80"
                  }
                  alt={game.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 z-0"
                />

                {/* Vignette Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10" />

                {/* Info Text Elements */}
                <div className="relative z-20 space-y-1">
                  <h3 className="font-bold text-base tracking-tight truncate text-white group-hover:text-blue-400 transition-colors">
                    {game.title}
                  </h3>
                  <div className="text-xs text-gray-400 font-medium">
                    {game.releaseYear}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
