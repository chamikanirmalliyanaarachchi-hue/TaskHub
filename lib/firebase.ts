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

/**
 * Firebase web config read from NEXT_PUBLIC_* env vars (client-safe).
 * Copy `.env.local.example` → `.env.local` and fill from:
 * Firebase Console → Project settings → Your apps (Web).
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** Keys that are mandatory for Firebase Auth to function. */
const REQUIRED_KEYS: (keyof FirebaseOptions)[] = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

/** Which required keys are currently missing (empty/undefined). */
export const missingFirebaseKeys = REQUIRED_KEYS.filter((k) => !firebaseConfig[k]);

/** True only when all mandatory public config is present. */
export const isFirebaseConfigured = missingFirebaseKeys.length === 0;

if (!isFirebaseConfigured && process.env.NODE_ENV !== "production") {
  // Dev-only hint so the issue is obvious without crashing.
  console.warn(
    "[firebase] Missing config keys:",
    missingFirebaseKeys.join(", "),
    "\nCreate a .env.local file with your Firebase Web credentials.",
  );
}

// Guard against duplicate initialization during hot reload.
// initializeApp tolerates empty values; auth simply won't work until the
// env vars are provided — the UI shows a setup helper instead of crashing.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export { app, auth, googleProvider };

/* ------------------------------------------------------------------ */
/* Reusable auth helpers                                               */
/* ------------------------------------------------------------------ */

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}
