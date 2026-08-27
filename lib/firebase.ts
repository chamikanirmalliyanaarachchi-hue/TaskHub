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

/** Keys that are mandatory for Firebase Auth to function. */
const REQUIRED_KEYS: (keyof typeof env)[] = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

/**
 * Accurate, single-source detection: true only when every required public
 * config value is actually present. If this is false, auth will be null and
 * the helpers throw a clear error (never a false positive).
 */
export const isFirebaseConfigured = REQUIRED_KEYS.every((k) => Boolean(env[k]));

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Only initialize when configured, so we never call initializeApp/getAuth
// with undefined values (which would throw and leave auth null).
if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (err) {
    // A genuine init failure (e.g. invalid apiKey) — surface it; do not mask.
    console.error("[firebase] initialization failed:", err);
  }
}

export { app, auth, db, googleProvider };

/* ------------------------------------------------------------------ */
/* Reusable auth helpers                                               */
/* ------------------------------------------------------------------ */

export async function signInWithGoogle(): Promise<User> {
  if (!auth || !googleProvider) {
    throw new Error("Firebase is not configured. Check your NEXT_PUBLIC_FIREBASE_* env vars.");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new Error("Firebase is not configured.");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new Error("Firebase is not configured.");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logOut(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}
