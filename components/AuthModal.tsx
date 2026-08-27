"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, Apple, Zap, AlertCircle, Settings2 } from "lucide-react";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  isFirebaseConfigured,
  missingFirebaseKeys,
} from "@/lib/firebase";

/**
 * AuthModal — clean, light-mode Sign Up / Log In popup backed by Firebase.
 *  - If Firebase env vars are missing, shows a friendly setup helper instead
 *    of crashing or throwing on sign-in.
 *  - When configured: prominent "Continue with Google" (signInWithPopup) +
 *    email/password flow, with specific Firebase error messages.
 */
export function AuthModal({
  open,
  onClose,
  onSuccess,
  initialTab = "signup",
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTab?: "signup" | "login";
}) {
  const [tab, setTab] = React.useState<"signup" | "login">(initialTab);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setError(null);
      setLoading(false);
    }
  }, [open]);

  // Open in the requested tab (e.g. "login" when triggered from a Sign in link).
  React.useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const finish = () => {
    setLoading(false);
    setEmail("");
    setPassword("");
    setName("");
    onSuccess();
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      finish();
    } catch (err) {
      setLoading(false);
      setError(prettyError(err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === "signup") {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      finish();
    } catch (err) {
      setLoading(false);
      setError(prettyError(err));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-2xl shadow-slate-300/50"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                <Zap className="h-4 w-4" />
              </span>
              <span className="text-gradient">TaskHub</span>
            </div>

            {/* Configured → full auth UI. Unconfigured → setup helper. */}
            {isFirebaseConfigured ? (
              <ConfiguredView
                tab={tab}
                setTab={setTab}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                loading={loading}
                error={error}
                onGoogle={handleGoogle}
                onSubmit={handleSubmit}
              />
            ) : (
              <ConfigHelper missing={missingFirebaseKeys} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────── Configured auth view ─────────────────── */
function ConfiguredView({
  tab,
  setTab,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  loading,
  error,
  onGoogle,
  onSubmit,
}: {
  tab: "signup" | "login";
  setTab: (t: "signup" | "login") => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  loading: boolean;
  error: string | null;
  onGoogle: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <>
      <p className="mt-3 text-sm text-slate-500">
        {tab === "signup"
          ? "Create your Tasker account to start earning."
          : "Welcome back — sign in to continue."}
      </p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        {(["signup", "login"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
            }}
            className={
              "rounded-xl py-2 text-sm font-medium transition-colors " +
              (tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")
            }
          >
            {t === "signup" ? "Sign Up" : "Log In"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        {tab === "signup" && (
          <AuthField
            icon={<UserIcon className="h-4 w-4" />}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={setName}
          />
        )}
        <AuthField
          icon={<Mail className="h-4 w-4" />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={setEmail}
        />
        <AuthField
          icon={<Lock className="h-4 w-4" />}
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50 disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : tab === "signup"
              ? "Create account"
              : "Log in"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-100" />
        <span>or</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* Social — Google is the primary, Firebase-backed path */}
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={onGoogle}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>
        {/* TODO: enable the Firebase Apple provider, then wire this up. */}
        <button
          onClick={onGoogle}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          <Apple className="h-5 w-5" />
          Continue with Apple
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        By continuing you agree to our Terms & Privacy Policy.
      </p>
    </>
  );
}

/* ─────────────────── Setup helper (unconfigured) ─────────────────── */
function ConfigHelper({ missing }: { missing: string[] }) {
  return (
    <div className="mt-4">
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-700">
        <Settings2 className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Firebase setup required</p>
          <p className="mt-1 text-sm">
            Authentication is disabled because these env vars are missing:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {missing.map((k) => (
              <li key={k} className="font-mono text-xs">
                {k}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ol className="mt-5 space-y-3 text-sm text-slate-600">
        <li>
          <span className="font-semibold text-slate-900">1.</span> In your project root, create a file
          named <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">.env.local</code>.
        </li>
        <li>
          <span className="font-semibold text-slate-900">2.</span> Paste your Firebase Web credentials:
        </li>
      </ol>

      <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
{`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123`}
      </pre>

      <p className="mt-4 text-xs text-slate-500">
        Get these from <span className="font-medium">Firebase Console → Project settings → Your apps
        (Web)</span>. Then restart the dev server (<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">npm run dev</code>)
        and this modal will switch to live Google / email sign-in.
      </p>
    </div>
  );
}

/* ─────────────────── Shared bits ─────────────────── */
function AuthField({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c3.1 0 5.9 1.3 7.9 3.3c3.7 3.7 5.7 8.7 5.7 14 0 .9-.1 1.8-.3 2.6z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.3 7.9 3.3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 34.6 26.8 35.5 24 35.5c-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.6 39 16.2 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.3 5.2C41.4 33.4 43.5 29.1 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/** Map raw Firebase errors to friendly copy, falling back to the real message. */
function prettyError(err: unknown): string {
  const e = err as { code?: string; message?: string };
  const c = e?.code ?? "";
  switch (c) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/redirect-cancelled-by-user":
      return "Sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Allow popups and retry.";
    case "auth/unauthorized-domain":
      return "This domain isn't authorized for Firebase auth. Add it in the Firebase Console.";
    case "auth/invalid-api-key":
    case "auth/configuration-not-found":
      return "Firebase API key/project is misconfigured. Check your .env.local values.";
    case "auth/operation-not-allowed":
      return "This sign-in method isn't enabled. Enable it in the Firebase Console.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/email-already-in-use":
      return "This email is already registered. Switch to Log In.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with a different sign-in method. Try that method instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    default:
      return e?.message ? `${e.message}${c ? ` (${c})` : ""}` : c || "Something went wrong. Please try again.";
  }
}
