import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/store';
import { useEffect, useState } from 'react';

interface MangaCardProps {
  title: string;
  link: string;
  thumb: string;
  desc?: string;
  large?: boolean;
}

import { ScrollingTitle } from './ScrollingTitle';

export function MangaCard({ title, link, thumb, desc, large = false }: MangaCardProps) {
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
    <Link href={`/manga?url=${encodeURIComponent(link)}`} className="group flex flex-col w-full flex-shrink-0 snap-start relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[#1A1D24] shadow-sm transition-transform duration-300">
        <Image 
          src={thumb} 
          alt={title} 
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
          sizes="(max-width: 768px) 50vw, 33vw"
          unoptimized
        />
        {/* Heart Icon top right */}
        <button 
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#1A1D24]/60 backdrop-blur-md flex items-center justify-center shadow-sm"
        >
          <Heart className={`w-4 h-4 ${mounted && isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} strokeWidth={mounted && isFav ? 0 : 2} />
        </button>
        {/* Bottom Panel floating */}
        <div className="absolute inset-x-2 bottom-2 bg-[#1A1D24]/80 backdrop-blur-lg rounded-2xl p-3 border border-white/5">
          <ScrollingTitle text={title} className="font-bold text-white text-sm" />
          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 font-medium">
            {desc || 'Komik Update'}
          </p>
        </div>
      </div>
    </Link>
  );
}
