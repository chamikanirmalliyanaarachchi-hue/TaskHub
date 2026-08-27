"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  /** Remote profile picture URL (e.g. user.photo / photoURL). */
  src?: string | null;
  /** Display name — used for the fallback initial. */
  name?: string | null;
  /** Email — fallback for the initial when no name is present. */
  email?: string | null;
  /** Optional explicit pixel size. When omitted, control via className. */
  size?: number;
  /** Tailwind classes for size/typography, e.g. "h-8 w-8 text-xs". */
  className?: string;
};

/**
 * UserAvatar — robust, beautiful avatar with graceful fallback.
 *  - Shows the photo when a URL is provided AND it loads successfully.
 *  - If the URL is missing, fails to load, or errors, it falls back to the
 *    first initial of the name/email inside a circular, brand-tinted badge.
 *  - The initial sits behind the image so there's never a flash of empty
 *    space while the photo is loading.
 */
export function UserAvatar({ src, name, email, size, className }: UserAvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const displayName = name || email || "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  const showImage = Boolean(src) && !errored;
  const style = size ? { width: size, height: size, fontSize: Math.round(size * 0.4) } : undefined;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
        "bg-primary/10 font-display font-semibold text-primary ring-1 ring-primary/20",
        className
      )}
      style={style}
    >
      {/* Fallback initial — always present behind the image */}
      <span className="absolute inset-0 grid place-items-center leading-none">{initial}</span>

      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? undefined}
          alt={displayName || "User"}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "relative h-full w-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </span>
  );
}
