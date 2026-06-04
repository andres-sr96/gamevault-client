"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { setToken } from "@/services/authToken";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await login({ email, password });

      setToken(res.token);

      router.push("/games");
    } catch (err: any) {
      setError("Invalid credentials");
      console.log("LOGIN ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <div className="mb-3">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="border w-full p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="border w-full p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="border w-full p-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </main>
  );
}
