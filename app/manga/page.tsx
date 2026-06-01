'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, LayoutGrid, Heart, History, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/lib/store';

function MangaDetailContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const router = useRouter();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(!!url);
    const [error, setError] = useState<string | null>(url ? null : 'URL tidak valid');
    const [activeTab, setActiveTab] = useState('Chapters');
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!url) return;
        async function fetchDetail() {
            try {
                const res = await fetch(`/api/manga/detail?url=${encodeURIComponent(url as string)}`);
                const json = await res.json();
                if (json.success) setDetail(json.data);
                else setError(json.message || 'Gagal memuat detail manga');
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan sistem');
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [url]);

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#13151A]"><Loader2 className="w-10 h-10 animate-spin text-[#3AC8BA]" /></div>;
    if (error || !detail) return <div className="px-6 py-20 text-center bg-[#13151A] min-h-screen"><p className="text-gray-400 mb-4">{error || 'Manga tidak ditemukan'}</p><button onClick={() => router.back()} className="px-6 py-2 bg-[#1A1D24] text-white rounded-full">Kembali</button></div>;

    const isFav = isFavorite(url as string);

    return (
        <div className="bg-[#13151A] min-h-screen flex flex-col relative text-white">
            {/* Background Image that bleeds to top */}
            <div className="absolute top-0 left-0 w-full h-[60vh] z-0">
                <Image 
                    src={detail.thumb || "https://picsum.photos/400/600"} 
                    alt={detail.title} 
                    fill
                    className="object-cover opacity-80"
                    referrerPolicy="no-referrer"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13151A] via-transparent to-black/30" />
            </div>

            {/* Top Navigation */}
            <div className="fixed top-6 inset-x-6 z-20 flex justify-between items-center max-w-md mx-auto">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 active:scale-95 transition-transform">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#3AC8BA]" />
                    <span className="text-xs font-bold text-white">Currently Ongoing</span>
                </div>

                <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex flex-col items-center justify-center border border-white/10">
                    <LayoutGrid className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Bottom Sheet */}
            <div className="relative z-10 mt-[45vh] bg-[#1A1D24] rounded-t-[2.5rem] w-full max-w-md mx-auto min-h-[55vh] p-6 pb-32 border-t border-white/5 shadow-2xl">
                
                {/* Drag Handle & Chevoron */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#1A1D24] rounded-full flex items-start justify-center pt-2 shadow-lg border border-white/5">
                    <div className="w-6 h-1 mt-1 bg-gray-600 rounded-full"></div>
                </div>

                <div className="flex justify-between items-start mt-2">
                    <div className="flex-1 pr-4">
                        <h1 className="text-2xl font-black text-white leading-tight mb-1">{detail.title}</h1>
                        <p className="text-sm font-medium text-gray-400">by <span className="text-[#3AC8BA]">Komiku Authors</span></p>
                    </div>
                    <button 
                        onClick={() => toggleFavorite({title: detail.title, link: url as string, thumb: detail.thumb, desc: detail.synopsis?.slice(0,50)})}
                        className="w-12 h-12 rounded-full bg-[#13151A] flex flex-col items-center justify-center border border-white/5 active:scale-95 transition-transform shrink-0 shadow-inner z-50 relative cursor-pointer"
                    >
                        <Heart className={`w-5 h-5 ${mounted && isFav ? 'fill-red-500 text-red-500' : 'fill-gray-600 text-gray-600'}`} strokeWidth={0} />
                    </button>
                </div>

                <p className={`text-gray-400 text-sm leading-relaxed mt-6 ${isDescExpanded ? '' : 'line-clamp-3'}`}>
                    {detail.synopsis}
                </p>
                {detail.synopsis && detail.synopsis.length > 150 && (
                    <button 
                        onClick={() => setIsDescExpanded(!isDescExpanded)} 
                        className="mt-2 text-[#3AC8BA] text-xs font-bold cursor-pointer"
                    >
                        {isDescExpanded ? '...Show Less' : '...Show More'}
                    </button>
                )}

                {/* Tabs */}
                <div className="flex gap-6 mt-8 border-b border-white/5 pb-2">
                    {['Chapters', 'Info', 'Reviews'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3AC8BA] rounded-t-full shadow-[0_0_8px_rgba(58,200,186,0.8)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6 space-y-4 pb-24">
                    {activeTab === 'Chapters' && (
                        detail.chapters.length === 0 ? (
                            <p className="text-gray-500 text-sm py-4">Belum ada chapter.</p>
                        ) : (
                            detail.chapters.map((chapter: any, i: number) => (
                                <Link href={`/chapter?url=${encodeURIComponent(chapter.link)}`} key={i} className="flex items-center justify-between p-3 bg-[#13151A]/50 rounded-2xl border border-white/5 relative overflow-hidden group hover:bg-[#1C1F26] transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 relative pointer-events-none">
                                        <div className="w-10 h-10 rounded-full bg-[#1A1D24] border border-white/5 shadow-sm flex items-center justify-center font-bold text-gray-300">
                                           {detail.chapters.length - i}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-[#3AC8BA] transition-colors">{chapter.title}</h4>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">Release Date • {chapter.date || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <div className="relative pointer-events-none">
                                        <ChevronLeft className="w-4 h-4 text-gray-600 rotate-180 group-hover:text-[#3AC8BA] transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            ))
                        )
                    )}
                    {activeTab === 'Info' && (
                        <div className="text-gray-400 text-sm">Informasi manga sedang dimuat. Genre: Action, Adventure.</div>
                    )}
                </div>

            </div>

            {/* Fixed Bottom CTA */}
            {detail.chapters.length > 0 && (
                <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-6 z-50">
                    <div className="bg-[#1C1F26]/90 backdrop-blur-xl rounded-[2rem] p-2 flex items-center shadow-2xl border border-white/5">
                        <Link href={`/chapter?url=${encodeURIComponent(detail.chapters[detail.chapters.length - 1].link)}`} className="flex-1 bg-gradient-to-r from-[#3AC8BA] to-[#3CC2B7] text-[#13151A] font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-[#3AC8BA]/20">
                            Swipe to Read &rarr;
                        </Link>
                        <div className="w-[120px] flex flex-col items-center justify-center">
                            <span className="text-xs text-gray-500 font-medium">Start From</span>
                            <span className="text-sm font-black text-white">Ch. 1</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MangaPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-[#13151A]"><Loader2 className="w-10 h-10 animate-spin text-[#3AC8BA]" /></div>}>
            <MangaDetailContent />
        </Suspense>
    );
}
