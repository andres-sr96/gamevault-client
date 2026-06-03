"use client";

import { useEffect, useState } from "react";
import {
  getMyList,
  updateGameInList,
  deleteGameFromList,
} from "@/services/userGameListService";
import { getGameById } from "@/services/rawgService";

export default function MyListPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<number>(0);
  const [editRating, setEditRating] = useState<number>(5);

  // Helper dictionary to cleanly show UI labels based on the number code
  const statusLabel = (status: number) => {
    switch (status) {
      case 0: return "Playing";
      case 1: return "Completed";
      case 2: return "On Hold";
      case 3: return "Dropped";
      case 4: return "Plan To Play";
      default: return "Unknown";
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyList();

        // Map backend string representation back to our UI's internal enum integers
        const reverseStatusMap: { [key: string]: number } = {
          "Playing": 0,
          "Completed": 1,
          "On Hold": 2,
          "OnHold": 2, // backup safety case
          "Dropped": 3,
          "Plan To Play": 4,
          "PlanToPlay": 4 // backup safety case
        };

        const enriched = await Promise.all(
          data.map(async (item: any) => {
            const game = await getGameById(item.gameId);
            
            // Turn string from backend (e.g. "Completed") into our React number code (e.g. 1)
            const numericStatus = reverseStatusMap[item.status] ?? 0;

            return {
              ...item,
              status: numericStatus, 
              title: game?.title || "Unknown Title",
              coverImageUrl: game?.coverImageUrl || "",
            };
          })
        );

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
    setEditStatus(item.status !== null && item.status !== undefined ? Number(item.status) : 0);
    setEditRating(item.rating !== null && item.rating !== undefined ? Number(item.rating) : 5);
  };

  const handleUpdate = async (item: any) => {
    try {
      // Send clean numbers directly to the service layer
      await updateGameInList(item.id, item.gameId, editStatus, editRating);

      setList((prev) =>
        prev.map((x) =>
          x.id === item.id
            ? { ...x, status: editStatus, rating: editRating }
            : x
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">My List</h1>

      {list.length === 0 ? (
        <p className="text-gray-500">No games in your list yet.</p>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                {item.coverImageUrl && (
                  <img
                    src={item.coverImageUrl}
                    className="w-16 h-16 object-cover rounded"
                    alt={item.title}
                  />
                )}

                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-600">
                    Status: {statusLabel(item.status)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Rating: {"⭐".repeat(item.rating)}
                  </div>
                </div>
              </div>

              {editingId === item.id ? (
                <div className="flex gap-2 items-center">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(Number(e.target.value))}
                    className="border px-2 py-1"
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
                    className="border px-2 py-1 w-16"
                  />

                  <button
                    onClick={() => handleUpdate(item)}
                    className="border px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="border px-3 py-1 rounded text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}