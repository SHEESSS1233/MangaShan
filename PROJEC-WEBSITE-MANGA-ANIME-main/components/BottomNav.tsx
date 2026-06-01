'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/favorites', icon: Compass, label: 'Library' },
    { href: '/search', icon: Search, label: 'Discover' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-[#13151A]/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.5)] pb-safe">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href} className="flex flex-col items-center">
            <div className={`p-2 rounded-xl mb-1 transition-all ${isActive ? 'bg-[#1A1D24] shadow-inner shadow-white/5 border border-white/5 scale-110' : 'hover:bg-white/5'}`}>
              <Icon className={`h-5 w-5 ${isActive ? 'text-[#3AC8BA]' : 'text-[#8F94A3]'}`} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] ${isActive ? 'font-bold text-[#3AC8BA]' : 'font-medium text-[#8F94A3]'}`}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
