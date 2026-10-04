import React from 'react';
import { BookOpen, Calculator, MessageSquare, Phone, RotateCcw } from 'lucide-react';
import { SchoolEmblem } from './SchoolEmblem';

interface HeaderProps {
  onOpenFeesModal: () => void;
  onOpenCalculatorModal: () => void;
  onOpenGuideModal: () => void;
  onContactWhatsApp: () => void;
  onContactPhone: () => void;
  onResetChat?: () => void;
  hasMessages?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCalculatorModal,
  onOpenGuideModal,
  onContactWhatsApp,
  onContactPhone,
  onResetChat,
  hasMessages,
}) => {
  return (
    <header
      style={{ backgroundColor: '#ffffff' }}
      className="w-full bg-[#ffffff] backdrop-blur-md border-b border-[#dedad0]/80 shadow-2xs select-none sticky top-0 z-30 transition-all font-['Cairo',sans-serif]"
    >
      <div
        style={{ backgroundColor: '#ffffff' }}
        className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 bg-[#ffffff]"
      >
        
        {/* Right side in RTL: School Emblem & Name with responsive clamp font sizing */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-shrink select-none"
        >
          <SchoolEmblem size={36} className="w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0" />
          <div className="flex flex-col text-right min-w-0">
            <h1
              style={{ fontSize: '15px' }}
              className="font-extrabold text-[15px] !text-[15px] text-[#242b27] leading-tight tracking-tight truncate"
            >
              مدارس الرشيد الحديثة
            </h1>
            <span
              style={{
                fontSize: '12px',
                paddingLeft: '0px',
                paddingTop: '0px',
                paddingBottom: '4px',
              }}
              className="text-[12px] !text-[12px] font-semibold text-[#1e5d4e] leading-none mt-0.5 truncate pl-0 pt-0 pb-[4px]"
            >
              فرع معين إنجليزي
            </span>
          </div>
        </div>

        {/* Left side in RTL: School Guide, Fee Calculator + Chat + Phone */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#242b27] flex-shrink-0">
          
          {/* Explicit New Chat button only visible when there are active messages */}
          {hasMessages && onResetChat && (
            <button
              onClick={onResetChat}
              style={{ backgroundColor: '#f4f2ee' }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#f4f2ee] hover:bg-[#e8e5dc] text-[#4a5550] hover:text-[#1e5d4e] border border-[#dedad0] text-[clamp(0.6875rem,1.9vw,0.75rem)] font-semibold transition-all cursor-pointer shadow-2xs flex-shrink-0"
              title="بدء محادثة جديدة ومسح السياق"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2] flex-shrink-0" />
              <span className="hidden sm:inline">محادثة جديدة</span>
            </button>
          )}
          
          {/* 1. دليل المدرسة (School Guide) */}
          <button
            onClick={onOpenGuideModal}
            style={{ backgroundColor: '#e1f9fa' }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#e1f9fa] hover:bg-[#d0f4f5] border border-[#b2e8eb] text-[clamp(0.6875rem,1.9vw,0.75rem)] font-semibold text-[#134e4a] transition-all cursor-pointer shadow-2xs flex-shrink-0"
            title="دليل المدرسة والمعلومات الرسمية"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#134e4a] stroke-[2] flex-shrink-0" />
            <span className="hidden md:inline">دليل المدرسة</span>
          </button>

          {/* 2. حاسبة الرسوم (Fee Calculator) */}
          <button
            onClick={onOpenCalculatorModal}
            style={{ backgroundColor: '#e1f9fa' }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#e1f9fa] hover:bg-[#d0f4f5] border border-[#b2e8eb] text-[clamp(0.6875rem,1.9vw,0.75rem)] font-semibold text-[#134e4a] transition-all cursor-pointer shadow-2xs flex-shrink-0"
            title="حاسبة الرسوم والأقساط والخصومات"
          >
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#134e4a] stroke-[2] flex-shrink-0" />
            <span className="hidden md:inline">حاسبة الرسوم</span>
          </button>

          {/* 3. Chat Icon (WhatsApp / Direct Messaging) */}
          <button
            onClick={onContactWhatsApp}
            style={{ backgroundColor: '#ffffff' }}
            className="p-1.5 sm:p-2 rounded-xl bg-[#ffffff] text-[#2b3531] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#006967] transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
            title="تواصل مباشر عبر واتساب"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </button>

          {/* 4. Phone Icon (Direct Call) */}
          <button
            onClick={onContactPhone}
            style={{ backgroundColor: '#ffffff' }}
            className="p-1.5 sm:p-2 rounded-xl bg-[#ffffff] text-[#2b3531] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#006967] transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
            title="اتصال مباشر بإدارة المدرسة: +967 771 444 242"
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </button>

        </div>

      </div>
    </header>
  );
};
