import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Home, Compass, Search, User } from "lucide-react";

import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "MangaShan",
  description: "Baca Manga gratis dan lengkap persembahan dari SHANN",
  manifest: "/manifest.json",
  themeColor: "#0A0B0E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className="bg-gradient-to-b from-[#0A0B0E] via-[#0F1117] to-[#13151A] text-white flex flex-col min-h-screen items-center"
        suppressHydrationWarning
      >
        <div className="w-full max-w-md bg-gradient-to-b from-[#13151A] to-[#0F1117] min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col">
          <main className="flex-1 w-full relative pb-24 scroll-smooth">
            {children}
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
