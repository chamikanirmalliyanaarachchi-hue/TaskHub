"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  MapPin,
  Star,
  Clock,
  Zap,
  ArrowRight,
  Wrench,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ProductPreview — the hero's flagship companion.
 *  - Left: a lightweight, frontend-only AI matching demo. Pick a sample task
 *    (or the default) and watch a subtle 3-step pipeline resolve to a
 *    recommended Tasker. No real AI/network calls.
 *  - Right: a polished "task detail" product mock showing the kind of UI a
 *    customer sees — suggested Taskers, ratings, distance, price, availability.
 */

const SAMPLE_TASKS = [
  "Assemble my IKEA desk tomorrow afternoon",
  "Fix a leaking kitchen pipe today",
  "Mount a 55” TV above the fireplace",
];

const PIPELINE = [
  "Analyzing your task",
  "Finding nearby Taskers",
  "Matching by skills, location & availability",
];

type Tasker = {
  name: string;
  skill: string;
  rating: number;
  jobs: number;
  distance: string;
  rate: number;
  availability: string;
  online: boolean;
};

const MATCHED: Tasker = {
  name: "Kasun A.",
  skill: "Furniture Assembly",
  rating: 4.9,
  jobs: 312,
  distance: "1.2 km",
  rate: 45,
  availability: "Available today",
  online: true,
};

export function ProductPreview() {
  const [query, setQuery] = React.useState(SAMPLE_TASKS[0]);
  const [step, setStep] = React.useState(0); // 0..PIPELINE.length (then done)
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (step < PIPELINE.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 750);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone(true), 450);
    return () => clearTimeout(t);
  }, [step]);

  const run = (q: string) => {
    setQuery(q);
    setStep(0);
    setDone(false);
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid items-center gap-6 lg:grid-cols-12">
        {/* AI matching demo */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-glass-lg backdrop-blur-xl sm:p-7">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Matching
              <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                Live demo
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              “{query}”
            </div>

            <div className="mt-5 space-y-2.5">
              {PIPELINE.map((label, i) => {
                const state = i < step ? "done" : i === step ? "active" : "idle";
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: state === "idle" ? 0.4 : 1, x: 0 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      className={
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full " +
                        (state === "done"
                          ? "bg-emerald-100 text-emerald-600"
                          : state === "active"
                          ? "bg-primary/10 text-primary"
                          : "bg-slate-100 text-slate-300")
                      }
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : state === "active" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span className={state === "idle" ? "text-slate-400" : "text-slate-700"}>
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-3"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-glow">
                    <Zap className="h-5 w-5" />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Recommended Tasker found</p>
                    <p className="text-slate-500">{MATCHED.name} · {MATCHED.skill}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 flex flex-wrap gap-2">
              {SAMPLE_TASKS.map((q) => (
                <button
                  key={q}
                  onClick={() => run(q)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {q.length > 28 ? q.slice(0, 26) + "…" : q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product preview card */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-white/50 bg-white/80 p-5 shadow-glass-lg backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                Task preview
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> {MATCHED.availability}
              </span>
            </div>

            <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
              Furniture Assembly
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Colombo 05 · Estimated $80 · 2 hrs
            </p>

            <div className="mt-4 space-y-3">
              {[MATCHED, { ...MATCHED, name: "Devon P.", skill: "Handyman", rating: 4.8, distance: "2.4 km", rate: 38, availability: "Tomorrow AM" }].map(
                (t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary ring-1 ring-primary/20">
                      {t.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{t.name}</p>
                        <span className="flex items-center gap-0.5 text-xs font-medium text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {t.rating}
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {t.skill} · {t.distance} · {t.jobs}+ jobs
                      </p>
                    </div>
                    <Button size="sm" variant="gradient" className="shrink-0">
                      Book
                    </Button>
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Every Tasker is background-checked and insured.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
