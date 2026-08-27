"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CalendarCheck,
  Wallet,
  ShieldCheck,
  Star,
  Quote,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductPreview } from "@/components/ProductPreview";
import { CreativeCategories } from "@/components/CreativeCategories";
import { FeaturedTaskers } from "@/components/FeaturedTaskers";
import { TrustStats } from "@/components/TrustStats";
import { EarnWithTaskHubStable } from "@/components/EarnWithTaskHubStable";
import { MobileNavigation } from "@/components/MobileNavigation";
import { QuickSearchDrawer } from "@/components/QuickSearchDrawer";
import { BookingModal } from "@/components/BookingModal";
import { LiveActivityToast } from "@/components/LiveActivityToast";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

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
    text: "Fixed my leaking pipe the same day. The quote was exact — no hidden fees, no surprises.",
    rating: 5,
  },
  {
    name: "Nisha de Silva",
    role: "Colombo 05",
    text: "Furniture assembly was spot on. Everything was tidy afterwards and the whole job took under an hour.",
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
      <ProductPreview />
      <CreativeCategories />
      <FeaturedTaskers />

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          title="From request to done in 4 steps"
          description="A simple, transparent process — no phone calls, no haggling, no surprises."
        />

        <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.title}>
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group flex flex-1 flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-primary/20 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-3xl font-bold text-slate-100 transition-colors group-hover:text-primary/30">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </motion.div>
              {i < STEPS.length - 1 && (
                <>
                  <div className="hidden items-center justify-center lg:flex">
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-slate-100 bg-white text-primary shadow-sm">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex justify-center lg:hidden" aria-hidden>
                    <ArrowRight className="h-4 w-4 rotate-90 text-slate-300" />
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Loved locally"
          icon={<Star className="h-3.5 w-3.5" />}
          title="Trusted across the city"
          description="Real stories from customers who booked a Tasker nearby."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-primary/20 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={
                      idx < r.rating
                        ? "h-4 w-4 fill-amber-400 text-amber-400"
                        : "h-4 w-4 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                “{r.text}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-display font-bold text-primary ring-1 ring-primary/20">
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

      {/* Trust / social proof */}
      <TrustStats />

      {/* Become a Tasker CTA — stable container, flowing pastel gradient */}
      <EarnWithTaskHubStable />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-bold">TaskHub</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                Book vetted local Taskers in minutes, or earn on your own
                schedule. A modern marketplace concept built for speed.
              </p>
              <Button asChild variant="gradient" size="sm" className="mt-6">
                <Link href="/become-a-tasker">Become a Tasker</Link>
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Customers</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li><Link href="/#how" className="transition-colors hover:text-primary">How it works</Link></li>
                <li><Link href="/#services" className="transition-colors hover:text-primary">Browse categories</Link></li>
                <li><Link href="/#taskers" className="transition-colors hover:text-primary">Top Taskers</Link></li>
                <li><Link href="/#reviews" className="transition-colors hover:text-primary">Reviews</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Taskers</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li><Link href="/become-a-tasker" className="transition-colors hover:text-primary">Become a Tasker</Link></li>
                <li><Link href="/tasker/dashboard" className="transition-colors hover:text-primary">Dashboard</Link></li>
                <li><Link href="/become-a-tasker/setup" className="transition-colors hover:text-primary">Set up profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-500">
                <li><span className="cursor-default transition-colors hover:text-slate-700">About</span></li>
                <li><span className="cursor-default transition-colors hover:text-slate-700">Careers</span></li>
                <li><span className="cursor-default transition-colors hover:text-slate-700">Contact</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} TaskHub 2.0 — a local marketplace concept.</p>
            <p>Built with Next.js, Tailwind &amp; Framer Motion.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
