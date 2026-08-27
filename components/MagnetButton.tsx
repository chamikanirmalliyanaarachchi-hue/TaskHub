"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * MagnetButton — a button that physically leans toward the cursor to create a
 * "haptic magnet" micro-interaction. The displacement is spring-smoothed so it
 * feels elastic, then snaps back to centre on mouse-leave.
 *
 * @param strength  How far the button travels toward the cursor (0–1).
 */
interface MagnetButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  children: React.ReactNode;
}

export const MagnetButton = React.forwardRef<HTMLButtonElement, MagnetButtonProps>(
  ({ className, strength = 0.4, children, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 12, mass: 0.2 });
    const springY = useSpring(y, { stiffness: 180, damping: 12, mass: 0.2 });

    const setRefs = (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      x.set(relX * strength);
      y.set(relY * strength);
    };

    const reset = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.button
        ref={setRefs}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ x: springX, y: springY }}
        className={cn("relative will-change-transform", className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Inner content counter-moves slightly for a parallax feel */}
        <motion.span
          style={{ x: useSpring(x, { stiffness: 120, damping: 14 }), y: useSpring(y, { stiffness: 120, damping: 14 }) }}
          className="flex items-center justify-center gap-2"
        >
          {children}
        </motion.span>
      </motion.button>
    );
  }
);
MagnetButton.displayName = "MagnetButton";
