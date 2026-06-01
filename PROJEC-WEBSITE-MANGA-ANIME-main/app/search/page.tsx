'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MangaCard } from '@/components/MangaCard';
import { Loader2, Search as SearchIcon, ChevronLeft } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const router = useRouter();

    const [input, setInput] = useState(q);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!q) {
            setTimeout(() => setResults([]), 0);
            return;
        }

        async function fetchSearch() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/manga/search?q=${encodeURIComponent(q)}`);
                const json = await res.json();
                if (json.success) {
                    setResults(json.data);
                } else {
                    setError(json.message || 'Gagal mencari manga');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan sistem');
            } finally {
                setLoading(false);
            }
        }
        fetchSearch();
    }, [q]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            router.push(`/search?q=${encodeURIComponent(input.trim())}`);
        }
    };

    return (
        <div className="bg-[#13151A] min-h-screen pb-20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 bg-[#13151A] sticky top-0 z-30">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-white border border-transparent hover:bg-[#1C1F26] rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-white">Discover</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            <div className="px-6 space-y-6">
                <form onSubmit={handleSearch} className="relative">
                    <div className="relative">
                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" strokeWidth={3} />
                        <input 
                            type="text" 
                            placeholder="Find manga, manhwa..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-[#1C1F26] rounded-[2rem] py-4 pl-14 pr-6 text-white font-medium placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3AC8BA] transition-all shadow-inner border border-white/5"
                        />
                    </div>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#3AC8BA]" />
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center font-medium">
                        <p>{error}</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="font-extrabold text-lg text-white mb-4 px-1">Results for &quot;{q}&quot;</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {results.map((manga, i) => (
                                <MangaCard key={i} {...manga} />
                            ))}
                        </div>
                    </div>
                ) : q ? (
                    <div className="text-center text-gray-500 py-20 font-medium px-4">
                        Hmm, komik dengan kata kunci &quot;{q}&quot; tidak ditemukan.
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <SearchIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p className="font-medium">Mulai pencarianmu di sini!</p>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-[#13151A]"><Loader2 className="w-10 h-10 animate-spin text-[#3AC8BA]" /></div>}>
            <SearchContent />
        </Suspense>
    );
}
