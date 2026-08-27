"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";

/**
 * PremiumTaskerIllustration
 * ----------------------------------------------------------------------------
 * A cohesive, premium isometric "service task" scene rendered as crisp,
 * infinitely scalable vector art (no external Lottie asset required):
 *  - Isometric desk slab with a character + glowing laptop.
 *  - Four floating icon chips (van, toolbox, wrench, lightbulb).
 *  - A slowly rotating gear accent.
 *  - Subtle, continuous loops: whole scene breathes, gear rotates, laptop
 *    screen glows, lightbulb pulses, chips drift.
 *  - The "Set your own hours" pill (above) and "4.9 / 5" card (below) are
 *    preserved as glassmorphism overlays.
 * Pure white/light-mode, brand blues & purples.
 */
export function PremiumTaskerIllustration() {
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 460 460"
        className="h-auto w-full"
        role="img"
        aria-label="Isometric illustration of a TaskHub service scene"
      >
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="100%" stopColor="#EDE9FE" />
          </linearGradient>
          <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="chipShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1E293B" floodOpacity="0.12" />
          </filter>
          <filter id="slabShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#1E293B" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Whole-scene gentle breathing float */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Floor slab (isometric) */}
          <g filter="url(#slabShadow)">
            <polygon points="60,250 230,340 230,366 60,276" fill="#C7D2FE" />
            <polygon points="400,250 230,340 230,366 400,276" fill="#A5B4FC" />
            <polygon points="230,160 400,250 230,340 60,250" fill="url(#floor)" />
          </g>

          {/* Character */}
          <g>
            <ellipse cx="188" cy="300" rx="34" ry="14" fill="#6366F1" opacity="0.9" />
            <rect x="170" y="250" width="36" height="56" rx="16" fill="#818CF8" />
            <circle cx="188" cy="232" r="16" fill="#FBCFE8" />
            <circle cx="188" cy="232" r="16" fill="none" stroke="#F472B6" strokeWidth="2" />
          </g>

          {/* Laptop */}
          <g>
            <polygon points="250,300 330,300 350,288 270,288" fill="#E2E8F0" />
            <polygon points="262,288 330,288 322,238 270,238" fill="#1E293B" />
            <motion.polygon
              points="268,282 324,282 318,244 272,244"
              fill="url(#screen)"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>

          {/* Rotating gear accent */}
          <motion.g
            transform="translate(230,96)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            <g fill="#94A3B8">
              <rect x="-6" y="-22" width="12" height="44" rx="4" />
              <rect x="-22" y="-6" width="44" height="12" rx="4" transform="rotate(45)" />
              <rect x="-22" y="-6" width="44" height="12" rx="4" transform="rotate(-45)" />
            </g>
            <circle cx="0" cy="0" r="10" fill="#F8FAFC" />
          </motion.g>

          {/* Floating icon chips */}
          <Chip x={92} y={92} delay={0}>
            {/* van */}
            <rect x="12" y="24" width="34" height="18" rx="3" fill="#3B82F6" />
            <rect x="40" y="28" width="12" height="14" rx="2" fill="#93C5FD" />
            <rect x="42" y="30" width="8" height="8" rx="1" fill="#fff" opacity="0.85" />
            <circle cx="22" cy="44" r="5" fill="#334155" />
            <circle cx="46" cy="44" r="5" fill="#334155" />
          </Chip>

          <Chip x={300} y={100} delay={0.6}>
            {/* toolbox */}
            <rect x="14" y="26" width="36" height="22" rx="3" fill="#A855F7" />
            <rect x="12" y="20" width="40" height="8" rx="3" fill="#7E22CE" />
            <rect x="26" y="14" width="12" height="8" rx="2" fill="#7E22CE" />
            <rect x="28" y="32" width="4" height="10" rx="1" fill="#FBCFE8" />
          </Chip>

          <Chip x={86} y={300} delay={1.2}>
            {/* wrench */}
            <line x1="20" y1="46" x2="44" y2="20" stroke="#0EA5E9" strokeWidth="6" strokeLinecap="round" />
            <circle cx="44" cy="20" r="8" fill="none" stroke="#0EA5E9" strokeWidth="5" />
            <circle cx="44" cy="20" r="3" fill="#fff" />
          </Chip>

          {/* lightbulb chip (pulsing) */}
          <motion.g transform="translate(338,300)" style={{ filter: "url(#chipShadow)" }}>
            <motion.g
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x="0" y="0" width="64" height="64" rx="16" fill="white" />
              <circle cx="32" cy="26" r="12" fill="#FBBF24" />
              <rect x="26" y="36" width="12" height="8" rx="2" fill="#64748B" />
              <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
                <line x1="32" y1="8" x2="32" y2="2" />
                <line x1="48" y1="14" x2="52" y2="10" />
                <line x1="16" y1="14" x2="12" y2="10" />
              </g>
            </motion.g>
          </motion.g>
        </motion.g>
      </svg>

      {/* Preserved glassmorphism overlays */}
      <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 sm:-top-5">
        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2.5 shadow-glass-lg backdrop-blur-xl">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-slate-700">Set your own hours</span>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 sm:-bottom-5">
        <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-3 shadow-glass-lg backdrop-blur-xl">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-500">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400 animate-pulse-glow" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">4.9 / 5</p>
            <p className="text-xs text-slate-500">Tasker rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A floating white chip card containing an icon glyph. */
function Chip({
  x,
  y,
  delay = 0,
  children,
}: {
  x: number;
  y: number;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ filter: "url(#chipShadow)" }}
      >
        <rect x={0} y={0} width={64} height={64} rx={16} fill="white" />
        {children}
      </motion.g>
    </g>
  );
}
