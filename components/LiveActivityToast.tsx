"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Radio, Zap } from "lucide-react";
import { ACTIVITY_POOL } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

interface ToastItem {
  id: string;
  name: string;
  service: string;
  location: string;
  minutesAgo: number;
}

/**
 * LiveActivityToast (creative overhaul)
 * ----------------------------------------------------------------------------
 * Sleek glass notification that slides in from the bottom-RIGHT with a subtle
 * spring bounce. Self-generating "recent booking" feed for a lively feel.
 */
export function LiveActivityToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    let counter = 0;
    const spawn = () => {
      const pick = ACTIVITY_POOL[Math.floor(Math.random() * ACTIVITY_POOL.length)];
      const id = `t-${Date.now()}-${counter++}`;
      const item: ToastItem = {
        id,
        name: pick.name,
        service: pick.service,
        location: pick.location,
        minutesAgo: Math.floor(Math.random() * 4) + 1,
      };
      setToasts((prev) => [item, ...prev].slice(0, 3));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
    };
    spawn();
    const interval = setInterval(spawn, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-24 right-3 z-[55] flex w-[min(92vw,340px)] flex-col items-end gap-2 md:bottom-6 md:right-6">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 90, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 90, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="glass pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/40 bg-white/40 p-3 shadow-glass-lg backdrop-blur-xl"
          >
            <span className="relative mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15">
              <Radio className="h-4 w-4 animate-pulse text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-slate-700">
                <b className="text-slate-900">{t.name}</b> just booked{" "}
                <span className="font-medium text-primary">{t.service}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3 w-3" /> {t.location} · {t.minutesAgo} min ago
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Persistent "live" indicator */}
      <div className="flex items-center gap-2 px-1">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <Badge variant="outline" className="border-white/50 bg-white/40 text-[10px] text-slate-500 backdrop-blur">
          <Zap className="mr-1 h-3 w-3 text-primary" /> LIVE nearby
        </Badge>
      </div>
    </div>
  );
}
