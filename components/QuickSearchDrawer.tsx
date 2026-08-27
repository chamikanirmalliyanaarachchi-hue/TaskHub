"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data";
import { KEYWORD_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * QuickSearchDrawer (light mode)
 * ----------------------------------------------------------------------------
 * A mobile-first bottom-sheet quick-search. Slides up with a spring, drag to
 * dismiss, live AI tag detection, one-tap category shortcuts & examples.
 */
export function QuickSearchDrawer() {
  const isOpen = useAppStore((s) => s.isSearchOpen);
  const closeSearch = useAppStore((s) => s.closeSearch);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);

  const [query, setQuery] = React.useState("");
  const [detected, setDetected] = React.useState<{ category: string; tag: string }[]>([]);

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

  const go = (category: string) => {
    setSelectedCategory(category);
    closeSearch();
    setTimeout(
      () =>
        document
          .getElementById("services")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      220
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    go(detected[0]?.category ?? "All");
  };

  React.useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setQuery(""), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const EXAMPLES = [
    "Fix my car bumper tomorrow",
    "Set up my smart home WiFi",
    "Assemble IKEA wardrobe",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) closeSearch();
            }}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] border-t border-slate-100 bg-white p-5 pb-8 shadow-2xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-slate-900">Quick Search</h3>
              <button
                onClick={closeSearch}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={submit}
              className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-2 pl-4"
            >
              <Search className="h-5 w-5 text-primary" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need done?"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white"
              >
                Go
              </button>
            </form>

            <div className="mt-4 flex min-h-[28px] flex-wrap gap-2">
              <AnimatePresence>
                {detected.map((d, i) => (
                  <motion.span
                    key={d.tag}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    <Sparkles className="mr-1 inline h-3 w-3" />
                    {d.tag} → {d.category}
                  </motion.span>
                ))}
              </AnimatePresence>
              {query && detected.length === 0 && (
                <span className="text-xs text-slate-400">Try “car”, “wifi”, “sofa”…</span>
              )}
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-wider text-slate-400">
              Jump to a category
            </p>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => go(cat)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-wider text-slate-400">
              Popular requests
            </p>
            <div className="mt-3 space-y-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setQuery(ex);
                    go("All");
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left text-sm text-slate-600 shadow-sm"
                >
                  <span>{ex}</span>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
