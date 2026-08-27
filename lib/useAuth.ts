"use client";

import { create } from "zustand";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, signInWithGoogle, logOut } from "@/lib/firebase";

/**
 * Auth state backed by real Firebase Auth (via `onAuthStateChanged`).
 *  - `isLoggedIn` / `user` reflect the live Firebase session.
 *  - `login()` triggers the Google popup; `logout()` signs the user out.
 *
 * Swap `signInWithGoogle` for any other provider here without touching the
 * components that consume this hook.
 */
interface AuthUser {
  email: string;
  name?: string | null;
  photo?: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: async () => {
    await signInWithGoogle();
  },
  logout: async () => {
    await logOut();
  },
}));

// Subscribe to Firebase auth changes (client only) to keep the store in sync.
if (typeof window !== "undefined" && auth) {
  onAuthStateChanged(auth, (fbUser: User | null) => {
    if (fbUser) {
      useAuth.setState({
        isLoggedIn: true,
        user: {
          email: fbUser.email ?? "",
          name: fbUser.displayName,
          photo: fbUser.photoURL,
        },
      });
    } else {
      useAuth.setState({ isLoggedIn: false, user: null });
    }
  });
}
