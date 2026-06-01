'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, ChevronLeft, ChevronRight, List } from 'lucide-react';
import Link from 'next/link';

function ChapterContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    const [chapter, setChapter] = useState<any>(null);
    const [loading, setLoading] = useState(!!url);
    const [error, setError] = useState<string | null>(url ? null : 'URL tidak valid');

    useEffect(() => {
        if (!url) {
            return;
        }

        async function fetchChapter() {
            try {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                const res = await fetch(`/api/manga/chapter?url=${encodeURIComponent(url as string)}`);
                const json = await res.json();
                if (json.success) {
                    setChapter(json.data);
                } else {
                    setError(json.message || 'Gagal memuat chapter');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan sistem');
            } finally {
                setLoading(false);
            }
        }
        fetchChapter();
    }, [url]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 bg-[#13151A]">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-[#3AC8BA]" />
                    <div className="absolute inset-0 border-4 border-[#3AC8BA]/20 border-dashed rounded-full animate-spin-reverse opacity-50" />
                </div>
                <p className="text-gray-400 font-medium tracking-wide animate-pulse uppercase text-sm">Menyiapkan Lembaran Komik...</p>
            </div>
        );
    }

    if (error || !chapter) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-6 bg-[#13151A] min-h-screen">
                <div className="bg-[#1A1D24] text-red-500 p-8 rounded-3xl border border-red-500/20 text-center space-y-6 shadow-sm">
                    <p className="font-medium text-lg">{error || 'Chapter tidak ditemukan'}</p>
                    <button 
                        onClick={() => window.history.back()} 
                        className="inline-block px-8 py-3 bg-[#1C1F26] text-white font-bold rounded-full hover:bg-black/50 transition-transform active:scale-95 border border-white/5"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-[#0A0B0E] min-h-screen shadow-xl pb-12 sm:rounded-b-3xl text-white">
            {/* Header / Nav Top */}
            <div className="bg-[#1C1F26]/90 backdrop-blur-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 border-b border-white/5 shadow-sm">
                <h1 className="font-black text-lg md:text-xl text-center md:text-left line-clamp-1 flex-1 tracking-tight">
                    {chapter.title}
                </h1>
                <div className="flex items-center space-x-2 bg-[#0A0B0E] p-1 rounded-xl border border-white/5">
                    {chapter.prev ? (
                        <Link href={`/chapter?url=${encodeURIComponent(chapter.prev)}`} className="text-sm font-bold px-4 py-2 text-gray-300 hover:bg-[#1A1D24] rounded-lg transition-all flex items-center">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Prev
                        </Link>
                    ) : (
                        <span className="text-sm font-bold px-4 py-2 text-gray-600 rounded-lg flex items-center cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Prev
                        </span>
                    )}

                    {chapter.mangaLink && (
                        <Link href={`/manga?url=${encodeURIComponent(chapter.mangaLink)}`} className="text-sm font-bold px-3 py-2 text-gray-300 hover:bg-[#1A1D24] rounded-lg transition-all flex items-center bg-[#1C1F26] shadow-sm border border-white/5" title="Daftar Chapter">
                            <List className="w-4 h-4" />
                        </Link>
                    )}

                    {chapter.next ? (
                        <Link href={`/chapter?url=${encodeURIComponent(chapter.next)}`} className="text-sm font-bold px-4 py-2 text-[#3AC8BA] hover:bg-[#1A1D24] hover:text-[#3CC2B7] rounded-lg transition-all flex items-center">
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    ) : (
                        <span className="text-sm font-bold px-4 py-2 text-gray-600 rounded-lg flex items-center cursor-not-allowed">
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                    )}
                </div>
            </div>

            {/* Images Reader */}
            <div className="flex flex-col items-center w-full min-h-screen">
                {chapter.images.length > 0 ? chapter.images.map((img: string, i: number) => (
                    <div key={i} className="relative w-full">
                        <img 
                            src={img || "https://picsum.photos/800/1200"}
                            alt={`${chapter.title} - Halaman ${i + 1}`}
                            className="w-full h-auto object-contain block"
                            loading={i < 3 ? "eager" : "lazy"}
                            decoding="async"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                )) : (
                    <div className="py-20 text-gray-500 font-medium">Tidak ada gambar yang dimuat.</div>
                )}
            </div>

            {/* Nav Bottom */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-6 pb-20">
                {chapter.prev && (
                    <Link href={`/chapter?url=${encodeURIComponent(chapter.prev)}`} className="w-full sm:w-auto text-center font-bold px-8 py-4 bg-[#1C1F26] text-white hover:bg-[#252830] rounded-2xl transition-all flex items-center justify-center border border-white/5">
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Sebelumnya
                    </Link>
                )}
                
                {chapter.next && (
                    <Link href={`/chapter?url=${encodeURIComponent(chapter.next)}`} className="w-full sm:w-auto text-center font-bold px-8 py-4 bg-gradient-to-r from-[#3AC8BA] to-[#3CC2B7] text-[#13151A] hover:opacity-90 rounded-[1.5rem] transition-all flex items-center justify-center shadow-lg shadow-[#3AC8BA]/20">
                        Selanjutnya
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                )}
                
                {(!chapter.next && chapter.mangaLink) && (
                    <Link href={`/manga?url=${encodeURIComponent(chapter.mangaLink)}`} className="w-full sm:w-auto text-center font-bold px-8 py-4 bg-[#3AC8BA] text-[#13151A] hover:opacity-90 rounded-[1.5rem] transition-all flex items-center justify-center shadow-lg shadow-[#3AC8BA]/20">
                        Kembali ke Manga
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function ChapterPage() {
    return (
        <Suspense fallback={<div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] bg-[#13151A]"><Loader2 className="w-12 h-12 animate-spin text-[#3AC8BA]" /></div>}>
            <ChapterContent />
        </Suspense>
    );
}
