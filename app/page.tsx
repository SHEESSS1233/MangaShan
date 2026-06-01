"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MangaCard } from "@/components/MangaCard";
import { ScrollingTitle } from "@/components/ScrollingTitle";
import { Loader2, Search, SlidersHorizontal, Bell, Flame, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
  loading: () => <div className="h-[420px] bg-[#0E1118] rounded-3xl animate-pulse mx-6" />,
});
const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false }
);

import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { category: string; items: any[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/manga/home");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        } else {
          setError(json.message || "Gagal memuat rekomendasi");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan sistem");
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  const availableTabs = ["All", ...categories.map((c) => c.category)];

  let displayContent = null;

  if (activeTab === "All") {
    const allItems = categories.flatMap((c) => c.items);
    const uniqueItemsMap = new Map();
    for (const item of allItems) {
      if (!uniqueItemsMap.has(item.title)) {
        uniqueItemsMap.set(item.title, item);
      }
    }
    const recommendations = Array.from(uniqueItemsMap.values()).slice(0, 15);

    displayContent = (
      <div className="space-y-10 pb-36 animate-fade-up">
        {/* Hero Slider */}
        {recommendations.length > 0 && (
          <div className="space-y-5 mt-2">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3AC8BA] to-[#1A9088] flex items-center justify-center shadow-lg shadow-[#3AC8BA]/20">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight leading-none">
                    Rekomendasi
                  </h2>
                  <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mt-0.5">
                    Pilihan untuk Anda
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-[#3AC8BA] hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5">
                Semua
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Swiper */}
            <div className="w-full relative">
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 60,
                  depth: 200,
                  modifier: 1.2,
                  slideShadows: false,
                }}
                loop={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                modules={[EffectCoverflow, Autoplay, Pagination]}
                className="w-full pb-10 hero-swiper"
              >
                {recommendations.map((manga, i) => (
                  <SwiperSlide key={i} className="!w-[260px] !h-[370px]">
                    <Link
                      href={`/manga?url=${encodeURIComponent(manga.link)}`}
                      className="w-full h-full relative block"
                      style={{ borderRadius: "24px", overflow: "hidden" }}
                    >
                      <img
                        src={manga.thumb}
                        alt={manga.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Gradient */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 35%, rgba(8,10,15,0.75) 65%, rgba(8,10,15,0.97) 100%)",
                        }}
                      />

                      {/* HOT Badge */}
                      <div
                        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 z-10"
                        style={{
                          background: "rgba(239,68,68,0.85)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "10px",
                          boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
                        }}
                      >
                        <Flame size={11} className="text-white fill-white" />
                        <span className="text-[10px] font-black text-white tracking-wider">
                          HOT
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                        <div
                          className="p-3 rounded-2xl"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <ScrollingTitle
                            text={manga.title}
                            className="font-bold text-white text-sm text-center"
                          />
                          {manga.desc && (
                            <p className="text-[11px] text-[#3AC8BA] font-semibold mt-1.5 text-center truncate">
                              {manga.desc.substring(0, 24)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}

        {/* Category Sections */}
        {categories.map((cat, idx) => {
          const layoutType = idx % 3;

          if (layoutType === 0) {
            return (
              <div key={cat.category} className="space-y-4">
                <div className="flex items-center justify-between px-6">
                  <h2 className="text-base font-black text-white tracking-tight">
                    {cat.category}
                  </h2>
                  <button
                    onClick={() => setActiveTab(cat.category)}
                    className="flex items-center gap-1 text-xs font-bold text-[#3AC8BA]"
                  >
                    See All <ChevronRight size={13} />
                  </button>
                </div>
                <div className="flex overflow-x-auto gap-3 px-6 pb-2 hide-scrollbar snap-x scroll-pl-6">
                  {cat.items.map((manga, i) => (
                    <div key={i} className="min-w-[148px] max-w-[148px] shrink-0 snap-start">
                      <MangaCard {...manga} />
                    </div>
                  ))}
                  <div className="w-2 shrink-0" />
                </div>
              </div>
            );
          } else if (layoutType === 1) {
            return (
              <div key={cat.category} className="space-y-4 px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white tracking-tight">
                    {cat.category}
                  </h2>
                  <button
                    onClick={() => setActiveTab(cat.category)}
                    className="flex items-center gap-1 text-xs font-bold text-[#3AC8BA]"
                  >
                    See All <ChevronRight size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {cat.items.slice(0, 4).map((manga, i) => (
                    <div key={i} className="w-full">
                      <MangaCard {...manga} />
                    </div>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <div key={cat.category} className="space-y-4 px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white tracking-tight">
                    {cat.category}
                  </h2>
                  <button
                    onClick={() => setActiveTab(cat.category)}
                    className="flex items-center gap-1 text-xs font-bold text-[#3AC8BA]"
                  >
                    See All <ChevronRight size={13} />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {cat.items.slice(0, 3).map((manga, i) => (
                    <Link
                      href={`/manga?url=${encodeURIComponent(manga.link)}`}
                      key={i}
                      className="flex gap-4 p-3.5 items-center group"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "18px",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(58,200,186,0.05)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(58,200,186,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                      }}
                    >
                      {/* Rank number */}
                      <span
                        className="font-black shrink-0"
                        style={{
                          fontSize: "22px",
                          color: i === 0 ? "#3AC8BA" : i === 1 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
                          width: "28px",
                          lineHeight: 1,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div
                        className="w-14 h-[72px] shrink-0 relative"
                        style={{ borderRadius: "12px", overflow: "hidden", background: "#0E1118" }}
                      >
                        <Image
                          src={manga.thumb}
                          alt={manga.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <ScrollingTitle
                          text={manga.title}
                          className="font-bold text-white text-sm"
                        />
                        <p
                          className="mt-1 truncate"
                          style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}
                        >
                          {manga.desc || "Update terbaru"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  } else {
    const selectedCat = categories.find((c) => c.category === activeTab);
    displayContent = selectedCat ? (
      <div className="px-6 grid grid-cols-2 gap-3 pb-36 animate-fade-up">
        {selectedCat.items.map((manga, i) => (
          <div key={i}>
            <MangaCard {...manga} />
          </div>
        ))}
      </div>
    ) : (
      <div className="px-6 py-10 flex flex-col items-center">
        <p className="text-white/30">Kategori kosong.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0C10] min-h-screen pb-20">

      {/* Header */}
      <div
        className="px-6 pt-14 pb-4 flex justify-between items-center sticky top-0 z-30"
        style={{
          background: "linear-gradient(180deg, rgba(10,12,16,0.98) 0%, rgba(10,12,16,0.85) 80%, transparent 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3AC8BA 0%, #1A9088 100%)",
              boxShadow: "0 4px 14px rgba(58,200,186,0.35)",
            }}
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 2 12 12 22 22 12" />
            </svg>
          </div>
          <span className="font-black text-white text-[17px] tracking-tight">
            Komikku
            <span className="text-[#3AC8BA]">.</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Bell size={16} className="text-white/70" />
            <span
              className="absolute"
              style={{
                top: 8,
                right: 8,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#EF4444",
                border: "1.5px solid #0A0C10",
              }}
            />
          </button>
          <Link
            href="/profile"
            className="w-9 h-9 rounded-xl overflow-hidden relative"
            style={{ border: "1.5px solid rgba(58,200,186,0.3)" }}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fun&backgroundColor=252830"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pt-1 pb-3">
        <div
          onClick={() => router.push("/search")}
          className="w-full flex items-center gap-3 cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "13px 18px",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(58,200,186,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
          }}
        >
          <Search size={16} className="text-white/30 shrink-0" />
          <span className="text-white/30 font-medium flex-1 text-sm">
            Cari manga, manhwa...
          </span>
          <div
            className="px-2 py-1 rounded-lg"
            style={{ background: "rgba(58,200,186,0.1)", border: "1px solid rgba(58,200,186,0.2)" }}
          >
            <SlidersHorizontal size={12} className="text-[#3AC8BA]" />
          </div>
        </div>
      </div>

      {/* Tab Pills */}
      <div className="py-2">
        <div className="flex overflow-x-auto gap-2 px-6 hide-scrollbar snap-x scroll-pl-6">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="shrink-0 snap-start font-bold text-xs transition-all duration-250"
              style={{
                padding: "8px 16px",
                borderRadius: "12px",
                background:
                  activeTab === tab
                    ? "linear-gradient(135deg, #3AC8BA 0%, #1A9088 100%)"
                    : "rgba(255,255,255,0.04)",
                color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
                border: activeTab === tab
                  ? "1px solid transparent"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(58,200,186,0.3)" : "none",
                transform: activeTab === tab ? "scale(1.03)" : "scale(1)",
              }}
            >
              {tab}
            </button>
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-10 pb-36 mt-4">
          <div className="px-6 space-y-4">
            <div className="w-40 h-7 rounded-xl shimmer" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[260px] h-[370px] rounded-3xl shimmer shrink-0" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-6">
              <div className="w-32 h-5 rounded-lg shimmer" />
              <div className="w-16 h-4 rounded-lg shimmer" />
            </div>
            <div className="flex gap-3 px-6 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[148px] h-[220px] rounded-2xl shimmer shrink-0" />
              ))}
            </div>
          </div>
          <div className="space-y-4 px-6">
            <div className="flex items-center justify-between">
              <div className="w-32 h-5 rounded-lg shimmer" />
              <div className="w-16 h-4 rounded-lg shimmer" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-[220px] rounded-2xl shimmer" />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="px-6 py-10">
          <div
            className="p-6 flex flex-col items-center text-center space-y-3"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: "20px",
            }}
          >
            <p className="text-red-400 font-medium text-sm">{error}</p>
          </div>
        </div>
      ) : (
        displayContent
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .shimmer {
          background: linear-gradient(90deg, #12151c 25%, #1a1f29 50%, #12151c 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .hero-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.3);
          opacity: 1;
          width: 6px;
          height: 6px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #3AC8BA;
          width: 20px;
          border-radius: 3px;
        }

        .title-container { container-type: inline-size; width: 100%; overflow: hidden; }
        .title-bounce {
          display: block;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .group:hover .title-bounce {
          width: max-content;
          min-width: 100%;
          text-overflow: clip;
          animation: bounce-text 3s ease-in-out infinite alternate;
        }
        @keyframes bounce-text {
          0%, 15% { transform: translateX(0); }
          85%, 100% { transform: translateX(min(0px, calc(100cqw - 100%))); }
        }
      `}</style>
    </div>
  );
}