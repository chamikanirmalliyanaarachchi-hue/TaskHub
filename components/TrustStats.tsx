"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2, Timer, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";

const STATS = [
  { icon: Star, value: "4.9/5", label: "Average rating", sub: "from 3,200+ reviews" },
  { icon: CheckCircle2, value: "12k+", label: "Tasks completed", sub: "across the city" },
  { icon: Timer, value: "~12 min", label: "Average response", sub: "from first request" },
  { icon: Users, value: "95%", label: "Would recommend", sub: "TaskHub to a friend" },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TrustStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-10"
      >
        <SectionHeading
          eyebrow="Loved locally"
          icon={<Star className="h-3.5 w-3.5" />}
          title="A marketplace people actually trust"
        />

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
              className="text-center"
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                {s.value}
              </p>
              <p className="text-sm font-medium text-slate-700">{s.label}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
