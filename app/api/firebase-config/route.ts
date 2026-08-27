import { NextResponse } from "next/server";

// Always read live server env (not cached at build), so the client can
// bootstrap Firebase even when NEXT_PUBLIC_* wasn't inlined at build time.
export const dynamic = "force-dynamic";

export function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
  };
  // Surface which keys the server actually has (log only, not the values).
  const present = (Object.keys(config) as (keyof typeof config)[]).filter((k) => config[k]);
  console.log("[firebase-config] present env keys:", present.join(", ") || "(none)");
  return NextResponse.json(config);
}
