import type { Service } from "./types";

/**
 * Static "database" of local services.
 * In a real product this would live in a DB; here it is the single source of
 * truth shared by the API route handler and (as a fallback) the client.
 *
 * `icon` values map to Lucide components in components/icon-map.tsx.
 * `gradient` values are Tailwind gradient utilities for card artwork.
 */
export const SERVICES: Service[] = [
  {
    id: "garage-bumper",
    name: "Garage Services",
    category: "Garage",
    description: "Bumper repair, servicing & roadside help from certified mechanics.",
    icon: "wrench",
    hourlyRate: 1800,
    taskersAvailable: 3,
    rating: 4.8,
    tags: ["car", "bumper", "repair", "mechanic", "servicing"],
    gradient: "from-violet-500 via-fuchsia-500 to-purple-600",
    popular: true,
    options: [
      { id: "pickup", name: "Pickup & Drop-off", price: 600 },
      { id: "genuine", name: "Genuine Parts", price: 1500 },
      { id: "warranty", name: "6-Month Warranty", price: 400 },
    ],
  },
  {
    id: "electronics-repair",
    name: "Electronics Repair",
    category: "Electronics",
    description: "Phones, laptops & TVs fixed at home by expert technicians.",
    icon: "smartphone",
    hourlyRate: 1500,
    taskersAvailable: 5,
    rating: 4.7,
    tags: ["phone", "laptop", "screen", "tv", "electronics"],
    gradient: "from-sky-500 via-cyan-500 to-blue-600",
    popular: true,
    options: [
      { id: "onsite", name: "On-site Diagnosis", price: 300 },
      { id: "data", name: "Data Recovery", price: 1200 },
    ],
  },
  {
    id: "furniture-setup",
    name: "Furniture Setup",
    category: "Furniture",
    description: "IKEA assembly, sofa placement & flat-pack mounting.",
    icon: "sofa",
    hourlyRate: 1200,
    taskersAvailable: 7,
    rating: 4.9,
    tags: ["furniture", "ikea", "assemble", "sofa", "mounting"],
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    popular: true,
    options: [
      { id: "wall", name: "Wall Mounting", price: 500 },
      { id: "disposal", name: "Packaging Disposal", price: 250 },
    ],
  },
  {
    id: "smart-home",
    name: "Smart Home Setup",
    category: "Smart Home",
    description: "WiFi, Alexa, cameras & automation configured end-to-end.",
    icon: "home",
    hourlyRate: 2000,
    taskersAvailable: 2,
    rating: 4.6,
    tags: ["smart", "home", "wifi", "alexa", "automation"],
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    popular: true,
    options: [
      { id: "cameras", name: "Camera Install", price: 900 },
      { id: "hub", name: "Smart Hub Config", price: 700 },
    ],
  },
  {
    id: "home-cleaning",
    name: "Home Cleaning",
    category: "Cleaning",
    description: "Deep cleaning, sofa shampooing & post-renovation tidy.",
    icon: "sparkles",
    hourlyRate: 900,
    taskersAvailable: 11,
    rating: 4.9,
    tags: ["clean", "maid", "deep", "tidy", "sofa"],
    gradient: "from-pink-500 via-rose-500 to-red-500",
    options: [
      { id: "deep", name: "Deep Clean", price: 800 },
      { id: "windows", name: "Window Wash", price: 350 },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    category: "Plumbing",
    description: "Leaks, pipe fixes & fixture installs — fast response.",
    icon: "droplet",
    hourlyRate: 1300,
    taskersAvailable: 4,
    rating: 4.7,
    tags: ["plumb", "leak", "pipe", "fixture", "water"],
    gradient: "from-blue-500 via-indigo-500 to-violet-600",
    options: [
      { id: "emergency", name: "Emergency Call-out", price: 700 },
    ],
  },
  {
    id: "painting",
    name: "Painting",
    category: "Painting",
    description: "Interior & exterior painting with premium finishes.",
    icon: "paintbrush",
    hourlyRate: 1100,
    taskersAvailable: 6,
    rating: 4.8,
    tags: ["paint", "wall", "interior", "exterior", "finish"],
    gradient: "from-lime-500 via-green-500 to-emerald-600",
    options: [
      { id: "premium", name: "Premium Paint", price: 1000 },
      { id: "furniture", name: "Furniture Cover", price: 300 },
    ],
  },
  {
    id: "moving-help",
    name: "Moving Help",
    category: "Moving",
    description: "Packing, lifting & local relocation with a truck.",
    icon: "truck",
    hourlyRate: 1400,
    taskersAvailable: 8,
    rating: 4.6,
    tags: ["move", "shift", "relocate", "pack", "truck"],
    gradient: "from-orange-500 via-red-500 to-pink-600",
    options: [
      { id: "truck", name: "Truck Rental", price: 2000 },
      { id: "packing", name: "Packing Service", price: 600 },
    ],
  },
];

/** Ordered category list used by the hero selector & bento filter bar. */
export const CATEGORIES: string[] = [
  "All",
  "Garage",
  "Electronics",
  "Furniture",
  "Smart Home",
  "Cleaning",
  "Plumbing",
  "Painting",
  "Moving",
];

/** Mock pool used by the Live Activity feed generator. */
export const ACTIVITY_POOL: Omit<
  import("./types").ActivityItem,
  "id" | "minutesAgo"
>[] = [
  { name: "Kasun", service: "Car Service", location: "Colombo 03" },
  { name: "Amara", service: "Smart Home Setup", location: "Colombo 07" },
  { name: "Devon", service: "Furniture Assembly", location: "Mount Lavinia" },
  { name: "Nisha", service: "Deep Cleaning", location: "Colombo 05" },
  { name: "Ravi", service: "Plumbing Fix", location: "Dehiwala" },
  { name: "Thara", service: "Phone Repair", location: "Colombo 04" },
  { name: "Isuru", service: "Painting", location: "Nugegoda" },
  { name: "Mala", service: "Moving Help", location: "Kottawa" },
];
