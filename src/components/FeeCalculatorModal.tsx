import React, { useState } from 'react';
import { X, Calculator, Sparkles, Send, Bus, User } from 'lucide-react';
import { OFFICIAL_FEES_2026_2027 } from '../data/schoolData';

interface FeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (inquiry: string) => void;
}

export const FeeCalculatorModal: React.FC<FeeCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState<string>('g9');
  const [gender, setGender] = useState<'boys' | 'girls'>('boys');
  const [selectedDiscountKey, setSelectedDiscountKey] = useState<string>('none');
  const [hasTransport, setHasTransport] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentGrade =
    OFFICIAL_FEES_2026_2027.find((g) => g.id === selectedGradeId) ||
    OFFICIAL_FEES_2026_2027[4]; // Default: Grade 9

  let totalDiscountPercent = 0;
  let discountLabel = 'بدون خصم (0%)';

  switch (selectedDiscountKey) {
    case 'fullPaymentRamadan':
      totalDiscountPercent = 20;
      discountLabel = 'خصم كامل السداد (20%) - خلال شهر رمضان';
      break;
    case 'fullPaymentShawwal':
      totalDiscountPercent = 15;
      discountLabel = 'خصم كامل السداد (15%) - خلال شهر شوال';
      break;
    case 'republic1to5':
      totalDiscountPercent = 100;
      discountLabel = 'أوائل الجمهورية: الأول إلى الخامس بالصف التاسع (100%)';
      break;
    case 'republic6to10':
      totalDiscountPercent = 80;
      discountLabel = 'أوائل الجمهورية: السادس إلى العاشر بالصف التاسع (80%)';
      break;
    case 'basicCert95':
      totalDiscountPercent = 30;
      discountLabel = 'نسبة 95% أو أكثر بالشهادة الأساسية بالصف التاسع لغير أوائل الجمهورية (30%)';
      break;
    case 'corporate':
      totalDiscountPercent = 10;
      discountLabel = 'خصم الشركات المتعاقدة (10%)';
      break;
    case 'schoolTop1':
      totalDiscountPercent = 15;
      discountLabel = 'المركز الأول في صفه (15%) - صفوف النقل 4 إلى 3 ثانوي';
      break;
    case 'schoolTop2':
      totalDiscountPercent = 12;
      discountLabel = 'المركز الثاني في صفه (12%) - صفوف النقل 4 إلى 3 ثانوي';
      break;
    case 'schoolTop3':
      totalDiscountPercent = 10;
      discountLabel = 'المركز الثالث في صفه (10%) - صفوف النقل 4 إلى 3 ثانوي';
      break;
    default:
      totalDiscountPercent = 0;
      discountLabel = 'بدون خصم (0%)';
  }

  const discountAmountYER = Math.round((currentGrade.tuitionYER * totalDiscountPercent) / 100);
  const netTuitionYER = currentGrade.tuitionYER - discountAmountYER;

  // Uniform fee calculation
  const uniformYER =
    currentGrade.uniformSameYER !== undefined
      ? currentGrade.uniformSameYER
      : gender === 'girls'
      ? currentGrade.uniformGirlsYER
      : currentGrade.uniformBoysYER;

  const totalRequiredFeesYER = netTuitionYER + currentGrade.booksYER + uniformYER;

  const handleConsultChat = () => {
    const summary = `أود الاستفسار عن تفاصيل تسجيل (${currentGrade.gradeAr})، الرسوم الدراسية: ${currentGrade.tuitionYER.toLocaleString()} ريال، الكتب: ${currentGrade.booksYER.toLocaleString()} ريال، والزي: ${uniformYER.toLocaleString()} ريال. وإمكانية التقسيط عبر بنك اليمن والكويت.`;
    onSendToChat(summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#006967]">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                حاسبة الرسوم الرسمية المعتمدة 2026-2027
              </h3>
              <p className="text-xs text-[#006967] font-medium">
                مدارس الرشيد الحديثة - الفروع الإنجليزية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Step 1: Grade Selection */}
          <div>
            <label className="text-xs font-bold text-[#006967] mb-2 block tracking-wider">
              1. اختر الصف الدراسي:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OFFICIAL_FEES_2026_2027.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGradeId(grade.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                    selectedGradeId === grade.id
                      ? 'bg-[#006967] border-[#006967] text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {grade.stageAr}
                </button>
              ))}
            </div>
          </div>

          {/* Gender selection for grades with different uniform prices */}
          {currentGrade.uniformSameYER === undefined && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#006967]" />
                نوع الزي المدرسي:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGender('boys')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    gender === 'boys'
                      ? 'bg-[#006967] border-[#006967] text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  الأولاد (20,000 ريال)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('girls')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    gender === 'girls'
                      ? 'bg-[#006967] border-[#006967] text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  البنات (10,000 ريال)
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Discount & Bus Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Discount Selector */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-800 mb-2 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                2. نوع الخصم المعتمد (إن وجد):
              </label>
              <select
                value={selectedDiscountKey}
                onChange={(e) => setSelectedDiscountKey(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#006967]"
              >
                <option value="none">بدون خصم (0%)</option>
                <optgroup label="1. خصم كامل السداد">
                  <option value="fullPaymentRamadan">سداد كامل الرسوم في شهر رمضان (20%)</option>
                  <option value="fullPaymentShawwal">سداد كامل الرسوم في شهر شوال (15%)</option>
                </optgroup>
                <optgroup label="2. أوائل الجمهورية والشهادة الأساسية (الصف التاسع)">
                  <option value="republic1to5">أوائل الجمهورية: الترتيب 1 إلى 5 (100%)</option>
                  <option value="republic6to10">أوائل الجمهورية: الترتيب 6 إلى 10 (80%)</option>
                  <option value="basicCert95">الحصول على 95% أو أكثر بالشهادة الأساسية لغير أوائل الجمهورية (30%)</option>
                </optgroup>
                <optgroup label="3. خصم الشركات">
                  <option value="corporate">الشركات الموقعة اتفاقية مع المدرسة (10%)</option>
                </optgroup>
                <optgroup label="4. أوائل المدرسة (على مستوى الصف - صفوف النقل 4 إلى 3 ثانوي)">
                  <option value="schoolTop1">المركز الأول في صفه (15%)</option>
                  <option value="schoolTop2">المركز الثاني في صفه (12%)</option>
                  <option value="schoolTop3">المركز الثالث في صفه (10%)- النقل 4 إلى 3 ثانوي</option>
                </optgroup>
              </select>
            </div>

            {/* Bus Service Selector */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-800 mb-2 block flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-cyan-600" />
                3. خدمة الحافلات المدرسية:
              </label>
              <select
                value={hasTransport ? 'bus' : 'none'}
                onChange={(e) => setHasTransport(e.target.value === 'bus')}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#006967]"
              >
                <option value="none">بدون باص (مواصلات خاصة)</option>
                <option value="bus">الاشتراك بالحافلة (120,000 - 160,000 ريال بحسب البُعد)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-2">
                * رسوم المواصلات تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، وقد تتغير بحسب أسعار الوقود.
              </p>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            
            {/* Header of summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">الصف الدراسي المختار</span>
                <span className="text-base font-bold text-slate-900">{currentGrade.gradeAr}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#006967] font-bold block uppercase tracking-wider">
                  إجمالي الرسوم الرسمية (دراسة + كتب + زي)
                </span>
                <span className="text-2xl font-black text-[#006967]">
                  {totalRequiredFeesYER.toLocaleString()} ريال
                </span>
              </div>
            </div>

            {/* Itemized details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">الرسوم الدراسية</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {currentGrade.tuitionYER.toLocaleString()} ريال
                </span>
                {totalDiscountPercent > 0 && (
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                    خصم {totalDiscountPercent}% (-{discountAmountYER.toLocaleString()} ريال) = {netTuitionYER.toLocaleString()} ريال
                  </span>
                )}
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">رسوم الكتب</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {currentGrade.booksYER.toLocaleString()} ريال
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">رسوم الزي المدرسي</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {uniformYER.toLocaleString()} ريال
                </span>
                {currentGrade.uniformSameYER === undefined && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ({gender === 'girls' ? 'زي البنات' : 'زي الأولاد'})
                  </span>
                )}
              </div>
            </div>

            {hasTransport && (
              <div className="p-3 bg-cyan-50/70 border border-cyan-200/80 rounded-xl text-xs text-slate-700 leading-relaxed">
                <strong>رسوم المواصلات:</strong> تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، ويتم تحديد المبلغ الدقيق بحسب موقع السكن ومسافة السير.
              </div>
            )}

            {/* Bank Installments & Refund Notice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-teal-200/80 shadow-2xs">
                <span className="text-xs font-bold text-[#006967] block mb-1">
                  خطة التقسيط المعتمدة:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  تتوفر إمكانية تقسيط الرسوم على <strong>12 شهراً</strong> من خلال <strong>بنك اليمن والكويت</strong>، بما يوفر خطة تقسيط مريحة.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  سياسة الاسترجاع المعتمدة:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  في حال الاسترجاع، يتم خصم مبلغ الفترة التي درس فيها الطالب فقط.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 text-xs transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={handleConsultChat}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006967] hover:bg-[#064e49] text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            استفسر عن هذه الخطة في المحادثة
          </button>
        </div>

      </div>
    </div>
  );
};
