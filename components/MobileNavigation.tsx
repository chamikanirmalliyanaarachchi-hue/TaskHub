"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, CalendarClock, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * MobileNavigation (light mode)
 * ----------------------------------------------------------------------------
 * Fixed, thumb-friendly bottom navigation (mobile only — hidden on md+).
 *  - White frosted surface with hairline border + soft shadow.
 *  - Home · Search · Bookings · Profile, with an animated active pill.
 *  - Centre Search action is elevated & glowing, opening the quick-search sheet.
 */
type NavKey = "home" | "bookings" | "profile";

const ITEMS: { key: NavKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "bookings", label: "Bookings", icon: CalendarClock },
  { key: "profile", label: "Profile", icon: User },
];

export function MobileNavigation() {
  const [active, setActive] = React.useState<NavKey>("home");
  const openSearch = useAppStore((s) => s.openSearch);

  const scrollTo = (sel: string) =>
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });

  const handle = (key: NavKey) => {
    setActive(key);
    if (key === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    if (key === "bookings") scrollTo("#services");
    if (key === "profile") scrollTo("#reviews");
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.2 }}
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-3 mb-3 flex items-center justify-between gap-1 rounded-2xl border border-slate-100 bg-white/80 px-3 py-2 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <NavItem item={ITEMS[0]} isActive={active === "home"} onClick={() => handle("home")} />

        {/* Centre Search — opens the quick-search bottom-sheet */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={openSearch}
          aria-label="Search"
          className="relative -my-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/40"
        >
          <Search className="h-6 w-6" />
          <span className="absolute -inset-1 rounded-2xl border border-primary/30" />
        </motion.button>

        <NavItem item={ITEMS[1]} isActive={active === "bookings"} onClick={() => handle("bookings")} />
        <NavItem item={ITEMS[2]} isActive={active === "profile"} onClick={() => handle("profile")} />
      </div>
    </motion.nav>
  );
}

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: { key: NavKey; label: string; icon: typeof Home };
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2"
      aria-label={item.label}
    >
      {isActive && (
        <motion.span
          layoutId="navActive"
          className="absolute inset-0 rounded-xl bg-primary/10"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <motion.span whileTap={{ scale: 0.85 }} className="relative">
        <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-slate-400")} />
      </motion.span>
      <span
        className={cn(
          "relative text-[10px] font-medium transition-colors",
          isActive ? "text-primary" : "text-slate-400"
        )}
      >
        {item.label}
      </span>
    </button>
  );
}
