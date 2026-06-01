'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MangaCard } from '@/components/MangaCard';
import { ScrollingTitle } from '@/components/ScrollingTitle';
import { Loader2, Search, SlidersHorizontal, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Home() {
    const router = useRouter();
    const [categories, setCategories] = useState<{category: string, items: any[]}[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        async function fetchTrending() {
            try {
                const res = await fetch('/api/manga/home');
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setCategories(json.data);
                } else {
                    setError(json.message || 'Gagal memuat rekomendasi');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan sistem');
            } finally {
                setLoading(false);
            }
        }
        fetchTrending();
    }, []);

    const availableTabs = ['All', ...categories.map(c => c.category)];
    // Ensure active tab defaults to 'All'
    
    // Filter logic
    let displayContent = null;

    if (activeTab === 'All') {
        const allItems = categories.flatMap(c => c.items);
        const uniqueItemsMap = new Map();
        for (const item of allItems) {
            if (!uniqueItemsMap.has(item.title)) {
                uniqueItemsMap.set(item.title, item);
            }
        }
        const recommendations = Array.from(uniqueItemsMap.values()).slice(0, 15);

        displayContent = (
            <motion.div 
                className="space-y-8 pb-32"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Recommendation Slider */}
                {recommendations.length > 0 && (
                    <motion.div variants={itemVariants} className="space-y-4 mt-2">
                        <div className="flex items-center justify-between px-6">
                            <h2 className="text-2xl font-black text-white">Recommendations</h2>
                            <button className="text-sm font-bold text-[#3AC8BA]">View All</button>
                        </div>
                        <div className="w-full relative">
                            <Swiper
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                loop={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                modules={[EffectCoverflow, Autoplay]}
                                className="w-full pb-8"
                            >
                                {recommendations.map((manga, i) => (
                                    <SwiperSlide key={i} className="!w-[240px] !h-[340px]">
                                        <Link href={`/manga?url=${encodeURIComponent(manga.link)}`} className="w-full h-full rounded-3xl overflow-hidden relative group block">
                                            <img src={manga.thumb} alt={manga.title} className="absolute inset-0 w-full h-full object-cover" />
                                            {/* Gradient overlay similar to Billie Eilish UI */}
                                            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#13151A] via-[rgba(19,21,26,0.6)] to-transparent"></div>
                                            <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end h-full">
                                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                                                    <ScrollingTitle text={manga.title} className="font-bold text-white drop-shadow-md text-center" />
                                                    {manga.desc && (
                                                        <p className="text-xs text-white/80 line-clamp-1 font-medium mt-1 text-center drop-shadow-md flex items-center justify-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#3AC8BA] inline-block"></span>
                                                            {manga.desc.substring(0, 20)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4 bg-[#3AC8BA] text-[#13151A] text-xs font-black px-3 py-1.5 rounded-full shadow-lg">HOT</div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </motion.div>
                )}

                {categories.map((cat, idx) => {
                    // Different layout based on index % 3
                    const layoutType = idx % 3;
                    
                    if (layoutType === 0) {
                        // Layout 0: Horizontal Carousel
                        return (
                            <motion.div variants={itemVariants} key={cat.category} className="space-y-3">
                                <div className="flex items-center justify-between px-6">
                                    <h2 className="text-xl font-black text-white">{cat.category}</h2>
                                    <button onClick={() => setActiveTab(cat.category)} className="text-sm font-bold text-[#3AC8BA]">See All</button>
                                </div>
                                <div className="flex overflow-x-auto gap-4 px-6 pb-4 hide-scrollbar snap-x scroll-pl-6">
                                    {cat.items.map((manga, i) => (
                                        <div key={i} className="min-w-[160px] max-w-[160px] shrink-0 snap-start">
                                            <MangaCard {...manga} />
                                        </div>
                                    ))}
                                    <div className="w-2 shrink-0"></div>
                                </div>
                            </motion.div>
                        );
                    } else if (layoutType === 1) {
                        // Layout 1: Grid (first 4 items)
                        return (
                            <motion.div variants={itemVariants} key={cat.category} className="space-y-3 px-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-white">{cat.category}</h2>
                                    <button onClick={() => setActiveTab(cat.category)} className="text-sm font-bold text-[#3AC8BA]">See All</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {cat.items.slice(0, 4).map((manga, i) => (
                                        <div key={i} className="w-full">
                                            <MangaCard {...manga} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    } else {
                        // Layout 2: Vertical List
                        return (
                            <motion.div variants={itemVariants} key={cat.category} className="space-y-3 px-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-white">{cat.category}</h2>
                                    <button onClick={() => setActiveTab(cat.category)} className="text-sm font-bold text-[#3AC8BA]">See All</button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {cat.items.slice(0, 3).map((manga, i) => (
                                        <Link href={`/manga?url=${encodeURIComponent(manga.link)}`} key={i} className="flex gap-4 p-3 bg-[#1C1F26] rounded-2xl border border-white/5 items-center group">
                                            <div className="w-16 h-20 shrink-0 rounded-xl bg-[#13151A] relative shadow-sm">
                                                <Image src={manga.thumb} alt={manga.title} fill className="object-cover rounded-xl group-hover:scale-105 transition-transform" unoptimized />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <ScrollingTitle text={manga.title} className="font-bold text-white group-hover:text-[#3AC8BA] transition-colors" />
                                                <p className="text-xs text-gray-500 font-medium mt-1">{manga.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    }
                })}
            </motion.div>
        );
    } else {
        const selectedCat = categories.find(c => c.category === activeTab);
        displayContent = selectedCat ? (
            <motion.div 
                className="px-6 grid grid-cols-2 gap-4 pb-32"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {selectedCat.items.map((manga, i) => (
                    <motion.div variants={itemVariants} key={i}>
                        <MangaCard {...manga} />
                    </motion.div>
                ))}
            </motion.div>
        ) : (
            <div className="px-6 py-10 flex flex-col items-center">
                <p className="text-gray-500">Kategori kosong.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 bg-[#13151A] min-h-screen pb-20">
            {/* Header: Eth / Balance and Profile */}
            <div className="px-6 pt-12 pb-2 flex justify-between items-center z-30">
                <div className="flex items-center gap-2 bg-[#1C1F26] px-4 py-2 rounded-2xl border border-white/5">
                    <svg className="w-4 h-4 text-[#3AC8BA]" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 2 12 12 22 22 12" />
                    </svg>
                    <span className="font-bold text-white text-sm">Komikku.</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-[#1C1F26] border border-white/5 flex items-center justify-center relative">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <span className="absolute top-[10px] right-[10px] w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </button>
                    <Link href="/profile" className="w-10 h-10 rounded-full border border-white/5 opacity-90 hover:opacity-100 relative overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fun&backgroundColor=252830" alt="Avatar" className="w-full h-full object-cover" />
                    </Link>
                </div>
            </div>

            {/* Fake Search Bar */}
            <div className="px-6 py-2">
                <div onClick={() => router.push('/search')} className="w-full bg-[#1C1F26] rounded-full px-5 py-4 flex items-center gap-3 border border-white/5 cursor-pointer hover:bg-[#202530] transition-colors">
                    <Search className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-500 font-medium flex-1 text-sm">Ape, naruto...</span>
                    <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                </div>
            </div>

            {/* Categories Horizontal Tabs */}
            <div className="py-2">
                <div className="flex overflow-x-auto gap-3 px-6 hide-scrollbar snap-x scroll-pl-6">
                    {availableTabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm shrink-0 snap-start transition-colors ${activeTab === tab ? 'bg-[#3AC8BA] text-[#13151A]' : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1D24]'}`}
                        >
                            {tab}
                        </button>
                    ))}
                    <div className="w-2 shrink-0"></div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-8 pb-32">
                    <div className="px-6 space-y-3 mt-2">
                        <div className="w-48 h-8 rounded-xl shimmer mb-2"></div>
                        <div className="flex overflow-x-auto gap-4 hide-scrollbar snap-x scroll-pl-6 px-6 -mx-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="min-w-[240px] h-[340px] rounded-3xl shimmer shrink-0 snap-start"></div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-6">
                            <div className="w-32 h-7 rounded-lg shimmer"></div>
                            <div className="w-16 h-4 rounded-lg shimmer"></div>
                        </div>
                        <div className="flex overflow-x-auto gap-4 px-6 hide-scrollbar snap-x scroll-pl-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="min-w-[160px] h-[240px] rounded-2xl shimmer shrink-0 snap-start"></div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3 px-6">
                        <div className="flex items-center justify-between">
                            <div className="w-32 h-7 rounded-lg shimmer"></div>
                            <div className="w-16 h-4 rounded-lg shimmer"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-full h-[240px] rounded-2xl shimmer"></div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className="px-6 py-10">
                    <div className="bg-[#1A1D24] text-red-400 p-6 rounded-3xl border border-red-500/20 font-medium shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                        <p>{error}</p>
                    </div>
                </div>
            ) : (
                displayContent
            )}
            
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .shimmer {
                    background: linear-gradient(90deg, #1A1D24 25%, #252A36 50%, #1A1D24 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* Modern title bounce animation */
                .title-container {
                    container-type: inline-size;
                    width: 100%;
                    overflow: hidden;
                }
                .group:hover .title-container {
                    mask-image: linear-gradient(90deg, #000 0%, #000 90%, transparent 100%);
                    -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 90%, transparent 100%);
                }
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
