import React from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { CreditCard, Percent, Landmark } from 'lucide-react';

interface HomeHeroProps {
  onSelectPrompt: (query: string) => void;
  onOpenFeesModal: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectPrompt,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-auto py-6 sm:py-10 px-3 sm:px-4 select-none font-['Cairo',sans-serif] animate-in fade-in duration-300">
      
      {/* Centered School Emblem */}
      <div className="mb-3 sm:mb-4">
        <SchoolEmblem size={68} className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18" />
      </div>

      {/* Main Heading with clamp responsive font sizing */}
      <h2 className="text-[clamp(1.05rem,4.2vw,1.75rem)] font-extrabold text-[#242b27] text-center tracking-tight leading-snug px-2">
        مرحباً بكم في مدارس الرشيد الحديثة - فرع معين إنجليزي
      </h2>

      {/* Subheading with clamp responsive font sizing */}
      <p className="mt-1.5 sm:mt-2 text-[clamp(0.8125rem,2.8vw,1.0625rem)] text-[#4a5550] text-center font-medium">
        كيف يمكنني مساعدتكم اليوم؟
      </p>

      {/* Quick Queries Section */}
      <div className="w-full max-w-2xl mt-6 sm:mt-9 flex flex-col items-start">
        
        {/* Label */}
        <div className="mb-2.5 self-end sm:self-auto text-[clamp(0.7rem,2.2vw,0.8125rem)] font-semibold text-[#3b4742]">
          <span>استفسارات سريعة وشائعة:</span>
        </div>

        {/* 3 Pills Row (matching screenshot layout with responsive clamp typography) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
          
          {/* Chip 1: جدول الرسوم 2026-2027 */}
          <button
            type="button"
            onClick={() => onSelectPrompt('ممكن اعرف الرسوم الدراسية للعام 2026-2027؟')}
            style={{ backgroundColor: '#feedff' }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2.5 rounded-xl bg-[#feedff] hover:bg-[#fbd9ff] border border-[#f3ccff] text-[#242b27] hover:border-[#a855f7] transition-all duration-150 cursor-pointer shadow-2xs group"
          >
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7e22ce] stroke-[2] group-hover:text-[#6b21a8] transition-colors flex-shrink-0" />
            <span className="text-[clamp(0.75rem,2.3vw,0.875rem)] font-semibold whitespace-nowrap text-[#4a044e]">
              جدول الرسوم 2026-2027
            </span>
          </button>

          {/* Chip 2: أنواع الخصومات المعتمدة */}
          <button
            type="button"
            onClick={() => onSelectPrompt('ما هي أنواع الخصومات المعتمدة؟')}
            style={{ backgroundColor: '#feedff' }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2.5 rounded-xl bg-[#feedff] hover:bg-[#fbd9ff] border border-[#f3ccff] text-[#242b27] hover:border-[#a855f7] transition-all duration-150 cursor-pointer shadow-2xs group"
          >
            <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7e22ce] stroke-[2.2] group-hover:text-[#6b21a8] transition-colors flex-shrink-0" />
            <span className="text-[clamp(0.75rem,2.3vw,0.875rem)] font-semibold whitespace-nowrap text-[#4a044e]">
              أنواع الخصومات المعتمدة
            </span>
          </button>

          {/* Chip 3: خطة التقسيط المعتمدة */}
          <button
            type="button"
            onClick={() => onSelectPrompt('كيف يمكنني تقسيط الرسوم الدراسية؟')}
            style={{ backgroundColor: '#feedff' }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2.5 rounded-xl bg-[#feedff] hover:bg-[#fbd9ff] border border-[#f3ccff] text-[#242b27] hover:border-[#a855f7] transition-all duration-150 cursor-pointer shadow-2xs group"
          >
            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7e22ce] stroke-[2] group-hover:text-[#6b21a8] transition-colors flex-shrink-0" />
            <span className="text-[clamp(0.75rem,2.3vw,0.875rem)] font-semibold whitespace-nowrap text-[#4a044e]">
              خطة التقسيط المعتمدة
            </span>
          </button>

        </div>

      </div>

    </div>
  );
};
