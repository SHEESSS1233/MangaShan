"use client";

import {
  Code2,
  Users,
  ExternalLink,
  MessageCircle,
  Heart,
  Star,
  Layout,
} from "lucide-react";
import { useFavorites } from "@/lib/store";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);

  

  const favCount = mounted ? favorites.length : 0;

  return (
    <div className="min-h-screen bg-[#13151A] pb-32">
      {/* Header */}
      <div className="bg-[#13151A] px-6 pt-12 pb-6 sticky top-0 z-30 border-b border-white/5 shadow-sm backdrop-blur-md bg-[#13151A]/90">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Profile<span className="text-[#3AC8BA]">.</span>
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Tentang Komiku & Developer
        </p>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* App Info Card */}
        <div className="bg-gradient-to-br from-[#3AC8BA] to-[#3CC2B7] rounded-[2rem] p-8 text-[#13151A] shadow-xl shadow-[#3AC8BA]/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#13151A]/10 p-3 rounded-2xl backdrop-blur-md">
                <Layout className="w-8 h-8 text-[#13151A]" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">MangaShan</h2>
            </div>
            <p className="text-[#13151A]/80 leading-relaxed font-bold">
              Sebuah platform modern untuk membaca komik favorit kamu secara
              gratis, dengan antarmuka yang bersih, cepat, dan mudah digunakan.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1A1D24] p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#13151A] flex items-center justify-center border border-white/5">
              <Heart className="w-6 h-6 text-[#3AC8BA] fill-[#3AC8BA]" />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-white">
                {mounted ? favCount : "-"}
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">
                Disukai
              </p>
            </div>
          </div>
          <div className="bg-[#1A1D24] p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center space-y-3 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#13151A] flex items-center justify-center border border-white/5">
              <Star className="w-6 h-6 text-[#3AC8BA] fill-[#3AC8BA]" />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-white">N/A</h3>
              <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">
                Dibaca
              </p>
            </div>
          </div>
        </div>

        {/* Developer Info Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-[#1C1F26] p-2 rounded-xl text-[#3AC8BA] border border-white/5">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Tentang Developer
            </h3>
          </div>

          <div className="bg-[#1A1D24] rounded-[2rem] p-6 sm:p-8 border border-white/5 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#1C1F26] to-[#13151A] p-1 border border-white/5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1C1F26] shadow-sm relative">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Developer12&backgroundColor=1A1D24"
                      alt="Developer Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#3AC8BA] text-[#13151A] p-2 rounded-full shadow-sm border-2 border-[#1A1D24]">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">
                    Developer
                  </h4>
                  <p className="text-[#3AC8BA] font-bold text-sm tracking-wide uppercase mt-1">
                    Web Creator
                  </p>
                </div>
                <p className="text-gray-400 font-medium leading-relaxed">
                  Didedikasikan untuk membangun produk digital yang bermanfaat
                  dan aesthetic. Harapannya, web Komiku ini dapat menghibur dan
                  memberikan kenyamanan saat membaca manga favorit kalian.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Call to Action */}
        <div className="bg-[#0A0B0E] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#3AC8BA] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="bg-[#3AC8BA]/10 p-4 rounded-3xl backdrop-blur-sm border border-[#3AC8BA]/20">
              <MessageCircle className="w-10 h-10 text-[#3AC8BA]" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black tracking-tight">
                Gabung Saluran WhatsApp!
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed max-w-md mx-auto">
                Dapatkan info update fitur terbaru, info maintenance, berikan
                saran/masukan, dan terhubung langsung dengan Developer.
              </p>
            </div>

            <a
              href="https://whatsapp.com/channel/0029VbCcsJPDeONDOik3sk3H"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1C1F26] text-white border border-white/10 font-bold px-8 py-4 rounded-2xl hover:bg-[#252830] transition-all hover:-translate-y-1 shadow-lg group active:scale-95"
            >
              <Users className="w-5 h-5 text-[#3AC8BA] group-hover:scale-110 transition-transform" />
              Join Channel WhatsApp
              <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
            </a>
          </div>
        </div>

        {/* Footer/Credit */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm font-medium text-gray-500 flex items-center justify-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by
            <span className="font-bold text-gray-300">Developer</span>
          </p>
        </div>
      </div>
    </div>
  );
}

