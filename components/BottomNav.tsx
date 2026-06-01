"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/favorites", icon: Compass, label: "Library" },
    { href: "/search", icon: Search, label: "Discover" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-gradient-to-t from-[#13151A] via-[#13151A]/95 to-[#13151A]/90 backdrop-blur-2xl border-t border-white/10 px-6 py-3 flex justify-between items-center z-50 rounded-t-3xl shadow-2xl pb-safe">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center group transition-all duration-300"
          >
            <div
              className={`p-2.5 rounded-2xl mb-1 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-[#3AC8BA] to-[#2BA39F] shadow-lg shadow-[#3AC8BA]/30 scale-110"
                  : "hover:bg-white/10 group-hover:scale-105"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-[#8F94A3] group-hover:text-white"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            <span
              className={`text-[10px] font-semibold transition-all duration-300 ${
                isActive
                  ? "text-[#3AC8BA] font-bold"
                  : "text-[#8F94A3] group-hover:text-white"
              }`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
