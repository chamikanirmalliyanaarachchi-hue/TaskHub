import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * EarnWithTaskHubStable
 * ----------------------------------------------------------------------------
 * Bottom CTA section — the fix for the "moving white box" problem.
 *
 * Key idea:
 *  - The OUTER container is 100% stable: static positioning, fixed size,
 *    pure white, rounded, soft shadow. It NEVER translates.
 *  - The animated pastel gradient lives in an absolutely-positioned child
 *    layer that sits BEHIND the content. Only its `background-position`
 *    animates (via the `gradient-shift` CSS keyframe), producing a slow,
 *    liquid flow with zero layout/transform movement.
 *  - The headline, copy and purple CTA button are perfectly still on top.
 */
export function EarnWithTaskHubStable() {
  return (
    <section id="tasker" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-28">
      {/* Stable container — do NOT animate this element's transform */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/60 sm:p-16">
        {/* Animated pastel gradient layer (background-position only) */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-[linear-gradient(120deg,#FBCFE8,#C7D2FE,#CCFBF1,#E0E7FF,#FBCFE8)] bg-[length:300%_300%] animate-gradient-shift [will-change:background-position]"
        />
        {/* Whisper of white to keep the "white card" read */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-white/15"
        />

        {/* Content — perfectly still, above the gradient */}
        <div className="relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-5xl">
            Earn with <span className="text-gradient">TaskHub</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Join thousands of vetted local Taskers. Set your own schedule and
            get matched with nearby jobs in real time.
          </p>
          {/* CTA routes to the dedicated Become-a-Tasker page */}
          <Button asChild variant="gradient" size="lg" className="mt-8">
            <Link href="/become-a-tasker">
              Become a Tasker <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
