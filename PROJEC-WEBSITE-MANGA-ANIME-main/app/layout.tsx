import type {Metadata} from 'next';
import './globals.css';
import Link from 'next/link';
import { Home, Compass, Search, User } from 'lucide-react';

import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'MangaShan',
  description: 'Baca Manga gratis dan lengkap persembahan dari SHANN',
  manifest: '/manifest.json',
  themeColor: '#0A0B0E',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body className="bg-[#0A0B0E] text-white flex flex-col min-h-screen items-center" suppressHydrationWarning>
        <div className="w-full max-w-md bg-[#13151A] min-h-screen relative shadow-sm overflow-x-hidden flex flex-col">
          
          <main className="flex-1 w-full relative pb-24">
            {children}
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
