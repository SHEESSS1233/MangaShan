import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/store";
import { useEffect, useState } from "react";

interface MangaCardProps {
  title: string;
  link: string;
  thumb: string;
  desc?: string;
  large?: boolean;
}

import { ScrollingTitle } from "./ScrollingTitle";

export function MangaCard({
  title,
  link,
  thumb,
  desc,
  large = false,
}: MangaCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
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
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1D24] to-[#0F1117] shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        <Image
          src={thumb}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          sizes="(max-width: 768px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect fill='%231A1D24' width='400' height='500'/%3E%3C/svg%3E"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Heart Icon top right */}
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${mounted && isFav ? "fill-red-500 text-red-500" : "text-white hover:text-red-400"}`}
            strokeWidth={mounted && isFav ? 0 : 2}
          />
        </button>
        {/* Bottom Panel floating */}
        <div className="absolute inset-x-3 bottom-3 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 group-hover:border-white/20 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100">
          <ScrollingTitle
            text={title}
            className="font-bold text-white text-sm"
          />
          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 font-medium">
            {desc || "Komik Update"}
          </p>
        </div>
      </div>
    </Link>
  );
}
