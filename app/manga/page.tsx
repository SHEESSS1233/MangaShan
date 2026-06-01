'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, Heart, BookOpen, Star, Clock,
  Play, BookMarked, Share2, ChevronDown, ChevronUp,
  Flame, Check
} from 'lucide-react';
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0A0C10]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#3AC8BA] border-t-transparent animate-spin" />
        <span className="text-white/40 text-sm font-medium">Memuat...</span>
      </div>
    </div>
  );

  if (error || !detail) return (
    <div className="px-6 py-20 text-center bg-[#0A0C10] min-h-screen flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
        <BookOpen size={24} className="text-red-400" />
      </div>
      <p className="text-white/50 mb-6 text-sm">{error || 'Manga tidak ditemukan'}</p>
      <button
        onClick={() => router.back()}
        className="px-6 py-3 rounded-2xl font-bold text-sm text-white"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        Kembali
      </button>
    </div>
  );

  const isFav = isFavorite(url as string);
  const totalChapters = detail.chapters?.length || 0;
  const latestChapter = detail.chapters?.[0];
  const firstChapter = detail.chapters?.[totalChapters - 1];

  return (
    <div className="bg-[#0A0C10] min-h-screen text-white overflow-x-hidden">

      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[55vh] z-0 overflow-hidden">
        <Image
          src={detail.thumb || 'https://picsum.photos/400/600'}
          alt={detail.title}
          fill
          className="object-cover"
          style={{ filter: 'blur(2px)', transform: 'scale(1.05)' }}
          referrerPolicy="no-referrer"
          priority
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,12,16,0.3) 0%, rgba(10,12,16,0.5) 40%, rgba(10,12,16,0.9) 70%, #0A0C10 100%)',
          }}
        />
        {/* Side vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(10,12,16,0.6) 0%, transparent 30%, transparent 70%, rgba(10,12,16,0.6) 100%)',
          }}
        />
      </div>

      {/* Top Nav */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 flex justify-between items-center px-5 pt-14 pb-4"
        style={{
          background: 'linear-gradient(180deg, rgba(10,12,16,0.85) 0%, transparent 100%)',
          backdropFilter: 'blur(0px)',
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform active:scale-90"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        <button
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform active:scale-90"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Share2 size={17} className="text-white" />
        </button>
      </div>

      {/* Cover + Info */}
      <div className="relative z-10 pt-28 px-5 flex gap-5 items-end">
        {/* Cover */}
        <div
          className="shrink-0 relative"
          style={{
            width: 120,
            height: 168,
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <Image
            src={detail.thumb || 'https://picsum.photos/400/600'}
            alt={detail.title}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            unoptimized
          />
          {/* Status badge on cover */}
          <div
            className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 py-1 rounded-lg"
            style={{
              background: 'rgba(58,200,186,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Flame size={10} className="text-white fill-white" />
            <span className="text-[9px] font-black text-white tracking-wider">ONGOING</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0 pb-1">
          <h1 className="text-xl font-black text-white leading-tight mb-2 line-clamp-3">
            {detail.title}
          </h1>
          <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            by <span className="text-[#3AC8BA]">Komiku Authors</span>
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white/70">8.5</span>
            </div>
            <div
              className="w-[1px] h-3"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            />
            <div className="flex items-center gap-1">
              <BookOpen size={11} className="text-white/40" />
              <span className="text-xs font-bold text-white/70">{totalChapters} Ch</span>
            </div>
            <div
              className="w-[1px] h-3"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            />
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-white/40" />
              <span className="text-xs font-bold text-white/70">
                {latestChapter?.date || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 px-5 mt-5 flex gap-3">
        {/* Read Button */}
        {firstChapter && (
          <Link
            href={`/chapter?url=${encodeURIComponent(firstChapter.link)}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #3AC8BA 0%, #1A9088 100%)',
              boxShadow: '0 8px 24px rgba(58,200,186,0.35)',
              color: '#0A0C10',
            }}
          >
            <Play size={15} className="fill-current" />
            Baca Sekarang
          </Link>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite({
            title: detail.title,
            link: url as string,
            thumb: detail.thumb,
            desc: detail.synopsis?.slice(0, 50),
          })}
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-90 shrink-0"
          style={{
            background: mounted && isFav
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(255,255,255,0.05)',
            border: mounted && isFav
              ? '1px solid rgba(239,68,68,0.3)'
              : '1px solid rgba(255,255,255,0.08)',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          <Heart
            size={20}
            className="transition-all duration-300"
            style={{
              color: mounted && isFav ? '#EF4444' : 'rgba(255,255,255,0.5)',
              fill: mounted && isFav ? '#EF4444' : 'none',
            }}
          />
        </button>

        {/* Library Button */}
        <button
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <BookMarked size={18} className="text-white/50" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div
        className="relative z-10 mt-6 mx-0 rounded-t-[32px] min-h-[60vh] pb-40"
        style={{
          background: '#0F1117',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        </div>

        <div className="px-5 pt-3">
          {/* Synopsis */}
          <div className="mb-6">
            <h3 className="text-sm font-black text-white mb-2 tracking-tight">Sinopsis</h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.5)',
                display: '-webkit-box',
                WebkitLineClamp: isDescExpanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: isDescExpanded ? 'visible' : 'hidden',
              }}
            >
              {detail.synopsis || 'Tidak ada sinopsis tersedia.'}
            </p>
            {detail.synopsis && detail.synopsis.length > 150 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-2 flex items-center gap-1 text-xs font-bold text-[#3AC8BA]"
              >
                {isDescExpanded ? (
                  <><ChevronUp size={13} /> Lebih sedikit</>
                ) : (
                  <><ChevronDown size={13} /> Selengkapnya</>
                )}
              </button>
            )}
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 p-1 mb-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {['Chapters', 'Info'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200"
                style={{
                  background: activeTab === tab
                    ? 'rgba(58,200,186,0.12)'
                    : 'transparent',
                  color: activeTab === tab ? '#3AC8BA' : 'rgba(255,255,255,0.35)',
                  border: activeTab === tab
                    ? '1px solid rgba(58,200,186,0.2)'
                    : '1px solid transparent',
                }}
              >
                {tab}
                {tab === 'Chapters' && totalChapters > 0 && (
                  <span
                    className="ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-black"
                    style={{
                      background: activeTab === tab
                        ? 'rgba(58,200,186,0.2)'
                        : 'rgba(255,255,255,0.07)',
                      color: activeTab === tab ? '#3AC8BA' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {totalChapters}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Chapters' && (
            <div className="space-y-2">
              {totalChapters === 0 ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <BookOpen size={22} className="text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm">Belum ada chapter.</p>
                </div>
              ) : (
                detail.chapters.map((chapter: any, i: number) => (
                  <Link
                    href={`/chapter?url=${encodeURIComponent(chapter.link)}`}
                    key={i}
                    className="flex items-center gap-4 p-3.5 rounded-2xl group transition-all active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(58,200,186,0.05)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(58,200,186,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    {/* Chapter number bubble */}
                    <div
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl font-black text-sm"
                      style={{
                        background: i === 0
                          ? 'rgba(58,200,186,0.12)'
                          : 'rgba(255,255,255,0.05)',
                        border: i === 0
                          ? '1px solid rgba(58,200,186,0.25)'
                          : '1px solid rgba(255,255,255,0.07)',
                        color: i === 0 ? '#3AC8BA' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {totalChapters - i}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-sm truncate transition-colors"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                      >
                        {chapter.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                        {chapter.date || 'Unknown'}
                      </p>
                    </div>

                    {/* NEW badge for latest */}
                    {i === 0 && (
                      <div
                        className="shrink-0 px-2 py-1 rounded-lg text-[9px] font-black"
                        style={{
                          background: 'rgba(58,200,186,0.12)',
                          border: '1px solid rgba(58,200,186,0.25)',
                          color: '#3AC8BA',
                          letterSpacing: '0.05em',
                        }}
                      >
                        NEW
                      </div>
                    )}

                    <ChevronLeft
                      size={16}
                      className="rotate-180 shrink-0 transition-transform group-hover:translate-x-0.5"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                    />
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'Info' && (
            <div className="space-y-3">
              {[
                { label: 'Status', value: 'Ongoing', icon: <Flame size={14} className="text-[#3AC8BA]" /> },
                { label: 'Total Chapter', value: `${totalChapters} Chapter`, icon: <BookOpen size={14} className="text-[#3AC8BA]" /> },
                { label: 'Update Terakhir', value: latestChapter?.date || 'Unknown', icon: <Clock size={14} className="text-[#3AC8BA]" /> },
                { label: 'Rating', value: '8.5 / 10', icon: <Star size={14} className="text-amber-400 fill-amber-400" /> },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(58,200,186,0.08)' }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      {totalChapters > 0 && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-5"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
        >
          {/* Blur background */}
          <div
            className="absolute inset-x-0 bottom-0 top-[-20px]"
            style={{
              background: 'linear-gradient(to top, #0F1117 60%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          <div className="relative flex gap-3 pb-5">
            {/* Continue reading latest */}
            {latestChapter && (
              <Link
                href={`/chapter?url=${encodeURIComponent(latestChapter.link)}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-transform active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #3AC8BA 0%, #1A9088 100%)',
                  boxShadow: '0 8px 32px rgba(58,200,186,0.35)',
                  color: '#0A0C10',
                }}
              >
                <Play size={15} className="fill-current" />
                Chapter Terbaru
              </Link>
            )}

            {/* First chapter */}
            {firstChapter && firstChapter.link !== latestChapter?.link && (
              <Link
                href={`/chapter?url=${encodeURIComponent(firstChapter.link)}`}
                className="flex items-center justify-center gap-1.5 px-5 py-4 rounded-2xl font-bold text-sm transition-transform active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Check size={13} />
                Dari Awal
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MangaPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#0A0C10]">
        <div className="w-10 h-10 rounded-full border-2 border-[#3AC8BA] border-t-transparent animate-spin" />
      </div>
    }>
      <MangaDetailContent />
    </Suspense>
  );
}