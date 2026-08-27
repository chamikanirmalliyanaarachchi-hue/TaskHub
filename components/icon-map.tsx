import {
  Wrench,
  Smartphone,
  Sofa,
  Home,
  Sparkles,
  Droplet,
  Paintbrush,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Central registry mapping the string `icon` field on a Service to its
 * Lucide React component. Keeps the data layer free of React imports.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  smartphone: Smartphone,
  sofa: Sofa,
  home: Home,
  sparkles: Sparkles,
  droplet: Droplet,
  paintbrush: Paintbrush,
  truck: Truck,
  zap: Zap,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Zap;
}
