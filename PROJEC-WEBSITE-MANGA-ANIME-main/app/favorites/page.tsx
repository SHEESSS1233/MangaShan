'use client';

import { useFavorites } from '@/lib/store';
import { MangaCard } from '@/components/MangaCard';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
    const { favorites } = useFavorites();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-[#13151A]" />; // blank placeholder until hydration
    }

    return (
        <div className="min-h-screen bg-[#13151A] pb-32">
            <div className="px-6 pt-12 pb-6 sticky top-0 z-30 bg-[#13151A]/90 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="bg-[#1A1D24] p-3 rounded-2xl border border-white/5">
                        <Heart className="w-6 h-6 text-[#3AC8BA]" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Disukai
                    </h1>
                </div>
            </div>

            <div className="px-6 py-6">
                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                        <div className="bg-[#1A1D24] p-6 rounded-full">
                            <Heart className="w-12 h-12 text-[#8F94A3]" strokeWidth={1} />
                        </div>
                        <p className="text-[#8F94A3] font-medium">Belum ada komik yang disukai</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {favorites.map((manga, i) => (
                            <MangaCard key={i} {...manga} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
