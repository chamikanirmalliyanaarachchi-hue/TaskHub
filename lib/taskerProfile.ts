"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

/**
 * SSR-safe storage: on the server `localStorage` doesn't exist, so we fall
 * back to a no-op store. This prevents `localStorage is not defined` crashes
 * during `next build` static prerendering. On the client the real
 * `localStorage` is used, and the dashboard's `mounted` guard avoids any
 * hydration mismatch.
 */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const safeStorage = createJSONStorage(() =>
  typeof window === "undefined" ? noopStorage : window.localStorage,
);

export type TaskerStatus = "live" | "offline";

export interface TaskerProfile {
  fullName: string;
  phone: string;
  area: string;
  bio: string;
  skills: string[];
  rate: string; // stored as raw string (e.g. "45"); format as $ on display
  portfolio: string[];
  experience: string;
  socials: { instagram: string; facebook: string; website: string };
  status: TaskerStatus;
  email?: string;
}

interface TaskerProfileState {
  profile: TaskerProfile | null;
  setProfile: (p: TaskerProfile) => void;
  setStatus: (s: TaskerStatus) => void;
}

/**
 * Persisted Tasker profile (localStorage via zustand).
 * Swap `persist` for a Firestore write/read when a backend is ready —
 * the dashboard only depends on `useTaskerProfile().profile`.
 */
export const useTaskerProfile = create<TaskerProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (p) => set({ profile: p }),
      setStatus: (s) =>
        set((st) => ({ profile: st.profile ? { ...st.profile, status: s } : st.profile })),
    }),
    {
      name: "taskhub-tasker-profile",
      storage: safeStorage,
    },
  ),
);
