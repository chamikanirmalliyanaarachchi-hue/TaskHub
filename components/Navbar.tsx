"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Zap,
  Menu,
  X,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { LOCATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MagnetButton } from "@/components/MagnetButton";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/lib/useAuth";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how" },
  { label: "Reviews", href: "#reviews" },
  { label: "Become a Tasker", href: "#tasker" },
];

/**
 * Clean, always-light sticky navbar with dynamic Firebase auth state.
 *  - White frosted surface (no dark glass) with a hairline border + soft shadow.
 *  - Quick location selector dropdown (light styled).
 *  - "Instant Book" CTA uses the magnet (haptic) button for a premium feel.
 *  - Right cluster is auth-aware:
 *      · logged out → "Sign In" (opens Log In modal) + "Get Started" (sign-up modal)
 *      · logged in  → avatar pill that toggles a glassmorphic profile dropdown
 *        (Dashboard / My Jobs / Settings + Log Out), closing on outside click.
 *  - No theme toggle — the product is always light mode.
 */
export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [locOpen, setLocOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"signup" | "login">("signup");

  const location = useAppStore((s) => s.location);
  const setLocation = useAppStore((s) => s.setLocation);
  const openBooking = useAppStore((s) => s.openBooking);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);

  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click / Escape.
  React.useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleInstantBook = () => {
    setSelectedCategory("All");
    import("@/lib/data").then(({ SERVICES }) => {
      const popular = SERVICES.find((s) => s.popular) ?? SERVICES[0];
      openBooking(popular);
    });
  };

  const openAuth = (mode: "signup" | "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };
  const handleAuthSuccess = () => {
    setAuthOpen(false);
    router.push("/become-a-tasker/setup");
  };
  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.push("/");
  };

  const fullName = user?.name || user?.email?.split("@")[0] || "Tasker";
  const firstName = user?.name
    ? user.name.split(" ")[0]
    : user?.email?.split("@")[0] || "Tasker";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-300",
            scrolled
              ? "border border-slate-100 bg-white/80 shadow-lg shadow-slate-200/50 backdrop-blur-xl"
              : "border border-transparent bg-white/60 backdrop-blur-md"
          )}
        >
          {/* Brand */}
          <a href="#" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg glow">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-gradient">TaskHub</span>
            <span className="text-xs font-medium text-slate-400">2.0</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {/* Location selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLocOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <MapPin className="h-4 w-4 text-accent" />
                <span className="font-medium">{location}</span>
                <ChevronDown
                  className={cn("h-4 w-4 text-slate-400 transition-transform", locOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {locOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50"
                  >
                    {LOCATIONS.map((loc) => (
                      <li key={loc}>
                        <button
                          onClick={() => {
                            setLocation(loc);
                            setLocOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-slate-50",
                            loc === location && "font-medium text-primary"
                          )}
                        >
                          <Globe className="h-4 w-4 text-slate-400" />
                          {loc}
                          {loc === location && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Instant Book CTA (magnet) */}
            <MagnetButton
              onClick={handleInstantBook}
              className="hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 sm:inline-flex"
            >
              <Zap className="h-4 w-4" />
              Instant Book
            </MagnetButton>

            {/* Auth-aware section */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <UserAvatar src={user?.photo} name={user?.name} email={user?.email} className="h-8 w-8 text-xs" />
                  <span className="hidden text-sm font-medium text-slate-700 sm:block">{firstName}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 text-slate-400 transition-transform", profileOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-2 shadow-2xl shadow-slate-300/50 backdrop-blur-xl"
                    >
                      {/* User info header */}
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-3">
                        <UserAvatar src={user?.photo} name={user?.name} email={user?.email} className="h-10 w-10 text-sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{fullName}</p>
                          <p className="truncate text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </div>

                      <div className="mt-1 space-y-0.5">
                        <DropdownItem
                          icon={<LayoutDashboard className="h-4 w-4" />}
                          label="Dashboard"
                          href="/tasker/dashboard"
                          onClick={() => setProfileOpen(false)}
                        />
                        <DropdownItem
                          icon={<Briefcase className="h-4 w-4" />}
                          label="My Jobs / Leads"
                          href="/tasker/dashboard"
                          onClick={() => setProfileOpen(false)}
                        />
                        <DropdownItem
                          icon={<Settings className="h-4 w-4" />}
                          label="Settings / Edit Profile"
                          href="/become-a-tasker/setup"
                          onClick={() => setProfileOpen(false)}
                        />
                      </div>

                      <div className="my-1 h-px bg-slate-100" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:inline-flex"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-600 hover:bg-slate-50 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-100 bg-white p-3 shadow-xl shadow-slate-200/50 lg:hidden"
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}

                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        href="/tasker/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" /> Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="flex flex-col gap-2 px-2 pt-2">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openAuth("login");
                      }}
                      className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Sign In
                    </button>
                    <MagnetButton
                      onClick={() => {
                        setMenuOpen(false);
                        openAuth("signup");
                      }}
                      className="w-full rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30"
                    >
                      <Zap className="h-4 w-4" /> Get Started
                    </MagnetButton>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Auth popup — self-contained so the landing page can sign users in. */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialTab={authMode}
      />
    </>
  );
}

/* ─────────────────── Small building blocks ─────────────────── */
function DropdownItem({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}
