"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Clock,
  CalendarDays,
  Zap,
  Tag,
  ArrowRight,
  ArrowLeft,
  PartyPopper,
  Loader2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getIcon } from "@/components/icon-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatLKR, cn } from "@/lib/utils";
import { PROMO_CODES } from "@/lib/constants";
import type { PriceQuote } from "@/lib/types";

const STEPS = ["Customize", "Schedule", "Price", "Confirm"];

/**
 * Dynamic multi-step Instant Booking drawer.
 *  - Slides in from the right with a frosted overlay (Framer Motion).
 *  - Step 1: sub-service + add-on options, duration & urgent toggle.
 *  - Step 2: interactive date & time-slot picker with availability.
 *  - Step 3: hits POST /api/services for a live itemised price quote + promo.
 *  - Step 4: mock checkout with an animated success checkmark.
 */
export function BookingModal() {
  const {
    isBookingOpen,
    bookingService,
    step,
    closeBooking,
    nextStep,
    prevStep,
    hours,
    setHours,
    urgent,
    toggleUrgent,
    selectedOptions,
    toggleOption,
    date,
    setDate,
    time,
    setTime,
    promo,
    setPromo,
    quote,
    setQuote,
    isCalculating,
    setCalculating,
    resetBooking,
  } = useAppStore();

  const [paid, setPaid] = React.useState(false);

  // Lock body scroll while the drawer is open.
  React.useEffect(() => {
    if (isBookingOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset transient success state shortly after closing.
      const t = setTimeout(() => setPaid(false), 300);
      return () => clearTimeout(t);
    }
  }, [isBookingOpen]);

  // Fetch a live quote whenever we reach Step 3.
  React.useEffect(() => {
    if (!isBookingOpen || step !== 3 || !bookingService) return;
    const controller = new AbortController();
    setCalculating(true);
    fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: bookingService.id,
        hours,
        urgent,
        promo,
        options: selectedOptions,
      }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: PriceQuote) => setQuote(data))
      .catch(() => setQuote(null))
      .finally(() => setCalculating(false));
    return () => controller.abort();
  }, [isBookingOpen, step, bookingService, hours, urgent, promo, selectedOptions, setCalculating, setQuote]);

  if (!bookingService) return null;
  const Icon = getIcon(bookingService.icon);

  const handleConfirm = () => {
    setCalculating(true);
    // Simulate a network round-trip for the mock checkout.
    setTimeout(() => {
      setCalculating(false);
      setPaid(true);
    }, 1100);
  };

  const handleClose = () => {
    closeBooking();
    // Let the exit animation play before wiping the service.
    setTimeout(() => resetBooking(), 250);
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="glass-strong absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/15"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                    bookingService.gradient
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Booking</p>
                  <h3 className="font-display text-lg font-bold">
                    {bookingService.name}
                  </h3>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1 px-5 py-4">
              {STEPS.map((label, i) => {
                const n = (i + 1) as 1 | 2 | 3 | 4;
                const done = n < step;
                const active = n === step;
                return (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-colors",
                          done && "bg-primary text-primary-foreground",
                          active && "bg-primary/20 text-primary ring-2 ring-primary",
                          !done && !active && "bg-secondary text-muted-foreground"
                        )}
                      >
                        {done ? <Check className="h-4 w-4" /> : n}
                      </div>
                      <span className="hidden text-[10px] text-muted-foreground sm:block">
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1 rounded-full transition-colors",
                          n < step ? "bg-primary" : "bg-secondary"
                        )}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 1 && (
                    <StepCustomize
                      hours={hours}
                      setHours={setHours}
                      urgent={urgent}
                      toggleUrgent={toggleUrgent}
                      options={bookingService.options}
                      selectedOptions={selectedOptions}
                      toggleOption={toggleOption}
                    />
                  )}
                  {step === 2 && (
                    <StepSchedule
                      date={date}
                      setDate={setDate}
                      time={time}
                      setTime={setTime}
                    />
                  )}
                  {step === 3 && (
                    <StepPrice
                      quote={quote}
                      isCalculating={isCalculating}
                      promo={promo}
                      setPromo={setPromo}
                      validPromo={promo.trim().toUpperCase() in PROMO_CODES}
                    />
                  )}
                  {step === 4 && <StepConfirm paid={paid} serviceName={bookingService.name} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer controls */}
            {step < 4 && (
              <div className="flex items-center justify-between gap-3 border-t border-white/10 p-5">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={cn(step === 1 && "invisible")}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button variant="gradient" onClick={nextStep}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            {step === 4 && (
              <div className="border-t border-white/10 p-5">
                {!paid ? (
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={handleConfirm}
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Confirm & Pay {quote ? formatLKR(quote.total) : ""}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleClose}
                  >
                    Done
                  </Button>
                )}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------- Step 1: Customize ---------------------------- */
function StepCustomize({
  hours,
  setHours,
  urgent,
  toggleUrgent,
  options,
  selectedOptions,
  toggleOption,
}: {
  hours: number;
  setHours: (n: number) => void;
  urgent: boolean;
  toggleUrgent: () => void;
  options: { id: string; name: string; price: number }[];
  selectedOptions: string[];
  toggleOption: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Estimated duration</label>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={8}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-[hsl(var(--primary))]"
          />
          <Badge variant="outline" className="shrink-0">
            <Clock className="h-3.5 w-3.5" /> {hours}h
          </Badge>
        </div>
      </div>

      <button
        onClick={toggleUrgent}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors",
          urgent
            ? "border-primary/50 bg-primary/10"
            : "border-border bg-secondary/40"
        )}
      >
        <span className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <span>
            <span className="block font-medium">Urgent (same-day)</span>
            <span className="text-xs text-muted-foreground">
              +25% priority fee for faster matching
            </span>
          </span>
        </span>
        <span
          className={cn(
            "h-6 w-11 rounded-full p-1 transition-colors",
            urgent ? "bg-primary" : "bg-muted"
          )}
        >
          <motion.span
            layout
            className="block h-4 w-4 rounded-full bg-white"
            style={{ marginLeft: urgent ? "auto" : 0 }}
          />
        </span>
      </button>

      <div>
        <label className="text-sm font-medium">Add-ons</label>
        <div className="mt-3 space-y-2">
          {options.map((opt) => {
            const checked = selectedOptions.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border p-3 text-left text-sm transition-colors",
                  checked
                    ? "border-accent/50 bg-accent/10"
                    : "border-border bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-md border",
                      checked ? "border-accent bg-accent text-white" : "border-muted-foreground"
                    )}
                  >
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </span>
                  {opt.name}
                </span>
                <span className="text-muted-foreground">+{formatLKR(opt.price)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Step 2: Schedule ---------------------------- */
function StepSchedule({
  date,
  setDate,
  time,
  setTime,
}: {
  date: string | null;
  setDate: (d: string) => void;
  time: string | null;
  setTime: (t: string) => void;
}) {
  // Generate the next 7 days.
  const days = React.useMemo(() => {
    const out: { key: string; day: string; date: string }[] = [];
    const fmt = new Intl.DateTimeFormat("en-LK", { weekday: "short", day: "numeric", month: "short" });
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        key: d.toISOString().slice(0, 10),
        day: fmt.format(d),
        date: d.toISOString().slice(0, 10),
      });
    }
    return out;
  }, []);

  const slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="h-4 w-4 text-accent" /> Pick a date
        </label>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {days.map((d) => (
            <button
              key={d.key}
              onClick={() => setDate(d.date)}
              className={cn(
                "rounded-2xl border p-3 text-center text-xs transition-colors",
                date === d.date
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <span className="block font-medium">{d.day.split(" ")[0]}</span>
              <span className="block text-base font-bold">{d.day.split(" ")[1]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-accent" /> Pick a time slot
        </label>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {slots.map((s, i) => {
            // Pseudo-random but stable availability per slot.
            const available = (i * 7 + 3) % 5 !== 0;
            return (
              <button
                key={s}
                disabled={!available}
                onClick={() => setTime(s)}
                className={cn(
                  "rounded-2xl border p-3 text-sm transition-colors",
                  time === s
                    ? "border-primary bg-primary/15 text-primary"
                    : available
                    ? "border-border bg-secondary/30 hover:bg-secondary/50"
                    : "cursor-not-allowed border-border bg-secondary/10 text-muted-foreground/50 line-through"
                )}
              >
                {s}
                {available && time !== s && (
                  <span className="block text-[10px] text-emerald-500">available</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {date && time && (
        <Badge variant="glow" className="w-full justify-center py-2">
          <Check className="h-3.5 w-3.5" /> {date} at {time}
        </Badge>
      )}
    </div>
  );
}

/* ---------------------------- Step 3: Price ---------------------------- */
function StepPrice({
  quote,
  isCalculating,
  promo,
  setPromo,
  validPromo,
}: {
  quote: PriceQuote | null;
  isCalculating: boolean;
  promo: string;
  setPromo: (p: string) => void;
  validPromo: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-secondary/40 p-5">
        {isCalculating || !quote ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Calculating live quote…
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <Row label="Base rate" value={formatLKR(quote.base)} />
            <Row label="Add-ons" value={formatLKR(quote.optionsTotal)} />
            {quote.urgentFee > 0 && (
              <Row label="Urgent fee (25%)" value={formatLKR(quote.urgentFee)} accent />
            )}
            {quote.discount > 0 && (
              <Row label="Promo discount" value={"−" + formatLKR(quote.discount)} success />
            )}
            <div className="my-2 h-px bg-white/10" />
            <div className="flex items-center justify-between font-display text-lg font-bold">
              <span>Total</span>
              <span className="text-gradient">{formatLKR(quote.total)}</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <Tag className="h-4 w-4 text-accent" /> Promo code
        </label>
        <div className="mt-2 flex gap-2">
          <Input
            value={promo}
            onChange={(e) => setPromo(e.target.value.toUpperCase())}
            placeholder="SAVE10"
            className="uppercase"
          />
        </div>
        {promo && (
          <p
            className={cn(
              "mt-2 text-xs",
              validPromo ? "text-emerald-500" : "text-muted-foreground"
            )}
          >
            {validPromo
              ? "Promo applied — discount will refresh on next calc."
              : "Invalid code. Try SAVE10, WELCOME20 or TASKHUB15."}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  success,
}: {
  label: string;
  value: string;
  accent?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-medium",
          accent && "text-amber-500",
          success && "text-emerald-500"
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------------------------- Step 4: Confirm ---------------------------- */
function StepConfirm({ paid, serviceName }: { paid: boolean; serviceName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="relative grid h-24 w-24 place-items-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-500/20"
          animate={{ scale: paid ? [1, 1.4, 1] : 1, opacity: paid ? [0.6, 0, 0.6] : 0.4 }}
          transition={{ repeat: paid ? Infinity : 0, duration: 1.6 }}
        />
        <svg viewBox="0 0 52 52" className="h-24 w-24">
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: paid ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M14 27l8 8 16-16"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: paid ? 1 : 0 }}
            transition={{ duration: 0.5, delay: paid ? 0.3 : 0 }}
          />
        </svg>
      </div>
      <h3 className="mt-6 font-display text-2xl font-bold">
        {paid ? "Booking confirmed!" : "Review & confirm"}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {paid ? (
          <>
            Your <b>{serviceName}</b> request is live. A nearby Tasker will be
            assigned shortly.
          </>
        ) : (
          <>Tap “Confirm & Pay” to lock in your Tasker and schedule.</>
        )}
      </p>
      {paid && (
        <Badge variant="glow" className="mt-4">
          <PartyPopper className="h-3.5 w-3.5" /> Thank you for using TaskHub 2.0
        </Badge>
      )}
    </div>
  );
}
