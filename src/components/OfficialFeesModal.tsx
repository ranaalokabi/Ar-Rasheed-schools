import React from 'react';
import { X, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';
import { OFFICIAL_FEES_2026_2027 } from '../data/schoolData';

interface OfficialFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'ar' | 'en';
}

export const OfficialFeesModal: React.FC<OfficialFeesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 font-['Cairo',sans-serif]">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white border border-[#dedad0] rounded-3xl shadow-2xl overflow-hidden text-[#242b27]" dir="rtl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dedad0] bg-[#f8f7f4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#1e5d4e]">
              <ShieldCheck className="w-6 h-6 text-[#1e5d4e]" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#242b27]">
                جدول الرسوم والمنح الدراسية المعتمد 2026-2027
              </h3>
              <p className="text-xs text-[#1e5d4e] font-medium">
                مدارس الرشيد الحديثة - فرع معين إنجليزي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="space-y-6">
            {/* Official Fees Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1e5d4e] text-white">
                    <th className="py-3 px-4 font-bold border-b border-[#16483c]">الصف</th>
                    <th className="py-3 px-4 font-bold border-b border-[#16483c]">الرسوم الدراسية</th>
                    <th className="py-3 px-4 font-bold border-b border-[#16483c]">الكتب</th>
                    <th className="py-3 px-4 font-bold border-b border-[#16483c]">الزي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {OFFICIAL_FEES_2026_2027.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-teal-50/40 transition-colors' : 'bg-slate-50/70 hover:bg-teal-50/40 transition-colors'}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {item.gradeAr}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#1e5d4e] whitespace-nowrap">
                        {item.tuitionYER.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.booksYER.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                        {item.uniformDescriptionAr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Transportation Section */}
            <div className="bg-teal-50/80 rounded-2xl border border-teal-200 p-4 text-xs">
              <h5 className="font-bold text-[#1e5d4e] mb-1.5 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#1e5d4e]" />
                رسوم المواصلات المعتمدة:
              </h5>
              <p className="text-slate-700 leading-relaxed">
                رسوم المواصلات تتراوح من <strong>120,000 ريال</strong> إلى <strong>160,000 ريال</strong> للسنة بحسب البُعد، وقد تتغير أسعار المواصلات بحسب أسعار الوقود.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                * لا تحدد رسوم ثابتة داخل هذا النطاق إلا بعد تحديد موقع سكن الطالب والمسافة بدقة.
              </p>
            </div>

            {/* Discount Conditions & Policies Quick Highlights */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
              <h5 className="text-xs font-bold text-[#1e5d4e] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e5d4e]" />
                أنواع الخصومات الرسمية المعتمدة:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="font-bold text-[#1e5d4e] block mb-1">
                    1. خصم كامل السداد
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    سداد كامل الرسوم في شهر <strong>رمضان (20%)</strong>، وفي شهر <strong>شوال (15%)</strong>. ولا يحتسب الخصم بعد شوال.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="font-bold text-[#1e5d4e] block mb-1">
                    2. أوائل الجمهورية والشهادة الأساسية
                  </span>
                  <ul className="text-slate-600 space-y-1 text-[11px]">
                    <li>• الترتيب 1 إلى 5 جمهورية (تاسع): <strong>100%</strong></li>
                    <li>• الترتيب 6 إلى 10 جمهورية (تاسع): <strong>80%</strong></li>
                    <li>• 95% أو أكثر بتاسع (غير أوائل الجمهورية): <strong>30%</strong></li>
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="font-bold text-[#1e5d4e] block mb-1">
                    3. خصم الشركات
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    الطلاب المستفيدون من الشركات الموقعة اتفاقية مع المدرسة: خصم <strong>10%</strong>.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="font-bold text-[#1e5d4e] block mb-1">
                    4. أوائل المدرسة (على مستوى الصف)
                  </span>
                  <ul className="text-slate-600 space-y-1 text-[11px]">
                    <li>• المركز الأول في صفه: <strong>15%</strong></li>
                    <li>• المركز الثاني في صفه: <strong>12%</strong></li>
                    <li>• المركز الثالث في صفه: <strong>10%</strong></li>
                  </ul>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    (صفوف النقل 4 إلى 3 ثانوي داخل الصف نفسه)
                  </span>
                </div>
              </div>

              {/* Installments & Refund Policies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/80 text-xs">
                <div className="bg-teal-50/70 p-2.5 rounded-xl border border-teal-200/80 text-slate-700 text-[11px] leading-relaxed">
                  <strong className="text-[#1e5d4e]">التقسيط المعتمد:</strong> تتوفر إمكانية تقسيط الرسوم على 12 شهراً من خلال بنك اليمن والكويت بما يوفر خطة تقسيط مريحة.
                </div>
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80 text-slate-700 text-[11px] leading-relaxed">
                  <strong className="text-amber-800">سياسة الاسترجاع:</strong> في حال الاسترجاع، يتم خصم مبلغ الفترة التي درس فيها الطالب فقط.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#dedad0] bg-[#f8f7f4]">
          <span className="text-xs text-[#5e6964] flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#1e5d4e]" />
            للتواصل المباشر: الرقم: 1 218 606 | الهاتف: +967 771 444 242
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1e5d4e] hover:bg-[#16483c] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            إغلاق الجدول
          </button>
        </div>

      </div>
    </div>
  );
};
