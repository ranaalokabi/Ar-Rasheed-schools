import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';
import { adminConversationsService } from '../../services/adminConversationsService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isValid = adminConversationsService.verifyPasscode(passcode);
    if (isValid) {
      setPasscode('');
      onSuccess();
    } else {
      setError('رمز الدخول غير صحيح. يرجى التأكد والمحاولة مجدداً.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-['Cairo',sans-serif] animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#dedad0] overflow-hidden text-right"
        dir="rtl"
      >
        {/* Header Banner */}
        <div className="bg-[#1b7f6c] p-6 text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7 text-white stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            لوحة تحكم المشرفة (Admin Dashboard)
          </h2>
          <p className="text-xs text-white/80 mt-1 font-medium">
            منطقة الإدارة المصرح بها - مدارس الرشيد الحديثة
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="mb-5 p-3.5 rounded-2xl bg-[#f4f3ef] border border-[#dedad0] flex items-start gap-2.5 text-xs text-[#4a5550]">
            <ShieldCheck className="w-4 h-4 text-[#1b7f6c] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              هذه المنطقة مخصصة حصرياً للمشرفة لمراجعة المحادثات وتحسين جودة المساعد واكتشاف الأسئلة المتكررة وتصدير السجلات. لا تظهر هذه اللوحة للمستخدمين العاديين.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#242b27] mb-1.5">
                رمز دخول المشرفة (Admin Passcode)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="أدخلي رمز المرور..."
                  className="w-full pl-10 pr-10 py-2.5 bg-[#fcfbf9] border border-[#cfcac0] focus:border-[#1b7f6c] focus:bg-white rounded-xl text-sm text-[#242b27] font-sans focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Helpful hint for administrator */}
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#7d8782]">
                <span>الرمز الافتراضي: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#1b7f6c] font-semibold">admin2026</code></span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1b7f6c] hover:bg-[#166556] text-white text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>دخول لوحة التحكم</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
