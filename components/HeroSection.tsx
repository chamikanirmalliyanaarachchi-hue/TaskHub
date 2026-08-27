"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { KEYWORD_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";

/**
 * HeroSection (creative overhaul)
 * ----------------------------------------------------------------------------
 *  - Transparent over the global holographic mesh (no flat white).
 *  - Split-text headline: words rise & fade in sequentially; "local expert"
 *    uses a glowing gradient.
 *  - Central glassmorphism search (backdrop-blur-xl, bg-white/30, white/20
 *    border) with a pulsating gradient "Ask AI" pill.
 *  - Live AI tag detection as you type.
 */
const HEADLINE: { text: string; glow?: boolean }[] = [
  { text: "Book" },
  { text: "a" },
  { text: "local expert", glow: true },
  { text: "in" },
  { text: "minutes," },
  { text: "not" },
  { text: "days." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const word = {
  hidden: { opacity: 0, y: "0.5em" },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
};

export function HeroSection() {
  const [query, setQuery] = React.useState("");
  const [detected, setDetected] = React.useState<{ category: string; tag: string }[]>([]);

  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);

  React.useEffect(() => {
    const text = query.toLowerCase();
    if (!text.trim()) {
      setDetected([]);
      return;
    }
    const found: { category: string; tag: string }[] = [];
    const seen = new Set<string>();
    for (const key of Object.keys(KEYWORD_MAP)) {
      if (text.includes(key) && !seen.has(KEYWORD_MAP[key].category)) {
        seen.add(KEYWORD_MAP[key].category);
        found.push(KEYWORD_MAP[key]);
      }
    }
    setDetected(found);
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(detected[0]?.category ?? "All");
    document
      .getElementById("services")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative px-4 pb-14 pt-32 text-center sm:pb-16 sm:pt-40">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl"
      >
        <motion.span
          variants={word}
          className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/50 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI-powered local Taskers, on demand
        </motion.span>

        <motion.h1
          variants={container}
          className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          {HEADLINE.map((w, i) => (
            <motion.span
              key={i}
              variants={word}
              className={
                "inline-block " +
                (w.glow ? "text-gradient" : "")
              }
              style={{ marginRight: "0.25em" }}
            >
              {w.text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={word}
          className="mx-auto mt-5 max-w-xl text-balance text-base text-slate-500 sm:text-lg"
        >
          Describe the task in plain words — our AI matches you with vetted
          Taskers for garage, electronics, furniture, smart-home and more.
        </motion.p>
      </motion.div>

      {/* Central glassmorphism search */}
      <motion.form
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 120, damping: 18 }}
        onSubmit={submit}
        className="mx-auto mt-9 flex max-w-2xl items-center gap-2 rounded-full border border-white/50 bg-white/60 p-2 pl-5 shadow-glass-lg backdrop-blur-xl"
      >
        <Search className="h-5 w-5 shrink-0 text-primary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Fix my car bumper tomorrow at 10 AM…"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </Button>
      </motion.form>

      {/* Live detected tags */}
      <div className="mt-4 flex min-h-[28px] flex-wrap items-center justify-center gap-2">
        <AnimatePresence>
          {detected.map((d, i) => (
            <motion.span
              key={d.tag}
              initial={{ opacity: 0, scale: 0.7, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              <Sparkles className="mr-1 inline h-3 w-3" />
              {d.tag} → {d.category}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Secondary CTA — establishes hierarchy under the search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
      >
        <button
          onClick={() =>
            document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
          }
          className="font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Browse categories
        </button>
        <span className="hidden h-4 w-px bg-slate-200 sm:block" />
        <button
          onClick={() =>
            document.getElementById("taskers")?.scrollIntoView({ behavior: "smooth" })
          }
          className="font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Meet top Taskers
        </button>
      </motion.div>
    </section>
  );
}
