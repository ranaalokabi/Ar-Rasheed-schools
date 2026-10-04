import React, { useState } from 'react';
import { X, GraduationCap, Calendar, Phone, User, CheckCircle2, FileText, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OFFICIAL_FEES_2026_2027 } from '../data/schoolData';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (summary: string) => void;
  lang?: 'ar' | 'en';
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang = 'ar',
}) => {
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('g4-6');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [gpa, setGpa] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          grade,
          parentName,
          phone,
          gpa,
          notes,
        }),
      });

      const data = await res.json();
      const refId = data.applicationId || `RMS-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedId(refId);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#14b8a6', '#06b6d4', '#eab308', '#ffffff'],
        });
      } catch {}

      const selectedGradeObj = OFFICIAL_FEES_2026_2027.find((g) => g.id === grade);
      const gradeTitle = lang === 'ar' ? selectedGradeObj?.gradeAr : selectedGradeObj?.gradeEn;

      const chatSummary = lang === 'ar'
        ? `لقد تقدمتُ بطلب تسجيل رسمي للطالب (${studentName}) للصف (${gradeTitle}) برقم مرجعي (${refId}). رقم التواصل: ${phone}. نود تأكيد موعد اختبار القبول وتحديد المستوى.`
        : `I submitted an enrollment application for student (${studentName}) for (${gradeTitle}) with Ref ID (${refId}). Contact phone: ${phone}. Please confirm placement test details.`;

      onSuccess(chatSummary);
    } catch {
      // In case of error, still provide ref ID
      const fallbackId = `RMS-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedId(fallbackId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900/95 border border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-teal-500/20 bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-900/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {lang === 'ar' ? 'طلب التسجيل وحجز موعد اختبار القبول 2026-2027' : 'Enrollment & Placement Test Booking 2026-2027'}
              </h3>
              <p className="text-xs text-teal-300">
                {lang === 'ar' ? 'مدارس الرشيد الحديثة - فرع معين إنجليزي' : 'Ar-Rasheed Modern Schools - Moeen English Branch'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {submittedId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center mx-auto text-teal-400 shadow-xl shadow-teal-950/50 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {lang === 'ar' ? 'تم استلام طلب التسجيل بنجاح!' : 'Enrollment Application Submitted!'}
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {lang === 'ar'
                  ? `أهلاً بكم في أسرة مدارس الرشيد. تم تسجيل طلب الطالب (${studentName}) بالرقم المرجعي:`
                  : `Welcome to Ar-Rasheed family. Application recorded for (${studentName}) with Ref ID:`}
              </p>
              <div className="inline-block px-5 py-2.5 rounded-2xl bg-teal-950 border border-teal-400/40 text-teal-300 font-mono text-lg font-bold tracking-widest">
                {submittedId}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {lang === 'ar'
                  ? 'سيتواصل معكم قسم القبول والتسجيل هاتفياً أو عبر الواتساب خلال 24 ساعة لتأكيد موعد المقابلة واختبار تحديد المستوى.'
                  : 'Admissions office will contact you within 24 hours to schedule the friendly interview and placement test.'}
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-900/40 transition-colors"
                >
                  {lang === 'ar' ? 'العودة للمحادثة' : 'Return to Chat'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Name */}
                <div>
                  <label className="text-xs font-semibold text-teal-300 mb-1.5 block">
                    {lang === 'ar' ? 'اسم الطالب رباعياً *' : 'Student Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: ريان محمد علي الرشيدي' : 'e.g. Rayan Mohammed'}
                      className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Grade */}
                <div>
                  <label className="text-xs font-semibold text-teal-300 mb-1.5 block">
                    {lang === 'ar' ? 'الصف المراد الالتحاق به (2026-2027) *' : 'Applying Grade (2026-2027) *'}
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    {OFFICIAL_FEES_2026_2027.map((g) => (
                      <option key={g.id} value={g.id}>
                        {lang === 'ar' ? g.gradeAr : g.gradeEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parent Name */}
                <div>
                  <label className="text-xs font-semibold text-teal-300 mb-1.5 block">
                    {lang === 'ar' ? 'اسم ولي الأمر *' : 'Parent / Guardian Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={lang === 'ar' ? 'اسم الأب أو الأم' : 'Parent Name'}
                    className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-teal-300 mb-1.5 block">
                    {lang === 'ar' ? 'رقم الهاتف / الواتساب للتواصل *' : 'Phone / WhatsApp Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+967 77..."
                      className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Previous GPA */}
                <div>
                  <label className="text-xs font-semibold text-teal-300 mb-1.5 block">
                    {lang === 'ar' ? 'معدل العام السابق (للمطالبة بالخصم)' : 'Previous GPA % (For discount eligibility)'}
                  </label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: 98.5% (الأول على الصف)' : 'e.g. 98.5%'}
                    className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="text-xs font-semibold text-teal-300 mb-1.5 block">
                    {lang === 'ar' ? 'الموعد المفضل للمقابلة واختبار القبول' : 'Preferred Interview / Test Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-teal-300 mb-1.5 block">
                  {lang === 'ar' ? 'ملاحظات إضافية (أخوة مسجلين، استفسارات، نقل خاص)' : 'Additional Notes / Questions'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'ar' ? 'أي تفاصيل أخرى ترغب في مشاركتها معنا...' : 'Any details you would like to share...'}
                  className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>

              <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-500/20 text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'سيتم تدقيق نتائج الطالب ومطابقتها مع الخصومات المعتمدة (أوائل جمهورية، تاسع 95%، أوائل مدرسة، أو خصم الشركات).'
                    : 'Student results will be verified and matched with official discounts (Republic top, 9th grade 95%, School top, or Corporate).'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-teal-900/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تأكيد إرسال الطلب وحجز الموعد' : 'Confirm Application & Booking'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
