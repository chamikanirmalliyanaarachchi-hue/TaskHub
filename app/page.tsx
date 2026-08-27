"use client";

import { motion } from "framer-motion";
import {
  Search,
  CalendarCheck,
  Wallet,
  ShieldCheck,
  Star,
  Quote,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CreativeCategories } from "@/components/CreativeCategories";
import { EarnWithTaskHubStable } from "@/components/EarnWithTaskHubStable";
import { MobileNavigation } from "@/components/MobileNavigation";
import { QuickSearchDrawer } from "@/components/QuickSearchDrawer";
import { BookingModal } from "@/components/BookingModal";
import { LiveActivityToast } from "@/components/LiveActivityToast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

/* ----------------------------- How it works ----------------------------- */
const STEPS = [
  {
    icon: Search,
    title: "Describe your task",
    text: "Type a prompt or pick a category — our AI finds the right Tasker.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule instantly",
    text: "Choose a date & time slot with live local availability.",
  },
  {
    icon: Wallet,
    title: "Pay when done",
    text: "Transparent pricing with promos; pay only after the job.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted & insured",
    text: "Every Tasker is background-checked and rated by your neighbours.",
  },
];

/* ----------------------------- Testimonials ----------------------------- */
const REVIEWS = [
  {
    name: "Amara Fernando",
    role: "Colombo 07",
    text: "Booked a smart-home setup in minutes. The Tasker arrived early and configured everything flawlessly.",
    rating: 5,
  },
  {
    name: "Ravi Perera",
    role: "Dehiwala",
    text: "Fixed my leaking pipe the same day. Pricing was exactly what the app quoted — no surprises.",
    rating: 5,
  },
  {
    name: "Nisha de Silva",
    role: "Colombo 05",
    text: "The furniture assembly was spot on. Loved the live tracking and the glassy, modern app experience.",
    rating: 4,
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden pb-24 md:pb-0">
      {/* Global chrome */}
      <Navbar />
      <LiveActivityToast />
      <BookingModal />
      <MobileNavigation />
      <QuickSearchDrawer />

      {/* Hero + creative categories */}
      <HeroSection />
      <CreativeCategories />

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 text-center"
        >
          <Badge variant="glow" className="mb-3">
            <ShieldCheck className="h-3.5 w-3.5" /> How it works
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            From request to done in 4 steps
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-3xl p-6"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg glow">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 text-center"
        >
          <Badge variant="glow" className="mb-3">
            <Star className="h-3.5 w-3.5" /> Loved locally
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Trusted across the city
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1 }}
              className="glass relative rounded-3xl p-6"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/20" />
              {/* Animated star rating */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.08, type: "spring" }}
                  >
                    <Star
                      className={
                        idx < r.rating
                          ? "h-4 w-4 fill-amber-400 text-amber-400"
                          : "h-4 w-4 text-muted-foreground/40"
                      }
                    />
                  </motion.span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                “{r.text}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display font-bold text-white">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Become a Tasker CTA — stable container, flowing pastel gradient */}
      <EarnWithTaskHubStable />

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} TaskHub 2.0 — A futuristic local
        marketplace concept. Built with Next.js, Tailwind & Framer Motion.
      </footer>
    </main>
  );
}
