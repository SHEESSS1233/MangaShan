"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, BookOpen } from "lucide-react";
import { useFavorites } from "@/lib/store";
import { useEffect, useState } from "react";
import { ScrollingTitle } from "./ScrollingTitle";

interface MangaCardProps {
  title: string;
  link: string;
  thumb: string;
  desc?: string;
  large?: boolean;
}

export function MangaCard({
  title,
  link,
  thumb,
  desc,
  large = false,
}: MangaCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isFav = isFavorite(link);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ title, link, thumb, desc });
  };

  return (
    <Link
      href={`/manga?url=${encodeURIComponent(link)}`}
      className="group flex flex-col w-full flex-shrink-0 snap-start relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full overflow-hidden bg-[#0E1118]"
        style={{
          aspectRatio: "3/4",
          borderRadius: "20px",
          boxShadow: hovered
            ? "0 24px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(58,200,186,0.3)"
            : "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
          transition: "box-shadow 0.35s ease, transform 0.35s ease",
          transform: hovered ? "translateY(-4px) scale(1.02)" : "scale(1)",
        }}
      >
        {/* Cover Image */}
        <Image
          src={thumb}
          alt={title}
          fill
          className="object-cover"
          style={{
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
          referrerPolicy="no-referrer"
          sizes="(max-width: 768px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect fill='%230E1118' width='300' height='400'/%3E%3C/svg%3E"
          unoptimized
        />

        {/* Always-visible bottom gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(10,12,18,0.6) 65%, rgba(10,12,18,0.97) 100%)",
          }}
        />

        {/* Top fade for badge readability */}
        <div
          className="absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 100%)",
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 left-3 z-20 flex items-center justify-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "transform 0.2s ease, background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.15)";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(220,38,38,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(0,0,0,0.5)";
          }}
        >
          <Heart
            size={15}
            className={`transition-all duration-300 ${
              mounted && isFav
                ? "fill-red-500 text-red-500"
                : "text-white/80"
            }`}
            strokeWidth={mounted && isFav ? 0 : 2}
          />
        </button>

        {/* NEW badge */}
        <div
          className="absolute top-3 right-3 z-20 flex items-center gap-1"
          style={{
            background: "rgba(58,200,186,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(58,200,186,0.35)",
            borderRadius: "8px",
            padding: "3px 8px",
          }}
        >
          <BookOpen size={10} className="text-[#3AC8BA]" />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#3AC8BA",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            NEW
          </span>
        </div>

        {/* Bottom Info */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 pt-6">
          {/* Score pill */}
          {desc && (
            <div className="flex items-center gap-1 mb-1.5">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.02em",
                }}
              >
                {desc.length > 18 ? desc.substring(0, 18) + "…" : desc}
              </span>
            </div>
          )}

          {/* Title */}
          <ScrollingTitle
            text={title}
            className="font-bold text-white text-[13px] leading-tight"
          />
        </div>

        {/* Hover shimmer line */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, #3AC8BA, transparent)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </Link>
  );
}