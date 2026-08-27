"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CircleDollarSign,
  Briefcase,
  Star,
  Timer,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Wrench,
  ImagePlus,
  BadgeCheck,
  Link2,
  Pencil,
  Circle,
  TrendingUp,
  TrendingDown,
  Check,
  X,
  CalendarClock,
  User,
  Sparkles,
  ArrowRight,
  Home,
  LogOut,
} from "lucide-react";
import { useTaskerProfile } from "@/lib/taskerProfile";
import { useAuth } from "@/lib/useAuth";

type Lead = {
  id: string;
  title: string;
  detail: string;
  location: string;
  pay: number;
  skill: string;
  posted: string;
};

type ActiveJob = {
  id: string;
  title: string;
  client: string;
  location: string;
  date: string;
  pay: number;
};

const SEED_LEADS: Lead[] = [
  { id: "l1", title: "Furniture Assembly", detail: "IKEA PAX wardrobe assembly", location: "Colombo 03", pay: 80, skill: "Furniture Assembly", posted: "2 min ago" },
  { id: "l2", title: "Help Moving", detail: "Studio apartment move (2nd floor)", location: "Kandy", pay: 120, skill: "Help Moving", posted: "10 min ago" },
  { id: "l3", title: "Smart Home Setup", detail: "Install smart bulbs & hub", location: "Colombo 07", pay: 65, skill: "Smart Home Setup", posted: "25 min ago" },
];

const SEED_ACTIVE: ActiveJob[] = [
  { id: "a1", title: "Furniture Assembly", client: "Nimali F.", location: "Colombo 05", date: "Today · 2:00 PM", pay: 80 },
  { id: "a2", title: "Electrical Repair", client: "Ashan W.", location: "Gampaha", date: "Tomorrow · 10:00 AM", pay: 95 },
];

const STATS = [
  { label: "Total Earnings", value: "$1,240", sub: "this month", delta: "+12.5%", up: true, icon: CircleDollarSign },
  { label: "Completed Jobs", value: "34", sub: "all time", delta: "+8", up: true, icon: Briefcase },
  { label: "Average Rating", value: "4.9", sub: "/ 5", delta: "+0.2", up: true, icon: Star },
  { label: "Response Rate", value: "98%", sub: "last 30d", delta: "-1%", up: false, icon: Timer },
];

export default function TaskerDashboardPage() {
  const profile = useTaskerProfile((s) => s.profile);
  const setStatus = useTaskerProfile((s) => s.setStatus);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [leads, setLeads] = React.useState<Lead[]>(SEED_LEADS);
  const [active, setActive] = React.useState<ActiveJob[]>(SEED_ACTIVE);

  if (!mounted) return <main className="min-h-screen bg-slate-50" />;

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-100">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-500">
            <BadgeCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">No profile yet</h1>
          <p className="mt-2 text-sm text-slate-500">
            You haven&apos;t completed your Tasker setup. Finish it to unlock your dashboard.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/become-a-tasker/setup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30"
            >
              Set up my profile <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <Home className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </main>
    );
  }

  const firstName = profile.fullName.split(" ")[0] || "Tasker";
  const initials = profile.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const isLive = profile.status === "live";

  const toggleAvailability = () => setStatus(isLive ? "offline" : "live");

  const acceptLead = (lead: Lead) => {
    setActive((prev) => [
      { id: lead.id, title: lead.title, client: "New customer", location: lead.location, date: "Today · 4:00 PM", pay: lead.pay },
      ...prev,
    ]);
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
  };
  const declineLead = (id: string) => setLeads((prev) => prev.filter((l) => l.id !== id));

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {/* Top nav */}
        <header className="flex items-center justify-between pb-2">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-gradient">TaskHub</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              href="/become-a-tasker/setup"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 sm:flex"
            >
              <Pencil className="h-4 w-4" /> Edit profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </header>

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900">
                Welcome back, {firstName} <span className="ml-1">👋</span>
              </h1>
              <p className="text-sm text-slate-500">{profile.email ?? profile.phone}</p>
            </div>
          </div>

          {/* Availability toggle */}
          <button
            onClick={toggleAvailability}
            className={
              "flex items-center gap-3 rounded-2xl border px-4 py-2.5 transition-colors " +
              (isLive ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50")
            }
          >
            <Circle className={"h-3 w-3 fill-current " + (isLive ? "text-emerald-500" : "text-slate-400")} />
            <span className={"text-sm font-semibold " + (isLive ? "text-emerald-700" : "text-slate-500")}>
              {isLive ? "Available for Jobs" : "Offline"}
            </span>
            <span
              className={
                "relative h-6 w-11 rounded-full transition-colors " + (isLive ? "bg-emerald-500" : "bg-slate-300")
              }
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={"absolute top-0.5 h-5 w-5 rounded-full bg-white shadow " + (isLive ? "left-[22px]" : "left-0.5")}
              />
            </span>
          </button>
        </motion.div>

        {/* Stats grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span
                  className={
                    "flex items-center gap-0.5 text-xs font-semibold " +
                    (s.up ? "text-emerald-600" : "text-rose-500")
                  }
                >
                  {s.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {s.delta}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Live job requests */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                  <Sparkles className="h-5 w-5 text-primary" /> Live Job Requests
                </h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {leads.length} new
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {leads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm">
                          <Wrench className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{lead.title}</p>
                          <p className="text-sm text-slate-500">{lead.detail}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" /> {lead.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" /> Est. ${lead.pay}
                            </span>
                            <span>{lead.posted}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => acceptLead(lead)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-primary/40"
                        >
                          <Check className="h-4 w-4" /> Accept
                        </button>
                        <button
                          onClick={() => declineLead(lead.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
                        >
                          <X className="h-4 w-4" /> Decline
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {leads.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                    No new requests right now — great job staying on top of things! 🎉
                  </p>
                )}
              </div>
            </section>

            {/* Active schedule */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <CalendarClock className="h-5 w-5 text-primary" /> Active Schedule
              </h2>
              <div className="mt-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {active.map((job) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                          <Briefcase className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{job.title}</p>
                          <p className="text-sm text-slate-500">
                            {job.client} · {job.location}
                          </p>
                          <p className="text-xs text-slate-400">{job.date}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <DollarSign className="h-4 w-4 text-primary" /> {job.pay}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Right column — profile & portfolio widget */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">Your Profile</h2>
                <Link
                  href="/become-a-tasker/setup"
                  className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                  {initials}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{profile.fullName}</p>
                  <p className="text-sm text-slate-500">{profile.area}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs font-medium text-slate-500">Hourly rate</p>
                <p className="font-display text-2xl font-bold text-slate-900">
                  ${profile.rate || "—"}
                  <span className="text-sm font-normal text-slate-400">/hr</span>
                </p>
              </div>

              {profile.bio && <p className="mt-4 text-sm leading-relaxed text-slate-600">{profile.bio}</p>}

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((s) => (
                      <span key={s} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No skills added.</span>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <ImagePlus className="h-3.5 w-3.5" /> Portfolio
                </p>
                {profile.portfolio.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {profile.portfolio.slice(0, 6).map((src, i) => (
                      <div key={i} className="aspect-square overflow-hidden rounded-xl border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="portfolio" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center text-xs text-slate-400">
                    No projects yet.
                  </p>
                )}
              </div>

              {(profile.socials.instagram || profile.socials.facebook || profile.socials.website) && (
                <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  {profile.socials.instagram && <span className="flex items-center gap-1"><Link2 className="h-4 w-4" /> IG</span>}
                  {profile.socials.facebook && <span className="flex items-center gap-1"><Link2 className="h-4 w-4" /> FB</span>}
                  {profile.socials.website && <span className="flex items-center gap-1"><Link2 className="h-4 w-4" /> Web</span>}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Phone className="h-4 w-4 text-primary" /> {profile.phone}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
