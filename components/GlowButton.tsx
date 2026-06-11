"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GlowButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function GlowButton({ href, onClick, children, className }: GlowButtonProps) {
  const divRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  // Shared design styles
  const sharedClasses = cn(
    "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl border-2 font-bold px-8 shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-98 select-none cursor-pointer text-white",
    "border-blue-900/50 bg-gradient-to-r from-blue-950 to-blue-800",
    className
  );

  // Shared dynamic glow background setup
  const glowLayer = (
    <div
      className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
      style={{
        opacity,
        background: `radial-gradient(90px circle at ${position.x}px ${position.y}px, rgba(239, 68, 68, 0.25), rgba(56, 189, 248, 0.25))`, 
        // We included a tiny bit of red highlight potential into the glow field
      }}
    />
  );

  // SCENARIO A: It's an internal page navigation link
  if (href) {
    return (
      <Link
        href={href}
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={sharedClasses}
      >
        {glowLayer}
        <span className="relative z-20">{children}</span>
      </Link>
    );
  }

  // SCENARIO B: It's a functional click handler (like Log Out or Form Submits)
  return (
    <button
      type="button"
      onClick={onClick}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={sharedClasses}
    >
      {glowLayer}
      <span className="relative z-20">{children}</span>
    </button>
  );
}