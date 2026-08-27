/**
 * Keyword → category map powering the "AI Smart Search" in the hero.
 * Typing a natural-language prompt is scanned for these tokens to
 * auto-detect the most relevant service category + tags.
 */
export const KEYWORD_MAP: Record<string, { category: string; tag: string }> = {
  // Garage
  car: { category: "Garage", tag: "Car" },
  bumper: { category: "Garage", tag: "Bumper" },
  mechanic: { category: "Garage", tag: "Mechanic" },
  servicing: { category: "Garage", tag: "Servicing" },
  vehicle: { category: "Garage", tag: "Vehicle" },
  // Electronics
  phone: { category: "Electronics", tag: "Phone" },
  laptop: { category: "Electronics", tag: "Laptop" },
  screen: { category: "Electronics", tag: "Screen" },
  tv: { category: "Electronics", tag: "TV" },
  electronics: { category: "Electronics", tag: "Electronics" },
  // Furniture
  furniture: { category: "Furniture", tag: "Furniture" },
  ikea: { category: "Furniture", tag: "IKEA" },
  assemble: { category: "Furniture", tag: "Assembly" },
  sofa: { category: "Furniture", tag: "Sofa" },
  // Smart Home
  smart: { category: "Smart Home", tag: "Smart" },
  wifi: { category: "Smart Home", tag: "WiFi" },
  alexa: { category: "Smart Home", tag: "Alexa" },
  automation: { category: "Smart Home", tag: "Automation" },
  // Cleaning
  clean: { category: "Cleaning", tag: "Cleaning" },
  maid: { category: "Cleaning", tag: "Maid" },
  tidy: { category: "Cleaning", tag: "Tidy" },
  // Plumbing
  plumb: { category: "Plumbing", tag: "Plumbing" },
  leak: { category: "Plumbing", tag: "Leak" },
  pipe: { category: "Plumbing", tag: "Pipe" },
  // Painting
  paint: { category: "Painting", tag: "Painting" },
  wall: { category: "Painting", tag: "Wall" },
  // Moving
  move: { category: "Moving", tag: "Moving" },
  shift: { category: "Moving", tag: "Shift" },
  relocate: { category: "Moving", tag: "Relocate" },
  pack: { category: "Moving", tag: "Packing" },
};

/** Valid promo codes → discount fraction (e.g. 0.1 = 10% off). */
export const PROMO_CODES: Record<string, number> = {
  SAVE10: 0.1,
  WELCOME20: 0.2,
  TASKHUB15: 0.15,
};

/** Urgent booking surcharge applied to the subtotal. */
export const URGENT_FEE_RATE = 0.25;

/** Default city used by the navbar location selector. */
export const DEFAULT_LOCATION = "Colombo";
export const LOCATIONS = ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna"];
