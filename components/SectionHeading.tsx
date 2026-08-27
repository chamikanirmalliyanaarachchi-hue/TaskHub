import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
};

/**
 * Consistent section header used across the landing page so every block
 * shares the same typographic rhythm, spacing and eyebrow treatment.
 */
export function SectionHeading({
  eyebrow,
  icon,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <Badge variant="glow" className="mb-1">
          {icon}
          {eyebrow}
        </Badge>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
