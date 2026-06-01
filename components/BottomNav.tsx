"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookMarked, Search, User } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/favorites", icon: BookMarked, label: "Library" },
  { href: "/search", icon: Search, label: "Discover" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  return (
    <>
      {/* Blur backdrop behind nav */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 pointer-events-none"
        style={{
          height: "110px",
          background:
            "linear-gradient(to top, #0A0C10 40%, rgba(10,12,16,0.85) 70%, transparent 100%)",
        }}
      />

      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-5"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}
      >
        <div
          className="flex justify-between items-center px-4 py-2"
          style={{
            background: "rgba(18, 21, 28, 0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "26px",
            boxShadow:
              "0 -2px 40px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
            marginBottom: "8px",
          }}
        >
          {links.map((link, idx) => {
            const isActive = pathname === link.href;
            const isPressed = pressedIndex === idx;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center relative select-none"
                style={{
                  padding: "6px 16px",
                  borderRadius: "18px",
                  minWidth: "60px",
                  transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: isPressed ? "scale(0.9)" : "scale(1)",
                }}
                onMouseDown={() => setPressedIndex(idx)}
                onMouseUp={() => setPressedIndex(null)}
                onTouchStart={() => setPressedIndex(idx)}
                onTouchEnd={() => setPressedIndex(null)}
              >
                {/* Active background pill */}
                {isActive && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "rgba(58,200,186,0.1)",
                      border: "1px solid rgba(58,200,186,0.18)",
                      borderRadius: "18px",
                    }}
                  />
                )}

                {/* Icon container */}
                <div
                  className="relative flex items-center justify-center mb-0.5"
                  style={{ height: 32 }}
                >
                  {/* Glow behind active icon */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(58,200,186,0.25) 0%, transparent 70%)",
                        filter: "blur(6px)",
                        transform: "scale(1.6)",
                      }}
                    />
                  )}

                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      color: isActive ? "#3AC8BA" : "rgba(255,255,255,0.35)",
                      transition:
                        "color 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                      transform: isActive
                        ? "scale(1.1) translateY(-1px)"
                        : "scale(1)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#3AC8BA" : "rgba(255,255,255,0.3)",
                    letterSpacing: isActive ? "0.02em" : "0.01em",
                    transition: "color 0.25s ease",
                    position: "relative",
                    zIndex: 1,
                    lineHeight: 1,
                  }}
                >
                  {link.label}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <div
                    className="absolute"
                    style={{
                      bottom: -6,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#3AC8BA",
                      boxShadow: "0 0 6px rgba(58,200,186,0.8)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

