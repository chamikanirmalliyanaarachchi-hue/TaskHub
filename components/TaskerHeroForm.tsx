"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * TaskerHeroForm
 * ----------------------------------------------------------------------------
 * The interactive right-hand panel of the "Become a Tasker" hero.
 *  - Area + Category selectors (custom, accessible dropdowns).
 *  - A live, animated hourly-rate readout that updates with the category.
 *  - Vibrant full-width CTA + a secondary sign-in link.
 *
 * Currency note: the brief references "$45/hr" (TaskRabbit-style). Swap the
 * `formatRate` helper for `formatLKR` from "@/lib/utils" to use LKR instead.
 */
const AREAS = [
  { value: "colombo", label: "Colombo" },
  { value: "gampaha", label: "Gampaha" },
  { value: "kandy", label: "Kandy" },
  { value: "negombo", label: "Negombo" },
  { value: "kalutara", label: "Kalutara" },
];

const CATEGORIES = [
  { value: "moving", label: "Help Moving", rate: 45 },
  { value: "garage", label: "Garage Services", rate: 52 },
  { value: "furniture", label: "Furniture Assembly", rate: 40 },
  { value: "cleaning", label: "Home Cleaning", rate: 32 },
  { value: "smart", label: "Smart Home Setup", rate: 58 },
];

const formatRate = (n: number) => `$${n}`;

export function TaskerHeroForm({
  onGetStarted,
  isLoggedIn = false,
  userEmail,
  onSignIn,
}: {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onSignIn: () => void;
}) {
  const [area, setArea] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string>("moving");

  const activeCategory = CATEGORIES.find((c) => c.value === category)!;
  const rate = activeCategory.rate;

  return (
    <div className="w-full rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Earn money your way
      </h1>
      <p className="mt-2 text-slate-500">
        See how much you can make tasking on TaskHub.
      </p>

      <div className="mt-7 space-y-4">
        <Field label="Select your area">
          <Dropdown
            placeholder="Choose your area"
            value={area}
            options={AREAS}
            onChange={setArea}
          />
        </Field>

        <Field label="Choose a Category">
          <Dropdown
            placeholder="Choose a category"
            value={category}
            options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            onChange={setCategory}
          />
        </Field>
      </div>

      {/* Dynamic wage display */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-500">Estimated earnings</span>
        <span className="ml-auto flex items-baseline gap-1">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={rate}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-display text-3xl font-bold text-slate-900"
            >
              {formatRate(rate)}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm font-medium text-slate-500">/hr</span>
        </span>
        <span
          title={`Average ${activeCategory.label} rate in ${
            AREAS.find((a) => a.value === area)?.label ?? "your area"
          }.`}
          className="cursor-help"
        >
          <Info className="h-4 w-4 text-slate-300" />
        </span>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGetStarted}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50"
      >
        Get started <ArrowRight className="h-4 w-4" />
      </motion.button>

      {isLoggedIn ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm text-slate-600">
          {userEmail ? (
            <span>
              Signed in as <span className="font-medium text-slate-800">{userEmail}</span>
            </span>
          ) : (
            <span>You&apos;re signed in</span>
          )}{" "}
          <Link href="/tasker/dashboard" className="font-medium text-primary hover:underline">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignIn}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}

/* ----------------------------- Small building blocks ----------------------------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function Dropdown({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm shadow-sm transition-colors hover:border-slate-300"
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-slate-50",
                    opt.value === value && "font-medium text-primary"
                  )}
                >
                  {opt.label}
                  {opt.value === value && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
