import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

/**
 * Fonts:
 *  - Inter → UI / body text (--font-sans).
 *  - Space Grotesk → geometric display headings (--font-display).
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskHub — Book local experts instantly",
  description:
    "A futuristic, light-mode local service marketplace with a holographic feel. Describe any task and our AI matches you with vetted local Taskers in minutes.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Always-light: force the `light` theme so the dark class is never applied.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} relative bg-white font-sans text-slate-900 antialiased`}
      >
        {/* Holographic, slow-drifting pastel mesh — fixed behind all content.
            pointer-events-none + -z-10 keep it purely decorative. */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-[-20%] bg-holo opacity-70 animate-holo" />
          {/* Fade the mesh into the white base at the edges for a clean feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/70" />
        </div>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
