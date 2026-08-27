"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  User,
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  MapPin,
  FileText,
  Wrench,
  DollarSign,
  ImagePlus,
  Link2,
  BadgeCheck,
  LogOut,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useTaskerProfile } from "@/lib/taskerProfile";

const STEPS = ["Personal Info", "Skills & Rates", "Portfolio", "Verification"];

const SKILLS = [
  "Furniture Assembly",
  "Help Moving",
  "Electrical",
  "Smart Home Setup",
  "Cleaning",
  "Garage / Automotive",
  "Plumbing",
  "Painting",
];

const LOCATIONS = ["Colombo", "Gampaha", "Kandy", "Negombo", "Kalutara"];

export default function TaskerSetupPage() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const { setProfile } = useTaskerProfile();

  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [done, setDone] = React.useState(false);

  // Form state
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [area, setArea] = React.useState(LOCATIONS[0]);
  const [bio, setBio] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const [rate, setRate] = React.useState("");
  const [portfolio, setPortfolio] = React.useState<string[]>([]);
  const [exp, setExp] = React.useState("");
  const [socials, setSocials] = React.useState({ instagram: "", facebook: "", website: "" });
  const [agree, setAgree] = React.useState(false);
  const [idVerified, setIdVerified] = React.useState(false);

  const [urlInput, setUrlInput] = React.useState("");

  const toggleSkill = (s: string) =>
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPortfolio((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const addUrl = () => {
    if (urlInput.trim()) {
      setPortfolio((prev) => [...prev, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const removeImg = (i: number) => setPortfolio((prev) => prev.filter((_, idx) => idx !== i));

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Per-step mandatory-field validation. Empty optional fields never block.
  const validateStep = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!fullName.trim()) e.fullName = "Full name is required";
      if (!phone.trim()) e.phone = "Phone number is required";
    }
    if (s === 1) {
      if (skills.length === 0) e.skills = "Select at least one skill";
      if (!rate.trim() || Number(rate) <= 0) e.rate = "Enter a valid hourly rate";
    }
    if (s === 3) {
      if (!agree) e.agree = "You must accept the terms to finish";
    }
    return e;
  };

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (step < STEPS.length - 1) {
      setDir(1);
      setStep(step + 1);
    } else {
      // Persist the completed profile, then show success.
      setProfile({
        fullName,
        phone,
        area,
        bio,
        skills,
        rate,
        portfolio,
        experience: exp,
        socials,
        status: "live",
        email: user?.email ?? "",
      });
      setDone(true);
    }
  };
  const goBack = () => {
    if (step > 0) {
      setDir(-1);
      setStep(step - 1);
    }
  };
  const goTo = (i: number) => {
    if (i <= step) {
      setDir(i >= step ? 1 : -1);
      setStep(i);
    }
  };

  // Gate: require auth before showing the wizard.
  if (!isLoggedIn && !done) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-100">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-500">
            <BadgeCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Sign in required</h1>
          <p className="mt-2 text-sm text-slate-500">
            You need to create a TaskHub account before setting up your Tasker profile.
          </p>
          <Link
            href="/become-a-tasker"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30"
          >
            Back to sign up <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
            <Zap className="h-5 w-5" />
          </span>
          <span className="text-gradient">TaskHub</span>
        </Link>
        <div className="flex items-center gap-3">
          {user?.email && <span className="hidden text-sm text-slate-500 sm:block">{user.email}</span>}
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-100"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold text-slate-900">
                Your Tasker Profile is Live!
              </h1>
              <p className="mx-auto mt-3 max-w-md text-slate-500">
                Great work, {fullName.split(" ")[0] || "Tasker"}! Customers near you can now book your
                services. Complete verification to unlock even more job types.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/tasker/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    setDone(false);
                    setStep(0);
                  }}
                  className="text-sm text-slate-400 transition-colors hover:text-slate-600"
                >
                  Edit profile
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="wizard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-display text-3xl font-bold text-slate-900">Set up your Tasker profile</h1>
              <p className="mt-2 text-slate-500">Complete the steps below to start receiving jobs.</p>

              {/* Stepper */}
              <div className="mt-8 flex items-center">
                {STEPS.map((label, i) => {
                  const active = i === step;
                  const complete = i < step;
                  return (
                    <React.Fragment key={label}>
                      <button onClick={() => goTo(i)} className="flex flex-col items-center gap-2">
                        <span
                          className={
                            "grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-semibold transition-colors " +
                            (active
                              ? "border-primary bg-primary text-white"
                              : complete
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-slate-200 bg-white text-slate-400")
                          }
                        >
                          {complete ? <Check className="h-5 w-5" /> : i + 1}
                        </span>
                        <span
                          className={
                            "hidden text-xs font-medium sm:block " +
                            (active || complete ? "text-slate-700" : "text-slate-400")
                          }
                        >
                          {label}
                        </span>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div
                          className={
                            "mx-2 h-0.5 flex-1 rounded transition-colors " +
                            (complete ? "bg-primary" : "bg-slate-200")
                          }
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Step content */}
              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 sm:p-9">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -40 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {step === 0 && (
                      <div className="space-y-5">
                        <StepHeading icon={<Phone className="h-5 w-5" />} title="Personal details" />
                        <Field label="Full name" icon={<User className="h-4 w-4" />} error={errors.fullName}>
                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Perera"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Phone number" icon={<Phone className="h-4 w-4" />} error={errors.phone}>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+94 77 123 4567"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="City / Area" icon={<MapPin className="h-4 w-4" />}>
                          <select value={area} onChange={(e) => setArea(e.target.value)} className={inputCls}>
                            {LOCATIONS.map((l) => (
                              <option key={l}>{l}</option>
                            ))}
                            <option>Other</option>
                          </select>
                        </Field>
                        <Field label="Short bio (optional)" icon={<FileText className="h-4 w-4" />}>
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            placeholder="Tell customers about your experience and skills…"
                            className={inputCls + " resize-none"}
                          />
                        </Field>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-6">
                        <StepHeading icon={<Wrench className="h-5 w-5" />} title="Skills & expertise" />
                        <div className="flex flex-wrap gap-3">
                          {SKILLS.map((s) => {
                            const on = skills.includes(s);
                            return (
                              <button
                                key={s}
                                onClick={() => toggleSkill(s)}
                                className={
                                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
                                  (on
                                    ? "border-primary bg-primary text-white shadow-sm"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-primary")
                                }
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                        {errors.skills && (
                          <p className="text-xs font-medium text-rose-500">{errors.skills}</p>
                        )}
                        <Field label="Desired hourly rate" icon={<DollarSign className="h-4 w-4" />} error={errors.rate}>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                            <input
                              type="number"
                              min={0}
                              value={rate}
                              onChange={(e) => setRate(e.target.value)}
                              placeholder="45"
                              className={inputCls + " pl-8"}
                            />
                          </div>
                        </Field>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <StepHeading icon={<ImagePlus className="h-5 w-5" />} title="Portfolio & past work" />
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-primary">
                          <Upload className="h-7 w-7 text-slate-400" />
                          <span className="text-sm font-medium text-slate-600">
                            Drag & drop photos, or click to upload
                          </span>
                          <span className="text-xs text-slate-400">PNG / JPG up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => onFiles(e.target.files)}
                          />
                        </label>

                        {portfolio.length > 0 && (
                          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {portfolio.map((src, i) => (
                              <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt="portfolio" className="h-full w-full object-cover" />
                                <button
                                  onClick={() => removeImg(i)}
                                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="…or paste an image URL"
                            className={inputCls + " flex-1"}
                          />
                          <button
                            onClick={addUrl}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            Add
                          </button>
                        </div>

                        <Field label="Previous experience" icon={<FileText className="h-4 w-4" />}>
                          <textarea
                            value={exp}
                            onChange={(e) => setExp(e.target.value)}
                            rows={3}
                            placeholder="e.g. 3 years as a freelance mover…"
                            className={inputCls + " resize-none"}
                          />
                        </Field>

                        <div className="grid gap-3 sm:grid-cols-3">
                          {(["instagram", "facebook", "website"] as const).map((k) => (
                            <div key={k}>
                              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 capitalize">
                                <Link2 className="h-3.5 w-3.5" /> {k}
                              </label>
                              <input
                                value={socials[k]}
                                onChange={(e) => setSocials((p) => ({ ...p, [k]: e.target.value }))}
                                placeholder="https://"
                                className={inputCls}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <StepHeading icon={<BadgeCheck className="h-5 w-5" />} title="Verification" />
                        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                          {[
                            "Identity check (government ID)",
                            "Background screening",
                            "Payment method on file",
                          ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-primary shadow-sm">
                                <Check className="h-4 w-4" />
                              </span>
                              {item}
                            </div>
                          ))}
                        </div>

                        <Field label="Verify with an ID (optional)" icon={<BadgeCheck className="h-4 w-4" />}>
                          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500 transition-colors hover:border-primary">
                            <Upload className="h-4 w-4" />
                            Upload ID document
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={() => setIdVerified(true)}
                            />
                          </label>
                          {idVerified && (
                            <p className="mt-2 text-xs font-medium text-emerald-600">
                              ID received — our team will review it shortly.
                            </p>
                          )}
                        </Field>

                        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4">
                          <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-0.5 h-5 w-5 accent-primary"
                          />
                          <span className="text-sm text-slate-600">
                            I agree to the TaskHub Tasker Terms, Code of Conduct, and acknowledge the
                            one-time registration fee.
                          </span>
                        </label>
                        {errors.agree && (
                          <p className="text-xs font-medium text-rose-500">{errors.agree}</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Nav buttons */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={goBack}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={goNext}
                  disabled={step === 3 && !agree}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step === STEPS.length - 1 ? "Save & Finish" : "Save & Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

/* Shared classes */
const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function StepHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span>
      <h2 className="font-display text-xl font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
