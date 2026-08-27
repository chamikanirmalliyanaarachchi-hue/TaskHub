import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Read NEXT_PUBLIC_* Firebase vars explicitly and trim them, so stray
 * whitespace can never evaluate as a "present but empty" value.
 */
const env = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() || "",
};

const firebaseConfig: FirebaseOptions = { ...env };

const REQUIRED_KEYS: (keyof typeof env)[] = ["apiKey", "authDomain", "projectId", "appId"];
export const missingFirebaseKeys = REQUIRED_KEYS.filter((k) => !env[k]).map(
  (k) => `NEXT_PUBLIC_FIREBASE_${String(k).toUpperCase()}`
);
export const isFirebaseConfigured = missingFirebaseKeys.length === 0;

if (!isFirebaseConfigured) {
  // Names the exact missing var in the deploy logs — confirms a build-time env
  // gap (set the var) rather than a code bug.
  console.error("[firebase] Missing build-time env vars:", missingFirebaseKeys.join(", "));
}

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Fast path: build-time NEXT_PUBLIC_* were inlined → initialize immediately.
if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (err) {
    console.error("[firebase] initialization failed:", err);
  }
}

/**
 * Resilient bootstrap. If the build didn't inline NEXT_PUBLIC_* (e.g. the vars
 * were added in Vercel after the last deploy), fetch the config from the
 * runtime API route (which reads live server env). This removes the hard
 * dependency on build-time inlining, so auth works without a redeploy.
 */
let initPromise: Promise<void> | null = null;
export function ensureFirebase(): Promise<void> {
  if (auth) return Promise.resolve();
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const res = await fetch("/api/firebase-config");
      if (!res.ok) return;
      const cfg = (await res.json()) as FirebaseOptions;
      const required: (keyof FirebaseOptions)[] = ["apiKey", "authDomain", "projectId", "appId"];
      if (!required.every((k) => Boolean(cfg[k]))) return;
      if (!getApps().length) initializeApp(cfg);
      app = getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: "select_account" });
    } catch (err) {
      console.error("[firebase] runtime init failed:", err);
    }
  })();
  return initPromise;
}

export { app, auth, db, googleProvider };

/* ------------------------------------------------------------------ */
/* Reusable auth helpers                                               */
/* ------------------------------------------------------------------ */

export async function signInWithGoogle(): Promise<User> {
  await ensureFirebase();
  if (!auth || !googleProvider) {
    throw new Error("Firebase is not configured. Check your NEXT_PUBLIC_FIREBASE_* env vars.");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  await ensureFirebase();
  if (!auth) throw new Error("Firebase is not configured.");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  await ensureFirebase();
  if (!auth) throw new Error("Firebase is not configured.");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logOut(): Promise<void> {
  await ensureFirebase();
  if (!auth) return;
  await signOut(auth);
}
