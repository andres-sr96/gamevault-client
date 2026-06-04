"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getGameById } from "@/services/rawgService";
import { GameDetails } from "@/types/games";
import { addGameToList, getMyList } from "@/services/userGameListService";
import {
  getGameReview,
  createReview,
  updateReview,
  deleteReview,
} from "@/services/reviewService";
import { getToken, getUsernameFromToken } from "@/services/authToken";

export default function GameDetailsPage() {
  const params = useParams();
  const gameId = Number(params.id);

  // Metadata
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isInUserList, setIsInUserList] = useState(false);
  const [isAddingToList, setIsAddingToList] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [myReviewId, setMyReviewId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Sync pipeline
  const loadDashboardData = async () => {
    if (!gameId) return;

    try {
      // fetch community reviews
      const reviewData = await getGameReview(gameId);
      setReviews(reviewData);

      // validating token
      const token = getToken();
      const username = getUsernameFromToken();

      if (token && username) {
        setIsLoggedIn(true);
        setCurrentUsername(username);

        // is user tracking this game in ther personal list?
        const userList = await getMyList();
        const foundInList = userList.some(
          (item: any) => item.gameId === gameId,
        );
        setIsInUserList(foundInList);

        // extracting users review from database if exists
        const userReview = reviewData.find((r: any) => r.username === username);
        if (userReview) {
          setMyReviewId(userReview.id);
          setReviewContent(userReview.content);
          setReviewRating(userReview.rating);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUsername(null);
        setIsInUserList(false);
      }
    } catch (err) {
      console.error("Error executing dashboard sync pipeline", err);
    }
  };

  useEffect(() => {
    const id = params.id as string | undefined;
    if (!id) return;

    setLoading(true);

    getGameById(id)
      .then(setGame)
      .then(() => loadDashboardData())
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!game) {
    return <div className="p-10">Game not found.</div>;
  }

  // Adding a game to users list
  const handleAdd = async () => {
    setIsAddingToList(true);
    setError("");
    try {
      // Passes default parameters when adding a game
      await addGameToList(gameId, 0, 1);
      setIsInUserList(true);
      await loadDashboardData();
    } catch (err: any) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      // If backend returns a 400 bad request because it's a duplicate,
      // it means the game is already in the user's list
      if (err.response?.status === 400) {
        setIsInUserList(true);
        await loadDashboardData();
      } else {
        setError("Failed to add game to your list.");
      }
    } finally {
      setIsAddingToList(false);
    }
  };

  // submit and update review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // backend validation check
    if (reviewContent.length < 5) {
      setError("Your review must be at least 5 characters.");
      return;
    }

    try {
      const payload = { gameId, content: reviewContent, rating: reviewRating };

      if (myReviewId) {
        await updateReview(myReviewId, payload);
        setIsEditing(false);
      } else {
        const newRev = await createReview(payload);
        setMyReviewId(newRev.id);
      }

      await loadDashboardData();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred saving your review.",
      );
    }
  };

  // Delete review action
  const handleReviewDelete = async () => {
    if (!myReviewId) return;
    if (!confirm("Are you sure you want to permanently delete this review?"))
      return;

    try {
      await deleteReview(myReviewId);
      setMyReviewId(null);
      setReviewContent("");
      setIsEditing(false);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!game) {
    return <div className="p-10">Game not found.</div>;
  }

  return (
    <main className="p-10 max-w-5xl mx-auto">
      {/* Game Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {game.coverImageUrl && (
          <img
            src={game.coverImageUrl || "/placeholder.png"}
            alt={game.title}
            className="rounded-lg w-64 shadow border object-cover"
          />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900">{game.title}</h1>
          <div className="mt-2 text-sm text-gray-500">
            Release Year: {game.releaseYear}
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl">
            {game.description || "No description available"}
          </p>

          <div className="mt-6">
            {isInUserList ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg text-sm border border-green-200 shadow-sm">
                ✓ In Your List
              </span>
            ) : (
              <button
                onClick={handleAdd}
                disabled={isAddingToList}
                className="border border-blue-600 bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-lg font-semibold transition disabled:opacity-50 cursor-pointer text-sm"
              >
                {isAddingToList ? "Processing..." : "+ Add To My List"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- COMMUNITY & REVIEW DASHBOARD LAYOUT --- */}
      <div className="mt-16 border-t border-gray-200 pt-10 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Community Hub</h2>

        {/* --- AUTHENTICATION AND TRACKING CONTROLS --- */}
        {!isLoggedIn ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-center shadow-sm text-sm">
            Want to share your personal score and comments?
            <Link
              href="/login"
              className="font-bold underline text-blue-900 hover:text-blue-950 ml-1.5"
            >
              Log In to Leave a Review
            </Link>
          </div>
        ) : !isInUserList ? (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center max-w-2xl mx-auto shadow-sm">
            <p className="text-amber-800 mb-3 text-sm font-semibold">
              You must save this game to your user list tracker before writing
              an evaluation review.
            </p>
            {error && (
              <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>
            )}
            <button
              onClick={handleAdd}
              disabled={isAddingToList}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition shadow disabled:opacity-50 cursor-pointer"
            >
              {isAddingToList ? "Syncing..." : "➕ Fast Add to My List"}
            </button>
          </div>
        ) : (
          /* User is verified, authorized, and game is in list -> Show writing pad input field */
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm max-w-3xl">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-500">
              {myReviewId
                ? isEditing
                  ? "Modify Your Review"
                  : "Your Review Submission"
                : "Write a Review"}
            </h3>

            {error && (
              <p className="text-red-500 text-sm mb-3 font-medium">{error}</p>
            )}

            {myReviewId && !isEditing ? (
              <div className="space-y-3">
                <div className="text-xs bg-blue-100 text-blue-800 inline-block px-2.5 py-1 rounded-md font-bold shadow-sm">
                  Your Rating: {"⭐".repeat(reviewRating)}
                </div>
                <p className="text-gray-700 bg-white p-4 border rounded-xl whitespace-pre-wrap text-sm leading-relaxed shadow-inner">
                  {reviewContent}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 border rounded-lg bg-white hover:bg-gray-100 text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Edit Review
                  </button>
                  <button
                    onClick={handleReviewDelete}
                    className="px-3 py-1 border rounded-lg bg-white text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="reviewRating"
                    className="block text-xs font-bold text-gray-700 mb-1"
                  >
                    Score Allocation
                  </label>
                  <select
                    id="reviewRating"
                    name="reviewRating"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm font-semibold text-xs"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="reviewContent"
                    className="block text-xs font-bold text-gray-700 mb-1"
                  >
                    Review Description
                  </label>
                  <textarea
                    id="reviewContent"
                    name="reviewContent"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 font-normal"
                    placeholder="Tell the community what you liked or disliked about this game (min 5 characters)..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-xs shadow cursor-pointer"
                  >
                    {myReviewId ? "Update Review" : "Publish Review"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border rounded-lg bg-white text-xs font-medium hover:bg-gray-100 shadow-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- GLOBAL USER REVIEWS LIST FEED --- */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-gray-800">All User Feedback</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic text-sm">
              No user logs yet. Be the first to publish yours!
            </p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow">
                      {rev.username.charAt(0)}
                    </div>
                    <span className="font-bold text-sm text-gray-800">
                      @{rev.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-amber-700 font-bold shadow-sm">
                      {"⭐".repeat(rev.rating)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed font-normal">
                  {rev.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
