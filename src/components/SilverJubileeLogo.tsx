import React from 'react';
import silverJubileeLogo from '../assets/images/silver_jubilee_logo.jpg';

interface SilverJubileeLogoProps {
  size?: number;
  showSubtitle?: boolean;
}

export const SilverJubileeLogo: React.FC<SilverJubileeLogoProps> = ({
  size = 48,
  showSubtitle = true,
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* 25 Years Silver Jubilee Emblem */}
      <div className="relative flex-shrink-0 group">
        <div
          style={{ width: size, height: size }}
          className="rounded-2xl overflow-hidden shadow-sm border border-amber-200/60 bg-white p-0.5 transition-transform duration-300 group-hover:scale-105"
        >
          <img
            src={silverJubileeLogo}
            alt="شعار اليوبيل الفضي - مدارس الرشيد الحديثة 25 عاماً"
            className="w-full h-full object-contain rounded-xl"
            loading="eager"
          />
        </div>

        {/* Subtle 25 Years Golden Badge Tag */}
        <span className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[9px] font-bold shadow-xs border border-white leading-none">
          25 عاماً
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-right">
        <div className="flex items-center gap-2">
          <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight tracking-tight">
            مدارس الرشيد الحديثة
          </h1>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded-md hidden sm:inline-block">
            اليوبيل الفضي
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
            <span className="text-[#006967] font-semibold">فرع معين إنجليزي</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 text-[11px]">ربع قرن من الريادة والتميز (1999–2024)</span>
          </div>
        )}
      </div>
    </div>
  );
};
