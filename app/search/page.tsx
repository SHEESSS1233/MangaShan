'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MangaCard } from '@/components/MangaCard';
import { Search as SearchIcon, ChevronLeft, X, TrendingUp, Clock, Sparkles } from 'lucide-react';

const TRENDING_TAGS = ['Action', 'Romance', 'Fantasy', 'Horror', 'Comedy', 'Isekai', 'System', 'Martial Arts'];

const RECENT_SEARCHES_KEY = 'komikku_recent_searches';

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  if (typeof window === 'undefined') return;
  const existing = getRecentSearches().filter((s) => s !== q);
  const updated = [q, ...existing].slice(0, 6);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState(q);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(!q);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    setInput(q);
    async function fetchSearch() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/manga/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (json.success) setResults(json.data);
        else setError(json.message || 'Gagal mencari manga');
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
      saveRecentSearch(input.trim());
      setRecentSearches(getRecentSearches());
      router.push(`/search?q=${encodeURIComponent(input.trim())}`);
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleQuickSearch = (term: string) => {
    saveRecentSearch(term);
    setRecentSearches(getRecentSearches());
    setInput(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setIsFocused(false);
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  return (
    <div className="bg-[#0A0C10] min-h-screen pb-24">

      {/* Header */}
      <div
        className="sticky top-0 z-30 px-5 pt-14 pb-4"
        style={{
          background: 'linear-gradient(180deg, rgba(10,12,16,0.98) 0%, rgba(10,12,16,0.9) 80%, transparent 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center transition-transform active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          {/* Search input */}
          <form onSubmit={handleSearch} className="flex-1">
            <div
              className="flex items-center gap-3 px-4 py-3 transition-all duration-200"
              style={{
                background: isFocused
                  ? 'rgba(58,200,186,0.06)'
                  : 'rgba(255,255,255,0.05)',
                border: isFocused
                  ? '1px solid rgba(58,200,186,0.3)'
                  : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                boxShadow: isFocused ? '0 0 0 3px rgba(58,200,186,0.08)' : 'none',
              }}
            >
              <SearchIcon
                size={16}
                style={{
                  color: isFocused ? '#3AC8BA' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.2s',
                  flexShrink: 0,
                }}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari manga, manhwa..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                autoFocus={!q}
                className="flex-1 bg-transparent text-white text-sm font-medium placeholder:text-white/25 focus:outline-none"
              />
              {input.length > 0 && (
                <button
                  type="button"
                  onClick={() => { setInput(''); inputRef.current?.focus(); }}
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <X size={11} className="text-white/60" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="px-5 space-y-7">

        {/* Empty state — discovery */}
        {!q && (
          <>
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-white/30" />
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Terakhir Dicari</span>
                  </div>
                  <button
                    onClick={clearRecent}
                    className="text-xs font-bold text-[#3AC8BA]"
                  >
                    Hapus semua
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickSearch(term)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <Clock size={11} className="text-white/25" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending tags */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[#3AC8BA]" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Trending Genre</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSearch(tag)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={{
                      background: i % 3 === 0
                        ? 'rgba(58,200,186,0.1)'
                        : i % 3 === 1
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(139,92,246,0.1)',
                      border: i % 3 === 0
                        ? '1px solid rgba(58,200,186,0.2)'
                        : i % 3 === 1
                        ? '1px solid rgba(255,255,255,0.07)'
                        : '1px solid rgba(139,92,246,0.2)',
                      color: i % 3 === 0
                        ? '#3AC8BA'
                        : i % 3 === 1
                        ? 'rgba(255,255,255,0.55)'
                        : '#A78BFA',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty illustration */}
            <div className="flex flex-col items-center pt-8 pb-4">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(58,200,186,0.06)',
                  border: '1px solid rgba(58,200,186,0.1)',
                }}
              >
                <Sparkles size={30} className="text-[#3AC8BA]/50" />
              </div>
              <p className="text-white/25 text-sm font-medium text-center">
                Temukan manga favoritmu
              </p>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#3AC8BA] border-t-transparent animate-spin" />
            <span className="text-white/30 text-sm font-medium">Mencari...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="p-5 rounded-2xl flex flex-col items-center gap-2 text-center"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-white">
                  Hasil untuk &ldquo;{q}&rdquo;
                </h3>
                <p className="text-xs text-white/30 font-medium mt-0.5">
                  {results.length} manga ditemukan
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {results.map((manga, i) => (
                <MangaCard key={i} {...manga} />
              ))}
            </div>
          </div>
        )}

        {/* Not found */}
        {!loading && !error && q && results.length === 0 && (
          <div className="flex flex-col items-center pt-12 pb-8 gap-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <SearchIcon size={28} className="text-white/15" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-white/60 font-bold text-sm">
                Tidak ditemukan
              </p>
              <p className="text-white/25 text-xs">
                Coba kata kunci lain atau cek ejaannya
              </p>
            </div>

            {/* Suggestion tags */}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {TRENDING_TAGS.slice(0, 4).map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickSearch(tag)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: 'rgba(58,200,186,0.08)',
                    border: '1px solid rgba(58,200,186,0.15)',
                    color: '#3AC8BA',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#0A0C10]">
        <div className="w-10 h-10 rounded-full border-2 border-[#3AC8BA] border-t-transparent animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
