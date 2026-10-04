import React from 'react';
import { X, BookOpen, Compass, Phone, MapPin, CheckCircle2, FileText, Briefcase, ExternalLink, Calendar } from 'lucide-react';
import { SchoolEmblem } from './SchoolEmblem';

interface SchoolGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolGuideModal: React.FC<SchoolGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in select-none">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#fbfaf7]">
          <div className="flex items-center gap-3">
            <SchoolEmblem size={36} />
            <div className="text-right">
              <h3 className="font-bold text-base text-slate-800">
                دليل مدارس الرشيد الحديثة
              </h3>
              <p className="text-xs text-[#006967] font-medium">
                فرع معين إنجليزي · دليل القبول والخدمات المعتمد 2026-2027
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-right text-sm text-slate-700 leading-relaxed font-['Cairo',sans-serif]">
          {/* Vision and Mission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <h4 className="font-bold text-[#1e5d4e] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <Compass className="w-4 h-4 text-[#1e5d4e]" />
                الرؤية:
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                "حيث التربية رسالة، والتعلم متعة، والإبداع ممارسة."
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80">
              <h4 className="font-bold text-[#1e5d4e] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-[#1e5d4e]" />
                الرسالة:
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                "إعداد جيل مبدع يشارك في بناء وطنه، من خلال بيئة تربوية وتعليمية مشوقة، وتنمية مهنية مستدامة، وتقنية معاصرة، وشراكة مجتمعية فاعلة."
              </p>
            </div>
          </div>

          {/* Pillars: International Curriculum */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-[#006967] font-bold text-xs sm:text-sm">
              <BookOpen className="w-4 h-4" />
              المناهج والتعليم الدولي
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                مناهج كامبريدج البريطانية المتطورة
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                معامل حاسوب وروبوتات حديثة
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                برامج محادثة لغة إنجليزية مكثفة
              </li>
            </ul>
          </div>

          {/* Registration & Required Documents */}
          <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40">
            <div className="flex items-center gap-2 mb-2 text-[#1e5d4e] font-bold text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              شروط التسجيل والوثائق المطلوبة
            </div>
            <ul className="text-xs text-slate-700 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b7f6c] flex-shrink-0" />
                صورة من شهادة الميلاد.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b7f6c] flex-shrink-0" />
                صورة من شهادة التطعيم.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b7f6c] flex-shrink-0" />
                صورة من بطاقة الأب.
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b7f6c] flex-shrink-0" />
                عدد 4 صور شخصية مقاس 4×6.
              </li>
              <li className="flex items-center gap-1.5 font-semibold text-[#1e5d4e] pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                يجب أن تكون الوثائق كاملة ومختومة ومعمدة من مكتب التربية.
              </li>
            </ul>

            {/* Transfer documents sub-section */}
            <div className="mt-3 pt-3 border-t border-emerald-200/60 text-xs">
              <span className="font-bold text-[#1e5d4e] block mb-1">مستندات النقل بحسب جهة قدوم الطالب:</span>
              <div className="space-y-1 text-[11.5px] text-slate-700">
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-slate-800">• داخل أمانة العاصمة:</span>
                  <span>استمارة نقل داخلي.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-slate-800">• من خارج أمانة العاصمة ومن محافظة أخرى داخل اليمن:</span>
                  <span>استمارة نقل محافظات.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-slate-800">• من خارج اليمن:</span>
                  <span>وثائق دراسية معمدة من جهة بلد القدوم، ثم وزارة الخارجية، ثم الكنترول.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accepted Ages for Early Stages */}
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-[#1e5d4e] font-bold text-xs sm:text-sm">
              <Calendar className="w-4 h-4 text-[#1e5d4e]" />
              الأعمار المقبولة للمراحل الأولى
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs">KG1</span>
                <span className="text-[#1e5d4e] font-semibold text-[11px]">أربع سنوات ونصف</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs">KG2</span>
                <span className="text-[#1e5d4e] font-semibold text-[11px]">خمس سنوات ونصف</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs">الصف الأول</span>
                <span className="text-[#1e5d4e] font-semibold text-[11px]">ست سنوات ونصف</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs">الصف الثاني</span>
                <span className="text-[#1e5d4e] font-semibold text-[11px]">سبع سنوات ونصف</span>
              </div>
            </div>
          </div>

          {/* Employment / Careers Official Portal */}
          <div className="p-3.5 rounded-2xl border border-cyan-200 bg-cyan-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="text-right">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#006967]">
                <Briefcase className="w-4 h-4" />
                <span>شروط ومعلومات التوظيف الرسمية</span>
              </div>
              <p className="text-[11.5px] text-slate-600 mt-1">
                الحد الأدنى للمؤهل: <strong>درجة البكالوريوس</strong> لأي وظيفة. وتعلن الشروط الخاصة عند توفر شواغر.
              </p>
            </div>
            <a
              href="https://www.rasheed.school/arabic/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006967] hover:bg-[#005250] text-white text-xs font-semibold transition-colors flex-shrink-0 shadow-2xs cursor-pointer"
            >
              <span>صفحة الوظائف الرسمية</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 gap-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>صنعاء - فرع معين إنجليزي</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[#1e5d4e]">الرقم:</span>
                <span dir="ltr" className="font-bold">1 218 606</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#1e5d4e]" />
                <span className="font-semibold text-[#1e5d4e]">الهاتف:</span>
                <span dir="ltr" className="font-bold">+967 771 444 242</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#fbfaf7] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#006967] hover:bg-[#005452] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};

