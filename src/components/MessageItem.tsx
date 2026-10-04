import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SchoolEmblem } from './SchoolEmblem';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: string;
  hasFeesAlert?: boolean;
}

interface MessageItemProps {
  message: ChatMessage;
  isPlayingAudio?: boolean;
  onPlayAudio?: (text: string, id: string) => void;
  onStopAudio?: () => void;
  onOpenFeesModal?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
}) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const cleanContent = message.content.replace(/\[OFFICIAL_FEES_SCHEDULE_IMAGE\]/g, '').trim();
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`animate-message-entrance flex items-start gap-2 sm:gap-3 my-2.5 sm:my-4 font-['Cairo',sans-serif] ${
        isAssistant ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Avatar with flex-shrink-0 (assistant only) */}
      {isAssistant && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-[#dedad0] flex items-center justify-center shadow-2xs flex-shrink-0 p-0.5 mt-0.5">
          <SchoolEmblem size={24} className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}

      {/* Bubble Container with responsive width */}
      <div className={`max-w-[94%] sm:max-w-[85%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        
        {/* User uploaded image if any */}
        {!isAssistant && message.image && (
          <div className="mb-2 rounded-2xl overflow-hidden border border-[#cfcac0] max-w-xs shadow-xs">
            <img src={message.image} alt="User upload" className="w-full h-auto max-h-44 object-cover" />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`p-3 sm:p-4 rounded-2xl transition-all shadow-xs relative overflow-hidden ${
            isAssistant
              ? 'bg-white/95 border border-[#dedad0] text-[#242b27] rounded-tr-xs'
              : 'text-white rounded-tl-xs shadow-sm border border-[#1b7f6c]/25'
          }`}
          style={
            !isAssistant
              ? {
                  background:
                    'linear-gradient(135deg, #10416e 0%, #0d5c70 34%, #0d7573 68%, #009384 100%)',
                }
              : undefined
          }
        >
          {!isAssistant && (
            <>
              {/* Subtle top-light gradient sheen for depth */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 60% at 80% 15%, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
                }}
              />

              {/* Elegant, subtle, smoothly blended wavy gradient */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 320 80"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`userWaveGrad1-${message.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.20" />
                    <stop offset="50%" stopColor="#0d9488" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.10" />
                  </linearGradient>
                  <linearGradient id={`userWaveGrad2-${message.id}`} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.18" />
                    <stop offset="55%" stopColor="#0f766e" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,36 C85,22 155,48 235,28 C285,16 305,26 320,22 L320,80 L0,80 Z"
                  fill={`url(#userWaveGrad1-${message.id})`}
                />
                <path
                  d="M0,52 C75,40 160,62 245,46 C290,36 310,44 320,40 L320,80 L0,80 Z"
                  fill={`url(#userWaveGrad2-${message.id})`}
                />
              </svg>
            </>
          )}

          {isAssistant ? (
            <div>
              {/* Header inside assistant bubble with clamp fonts */}
              <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-[#f0eee8] text-[clamp(0.6875rem,2vw,0.75rem)]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-bold text-[#1e5d4e] truncate">
                    مدارس الرشيد الحديثة
                  </span>
                </div>
                <span className="text-[#7d8782] text-[clamp(0.625rem,1.8vw,0.7rem)] flex-shrink-0">
                  {message.timestamp}
                </span>
              </div>

              {/* Message text content with responsive clamp typography and smooth fade-in motion */}
              <div className="text-[#242b27] text-[clamp(0.8125rem,2.5vw,0.9375rem)] leading-relaxed font-normal animate-message-text-fade">
                <MarkdownRenderer
                  content={
                    message.content?.trim()
                      ? message.content
                      : 'أهلاً بك 🤍 تفضل بطرح استفسارك وسأجيبك مباشرة.'
                  }
                />
              </div>

              {/* Footer controls inside bubble: Copy */}
              <div className="flex items-center justify-end pt-2 mt-2.5 border-t border-[#f0eee8] text-[clamp(0.6875rem,2vw,0.75rem)] text-[#7d8782]">
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-slate-100 text-[#5e6964] hover:text-[#1e5d4e] transition-colors cursor-pointer flex-shrink-0"
                  title="نسخ النص"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="text-[clamp(0.65rem,1.8vw,0.725rem)] text-emerald-600 font-semibold">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[clamp(0.65rem,1.8vw,0.725rem)]">نسخ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // User Bubble
            <div className="relative z-10 animate-message-text-fade">
              <div className="text-[clamp(0.8125rem,2.5vw,0.9375rem)] font-normal leading-relaxed text-white">
                {message.content}
              </div>
              <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-emerald-100/80 text-left mt-1">
                {message.timestamp}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
