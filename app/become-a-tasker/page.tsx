"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Zap,
  Star,
  BadgeCheck,
  Apple,
  Play,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  DollarSign,
  TrendingUp,
  UserPlus,
  UserCog,
  ShieldCheck,
  CreditCard,
  CalendarClock,
  Rocket,
  Quote,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { TaskerHeroForm } from "@/components/TaskerHeroForm";
import { AuthModal } from "@/components/AuthModal";
import { PremiumTaskerIllustration } from "@/components/PremiumTaskerIllustration";
import { useAuth } from "@/lib/useAuth";
import { AboutProjectNote } from "@/components/AboutProjectNote";

/**
 * Become a Tasker — expanded, Awwwards-grade marketing + onboarding page.
 *  - Crisp light-mode canvas (`bg-slate-50`) with white `rounded-3xl` cards
 *    and soft `shadow-xl shadow-slate-100`.
 *  - Sections: Hero, Flexible Work, 6-Step Guide, Testimonial, FAQ, Footer.
 *  - "Get started" / "Sign in" are Firebase-auth-gated via the AuthModal.
 *  - Framer Motion `Reveal` adds smooth on-scroll entry animations.
 */
export default function BecomeATaskerPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authIntent, setAuthIntent] = React.useState<"start" | "close">("start");
  const [authMode, setAuthMode] = React.useState<"signup" | "login">("signup");
  const [step, setStep] = React.useState<"form" | "next">("form");

  // "Get started":
  //  - already signed in  → skip the modal and go straight to the setup wizard
  //  - not signed in      → open the Auth modal in sign-up mode (advances after success)
  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push("/become-a-tasker/setup");
      return;
    }
    setAuthMode("signup");
    setAuthIntent("start");
    setAuthOpen(true);
  };

  // "Sign in" (navbar + form) → open the Auth modal in Log In mode; just close afterward.
  const handleSignIn = () => {
    if (isLoggedIn) return;
    setAuthMode("login");
    setAuthIntent("close");
    setAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    if (authIntent === "start") setStep("next");
  };

  return (
    <main className="relative z-10 min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* ───────────────────────── Navbar ───────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-gradient">TaskHub</span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name ?? "User"}
                    className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                    {(user?.name ?? user?.email ?? "T").charAt(0).toUpperCase()}
                  </span>
                )}
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/"
                  className="hidden text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 sm:block"
                >
                  Back to home
                </Link>
                <button
                  onClick={handleSignIn}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:py-20">
        {/* Left — premium animated isometric illustration */}
        <Reveal>
          <PremiumTaskerIllustration />
        </Reveal>

        {/* Right — interactive form OR next step */}
        <Reveal delay={0.1}>
          <div>
          {step === "form" ? (
            <TaskerHeroForm
              onGetStarted={handleGetStarted}
              isLoggedIn={isLoggedIn}
              userEmail={user?.email}
              onSignIn={handleSignIn}
            />
          ) : (
            <NextStepPanel
              onContinue={() => router.push("/become-a-tasker/setup")}
              onLogout={() => { logout(); setStep("form"); }}
            />
          )}
          </div>
        </Reveal>
      </section>

      {/* ─────────────────── Flexible Work Section ─────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Flexible work
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Work on your own terms
            </h2>
            <p className="mt-3 text-slate-500">
              TaskHub gives you the freedom to build a career that fits your life — not the other way around.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FLEX_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="group h-full rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-slate-900">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────────────── Getting Started 6 Steps ─────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                Getting started
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                Six steps to your first job
              </h2>
              <p className="mt-3 text-slate-500">
                From sign-up to payday — we&apos;ll guide you the whole way.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="flex h-full gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm transition-colors hover:bg-white hover:shadow-xl hover:shadow-slate-100">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent font-display text-lg font-bold text-white">
                    {s.n}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <s.icon className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-slate-900">{s.title}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── Testimonial ─────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100 sm:p-12">
            <Quote className="h-10 w-10 text-primary/30" />
            <p className="mt-5 font-display text-2xl font-medium leading-snug text-slate-900">
              &ldquo;I went from zero to booking five jobs a week in my first month. TaskHub let me turn my
              weekend free time into a real income — on my own schedule.&rdquo;
            </p>
            <div className="mt-7 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="Nimali Fernando"
                className="h-14 w-14 rounded-full object-cover shadow-md"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-slate-900">Nimali Fernando</p>
                <p className="text-sm text-slate-500">Top-rated Tasker · Colombo</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Your questions, answered
            </h2>
          </Reveal>
          <div className="mt-8 divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-slate-50/60 p-2 shadow-sm">
            {FAQS.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── Footer ─────────────────── */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
          {/* Partner logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {["Acme", "Globex", "Initech", "Umbrella", "Hooli"].map((p) => (
              <span key={p} className="font-display text-lg font-bold tracking-tight text-slate-400">
                {p}
              </span>
            ))}
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-display text-lg font-bold">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                  <Zap className="h-4 w-4" />
                </span>
                <span className="text-gradient">TaskHub</span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-slate-500">
                The smarter way to earn on your schedule. Join thousands of local Taskers today.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white transition-transform hover:-translate-y-0.5">
                  <Apple className="h-5 w-5" />
                  <span className="text-left leading-tight">
                    <span className="block text-[10px] opacity-70">Download on the</span>
                    <span className="block text-sm font-semibold">App Store</span>
                  </span>
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-white transition-transform hover:-translate-y-0.5">
                  <Play className="h-5 w-5" />
                  <span className="text-left leading-tight">
                    <span className="block text-[10px] opacity-70">Get it on</span>
                    <span className="block text-sm font-semibold">Google Play</span>
                  </span>
                </button>
              </div>
            </div>

            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <h4 className="font-semibold text-slate-900">{col.heading}</h4>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <AboutProjectNote />
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} TaskHub. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
              <span>Partnered with Leading Brands</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth popup */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialTab={authMode}
      />
    </main>
  );
}

/* ─────────────────── Sub-components & data ─────────────────── */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="px-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-medium text-slate-900">{q}</span>
        <ChevronDown
          className={
            "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 " +
            (open ? "rotate-180" : "")
          }
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-sm leading-relaxed text-slate-500">{a}</p>
      </motion.div>
    </div>
  );
}

function NextStepPanel({ onContinue, onLogout }: { onContinue: () => void; onLogout: () => void }) {
  return (
    <div className="w-full rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-xl shadow-slate-200/50 sm:p-9">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold text-slate-900">You&apos;re in!</h2>
      <p className="mx-auto mt-2 max-w-sm text-slate-500">
        Let&apos;s verify your identity and build your Tasker profile so you can start receiving
        nearby jobs.
      </p>
      <button
        onClick={onContinue}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50"
      >
        Continue to profile setup <ArrowRight className="h-4 w-4" />
      </button>
      <button
        onClick={onLogout}
        className="mt-4 text-sm text-slate-400 transition-colors hover:text-slate-600"
      >
        Log out
      </button>
    </div>
  );
}

const FLEX_CARDS = [
  {
    icon: Briefcase,
    title: "Be your own boss",
    desc: "Accept the jobs you want and skip the ones you don't. You're in full control of your workload.",
  },
  {
    icon: DollarSign,
    title: "Set your own rates",
    desc: "Price your skills competitively and watch your earnings grow as you build a stellar reputation.",
  },
  {
    icon: TrendingUp,
    title: "Grow your business",
    desc: "Unlock higher-paying categories and repeat clients as your ratings and completed jobs climb.",
  },
];

const STEPS = [
  { n: 1, icon: UserPlus, title: "Sign up", desc: "Create your free Tasker account in under two minutes." },
  { n: 2, icon: UserCog, title: "Build your profile", desc: "Showcase your skills, bio and the services you offer." },
  { n: 3, icon: ShieldCheck, title: "Verify eligibility", desc: "Complete a quick background and ID verification check." },
  { n: 4, icon: CreditCard, title: "Pay registration fee", desc: "A one-time, refundable fee activates your Tasker badge." },
  { n: 5, icon: CalendarClock, title: "Set your schedule", desc: "Choose the days and hours you're available to work." },
  { n: 6, icon: Rocket, title: "Start getting jobs", desc: "Receive nearby job requests and start earning right away." },
];

const FAQS = [
  {
    q: "How much does it cost to join TaskHub?",
    a: "Signing up is completely free. A small one-time registration fee is charged only when you activate your Tasker profile, and it helps keep the platform safe and high-quality.",
  },
  {
    q: "Do I need prior experience?",
    a: "Not necessarily. Many categories welcome beginners, while specialized tasks may require demonstrated skills. Your profile and ratings help you win the right jobs.",
  },
  {
    q: "When and how do I get paid?",
    a: "Payments are released to your linked bank account within 48 hours of a completed, approved job. You can track every payout in the Tasker dashboard.",
  },
  {
    q: "Can I choose my own hours?",
    a: "Absolutely. You set your weekly availability and decide which job requests to accept. Work as little or as much as you like.",
  },
  {
    q: "Which areas are supported?",
    a: "We currently operate across Colombo, Gampaha, Kandy, Negombo and Kalutara, with more regions launching every quarter.",
  },
];

const FOOTER_COLS = [
  { heading: "Company", links: ["About us", "Careers", "Press", "Blog"] },
  { heading: "Taskers", links: ["Become a Tasker", "Resources", "Community", "Success stories"] },
  { heading: "Support", links: ["Help Center", "Contact us", "Trust & Safety", "Terms"] },
];
