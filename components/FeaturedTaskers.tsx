"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Wrench, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Tasker = {
  name: string;
  skill: string;
  rating: number;
  jobs: number;
  distance: string;
  rate: number;
  available: boolean;
  top?: boolean;
};

const TASKERS: Tasker[] = [
  { name: "Kasun A.", skill: "Furniture Assembly", rating: 4.9, jobs: 312, distance: "1.2 km", rate: 45, available: true, top: true },
  { name: "Mira S.", skill: "Smart Home Setup", rating: 5.0, jobs: 188, distance: "0.8 km", rate: 52, available: true },
  { name: "Devon P.", skill: "Handyman & Repairs", rating: 4.8, jobs: 247, distance: "2.4 km", rate: 38, available: false },
  { name: "Nimali F.", skill: "Home Cleaning", rating: 4.9, jobs: 401, distance: "3.1 km", rate: 32, available: true },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedTaskers() {
  return (
    <section id="taskers" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <Badge variant="glow" className="mb-3">
            <Wrench className="h-3.5 w-3.5" /> Top Taskers near you
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted locals, ready to help
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Real profiles, verified skills and transparent pricing — pick the Tasker that fits your task.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TASKERS.map((t, i) => (
          <motion.article
            key={t.name}
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-primary/20 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
          >
            {t.top && (
              <span className="absolute -top-2 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Top rated
              </span>
            )}

            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-base font-bold text-primary ring-1 ring-primary/20">
                {t.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-semibold text-slate-900">{t.name}</p>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
                </div>
                <p className="truncate text-sm text-slate-500">{t.skill}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {t.rating}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{t.jobs}+ jobs</span>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {t.distance}
              </span>
              <span className="flex items-center gap-1 font-medium text-primary/80">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs text-slate-400">Starting at</p>
                <p className="font-display text-lg font-bold text-slate-900">
                  ${t.rate}
                  <span className="text-sm font-normal text-slate-400">/hr</span>
                </p>
              </div>
              <span
                className={
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
                  (t.available
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-400")
                }
              >
                <span className={"h-1.5 w-1.5 rounded-full " + (t.available ? "bg-emerald-500" : "bg-slate-300")} />
                {t.available ? "Available" : "Booked"}
              </span>
            </div>

            <Button variant="gradient" size="sm" className="mt-4 w-full">
              Book {t.name.split(" ")[0]} <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
