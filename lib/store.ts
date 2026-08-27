import { create } from "zustand";
import type { Service, PriceQuote, BookingStep } from "./types";

/**
 * Global client store (Zustand) that coordinates the interactive booking
 * flow, the active category filter, and the navbar location selection.
 *
 * Why Zustand over Context here:
 *  - The booking drawer is opened from many places (navbar CTA, bento cards,
 *    hero search) so a singleton store avoids prop-drilling.
 *  - Selecting state slices prevents unnecessary re-renders across sections.
 */
interface AppState {
  /* ---- Navbar / global ---- */
  location: string;
  setLocation: (loc: string) => void;

  /* ---- Category filter (shared between Hero & BentoGrid) ---- */
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  /* ---- Quick search bottom-sheet (mobile) ---- */
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  /* ---- Booking drawer ---- */
  isBookingOpen: boolean;
  bookingService: Service | null;
  step: BookingStep;
  hours: number;
  urgent: boolean;
  selectedOptions: string[];
  date: string | null;
  time: string | null;
  promo: string;
  quote: PriceQuote | null;
  isCalculating: boolean;

  openBooking: (service: Service) => void;
  closeBooking: () => void;
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setHours: (h: number) => void;
  toggleUrgent: () => void;
  toggleOption: (id: string) => void;
  setDate: (d: string) => void;
  setTime: (t: string) => void;
  setPromo: (p: string) => void;
  setQuote: (q: PriceQuote | null) => void;
  setCalculating: (v: boolean) => void;
  resetBooking: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  /* global */
  location: "Colombo",
  setLocation: (location) => set({ location }),

  /* filter */
  selectedCategory: "All",
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  /* quick search */
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  /* booking */
  isBookingOpen: false,
  bookingService: null,
  step: 1,
  hours: 2,
  urgent: false,
  selectedOptions: [],
  date: null,
  time: null,
  promo: "",
  quote: null,
  isCalculating: false,

  openBooking: (service) =>
    set({
      isBookingOpen: true,
      bookingService: service,
      step: 1,
      hours: 2,
      urgent: false,
      selectedOptions: [],
      date: null,
      time: null,
      promo: "",
      quote: null,
    }),

  closeBooking: () => set({ isBookingOpen: false }),

  setStep: (step) => set({ step }),
  nextStep: () => set({ step: Math.min(4, get().step + 1) as BookingStep }),
  prevStep: () => set({ step: Math.max(1, get().step - 1) as BookingStep }),

  setHours: (hours) => set({ hours }),
  toggleUrgent: () => set({ urgent: !get().urgent }),
  toggleOption: (id) => {
    const current = get().selectedOptions;
    set({
      selectedOptions: current.includes(id)
        ? current.filter((o) => o !== id)
        : [...current, id],
    });
  },
  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setPromo: (promo) => set({ promo }),
  setQuote: (quote) => set({ quote }),
  setCalculating: (isCalculating) => set({ isCalculating }),

  resetBooking: () =>
    set({
      isBookingOpen: false,
      bookingService: null,
      step: 1,
      hours: 2,
      urgent: false,
      selectedOptions: [],
      date: null,
      time: null,
      promo: "",
      quote: null,
    }),
}));
