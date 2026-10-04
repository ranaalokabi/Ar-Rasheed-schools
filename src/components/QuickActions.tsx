import React from 'react';
import { BookOpen, Calculator, GraduationCap } from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (query: string) => void;
  onOpenFeesModal: () => void;
  onOpenCalculatorModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSelectAction,
  onOpenFeesModal,
  onOpenCalculatorModal,
}) => {
  return (
    <div className="w-full pt-3 pb-1">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        
        {/* Action 1: Official Fees Schedule */}
        <button
          type="button"
          onClick={onOpenFeesModal}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-teal-300 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all duration-200 text-right group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#006967] group-hover:bg-[#006967] group-hover:text-white transition-colors flex-shrink-0">
            <BookOpen className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 group-hover:text-[#006967] transition-colors truncate">
              جدول الرسوم المعتمدة
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              للعام الدراسي 2026-2027
            </span>
          </div>
        </button>

        {/* Action 2: Smart Fee & Discount Calculator */}
        <button
          type="button"
          onClick={onOpenCalculatorModal}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-teal-300 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all duration-200 text-right group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors flex-shrink-0">
            <Calculator className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition-colors truncate">
              حاسبة الرسوم والخصومات
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              احتساب نسب الخصم والأقساط
            </span>
          </div>
        </button>

        {/* Action 3: Admission Requirements */}
        <button
          type="button"
          onClick={() => onSelectAction('ما هي شروط القبول والتسجيل والوثائق المطلوبة لفرع معين إنجليزي؟')}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-teal-300 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all duration-200 text-right group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 group-hover:bg-cyan-700 group-hover:text-white transition-colors flex-shrink-0">
            <GraduationCap className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 group-hover:text-cyan-800 transition-colors truncate">
              شروط القبول والتسجيل
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              اختبار المستوى والأوراق
            </span>
          </div>
        </button>

      </div>
    </div>
  );
};
