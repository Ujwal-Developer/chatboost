import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatBoost - Creator-first paid live messages",
  description: "A global creator monetization platform for paid highlighted livestream messages, realtime overlays, and creator-first economics."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
