"use client";

import { useEffect, useState } from "react";
import {
  getMyList,
  updateGameInList,
  deleteGameFromList,
} from "@/services/userGameListService";
import { getGameById } from "@/services/rawgService";
import { getUsernameFromToken } from "@/services/authToken";
import { getGameReview } from "@/services/reviewService";
import Link from "next/link";

export default function MyListPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<number>(0);
  const [editRating, setEditRating] = useState<number>(5);
  const [reviewedGameIds, setReviewedGameIds] = useState<number[]>([]);

  // Helper to cleanly show UI labels based on the number code
  const statusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Playing";
      case 1:
        return "Completed";
      case 2:
        return "On Hold";
      case 3:
        return "Dropped";
      case 4:
        return "Plan To Play";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyList();
        const username = getUsernameFromToken();

        // Map backend string representation back to our UI's internal enum integers
        const reverseStatusMap: { [key: string]: number } = {
          Playing: 0,
          Completed: 1,
          "On Hold": 2,
          OnHold: 2,
          Dropped: 3,
          "Plan To Play": 4,
          PlanToPlay: 4,
        };

        const reviewedIds: number[] = [];

        const enriched = await Promise.all(
          data.map(async (item: any) => {
            const game = await getGameById(item.gameId);

            // Turn string from backend into our React number code
            const numericStatus = reverseStatusMap[item.status] ?? 0;

            // Check community database
            if (username) {
              try {
                const reviews = await getGameReview(item.gameId);
                const hasUserReview = reviews.some(
                  (r: any) => r.username === username,
                );
                if (hasUserReview) {
                  reviewedIds.push(item.gameId);
                }
              } catch (e) {
                console.error(
                  `Failed to scan reviews for game ${item.gameId}`,
                  e,
                );
              }
            }

            return {
              ...item,
              status: numericStatus,
              title: game?.title || "Unknown Title",
              coverImageUrl: game?.coverImageUrl || "",
            };
          }),
        );

        setReviewedGameIds(reviewedIds);
        setList(enriched);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteGameFromList(id);
      setList((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditStatus(
      item.status !== null && item.status !== undefined
        ? Number(item.status)
        : 0,
    );
    setEditRating(
      item.rating !== null && item.rating !== undefined
        ? Number(item.rating)
        : 5,
    );
  };

  const handleUpdate = async (item: any) => {
    try {
      // Send clean numbers directly to the service layer
      await updateGameInList(item.id, item.gameId, editStatus, editRating);

      setList((prev) =>
        prev.map((x) =>
          x.id === item.id
            ? { ...x, status: editStatus, rating: editRating }
            : x,
        ),
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Vault List</h1>

      {list.length === 0 ? (
        <p className="text-gray-500 italic">No games in your list yet.</p>
      ) : (
        <div className="space-y-4">
          {list.map((item) => {
            const hasReviewed = reviewedGameIds.includes(item.gameId);

            return (
              <div
                key={item.id}
                className="border rounded-xl p-5 flex justify-between items-center bg-white shadow-sm hover:shadow transition gap-4"
              >
                {/* Game Information Section */}
                <div className="flex gap-4 items-center">
                  {item.coverImageUrl && (
                    <img
                      src={item.coverImageUrl}
                      className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                      alt={item.title}
                    />
                  )}

                  <div>
                    <Link
                      href={`/games/${item.gameId}`}
                      className="font-bold text-gray-900 hover:text-blue-600 text-lg transition"
                    >
                      {item.title}
                    </Link>
                    <div className="flex gap-3 items-center text-sm text-gray-600 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold text-gray-700">
                        {statusLabel(item.status)}
                      </span>
                      <span>•</span>
                      <span>Your Rating: {"⭐".repeat(item.rating)}</span>
                    </div>
                  </div>
                </div>

                {/* Interaction & Editing Segment */}
                <div className="flex items-center gap-4">
                  {/* --- NEW: Review Status Encouragement Badge/Button --- */}
                  {editingId !== item.id && (
                    <div>
                      {hasReviewed ? (
                        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg shadow-sm">
                          ✓ Reviewed
                        </span>
                      ) : (
                        <Link
                          href={`/games/${item.gameId}?focus=review`}
                          className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition shadow-sm"
                        >
                          ✍️ Write a Review
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Existing Editing Controls */}
                  {editingId === item.id ? (
                    <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(Number(e.target.value))}
                        className="border rounded px-2 py-1 bg-white text-sm font-medium"
                      >
                        <option value={0}>Playing</option>
                        <option value={1}>Completed</option>
                        <option value={2}>On Hold</option>
                        <option value={3}>Dropped</option>
                        <option value={4}>Plan To Play</option>
                      </select>

                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-14 bg-white text-sm font-medium text-center"
                      />

                      <button
                        onClick={() => handleUpdate(item)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => startEdit(item)}
                        className="border px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-gray-50 transition shadow-sm cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="border px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-red-600 hover:bg-red-50 transition shadow-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
