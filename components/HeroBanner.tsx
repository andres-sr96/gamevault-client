"use client";

import GlowButton from "./GlowButton";

export default function HeroBanner() {
  return (
    <section className="relative bg-gray-950 text-white py-24 px-6 sm:px-12 border-b border-gray-800 text-center sm:text-left overflow-hidden min-h-[45vh] flex items-center">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 h-full w-full max-w-7xl bg-[radial-gradient(...) layout]" />
      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto space-y-6 relative z-10 w-full">
        {/* Content Wording */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Discover your next <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              adventure.
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore thousands of titles across all genres. Track your progress,
            manage your library, and find your new favorite game today.
          </p>
        </div>

        {/* Brand New Tracking Glow Buttons */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-2">
          {/* Primary Action Button (Sign Up) */}
          <GlowButton href="/register">Sign Up</GlowButton>

          {/* Secondary Action Button (Sign In) */}
          <GlowButton
            href="/login"
            className="from-gray-900/80 to-gray-950/80 border-gray-800 text-gray-300 hover:text-white"
          >
            Sign In
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
