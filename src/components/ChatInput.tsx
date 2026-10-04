import React, { useRef, useState, useEffect } from 'react';
import { ArrowUp, Mic, Square, Paperclip, X, AlertCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, imageBase64?: string, imageMimeType?: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [attachedImage, setAttachedImage] = useState<{
    dataUrl: string;
    mimeType: string;
    fileName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Speech Recognition references
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const isExplicitlyStoppedRef = useRef<boolean>(false);
  const baseTextRef = useRef<string>('');
  const currentInputTextRef = useRef<string>('');

  // Keep currentInputTextRef synchronized with inputText
  useEffect(() => {
    currentInputTextRef.current = inputText;
  }, [inputText]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      isExplicitlyStoppedRef.current = true;
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleSend = () => {
    if ((!inputText.trim() && !attachedImage) || isLoading) return;

    // If speech recognition is still active, stop it before sending
    if (isListeningRef.current) {
      stopListening();
    }

    onSendMessage(
      inputText.trim(),
      attachedImage?.dataUrl,
      attachedImage?.mimeType
    );

    setInputText('');
    currentInputTextRef.current = '';
    baseTextRef.current = '';
    setAttachedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAttachedImage({
        dataUrl,
        mimeType: file.type || 'image/jpeg',
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine speech recognition language dynamically
  // Default: ar-YE. English: en-US if document is English or input is typed in English
  const getRecognitionLanguage = (currentText: string) => {
    if (typeof document !== 'undefined') {
      const docLang = document.documentElement.lang?.toLowerCase();
      if (docLang && docLang.startsWith('en')) {
        return 'en-US';
      }
    }
    const trimmed = currentText.trim();
    if (trimmed && /^[a-zA-Z0-9\s.,?!'":;()\-]+$/.test(trimmed)) {
      return 'en-US';
    }
    return 'ar-YE';
  };

  // Instantiate and configure browser native SpeechRecognition
  const createRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getRecognitionLanguage(baseTextRef.current);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        const text = item[0]?.transcript || '';
        if (item.isFinal) {
          if (finalTranscript && !finalTranscript.endsWith(' ') && !text.startsWith(' ')) {
            finalTranscript += ' ';
          }
          finalTranscript += text;
        } else {
          if (interimTranscript && !interimTranscript.endsWith(' ') && !text.startsWith(' ')) {
            interimTranscript += ' ';
          }
          interimTranscript += text;
        }
      }

      const speechCombined = (
        finalTranscript +
        (interimTranscript ? (finalTranscript && !finalTranscript.endsWith(' ') ? ' ' : '') + interimTranscript : '')
      ).trim();

      const base = baseTextRef.current;
      let newTotal = '';
      if (!speechCombined) {
        newTotal = base;
      } else if (!base) {
        newTotal = speechCombined;
      } else {
        const separator = base.endsWith(' ') ? '' : ' ';
        newTotal = `${base}${separator}${speechCombined}`;
      }

      setInputText(newTotal);
      currentInputTextRef.current = newTotal;
    };

    recognition.onerror = (event: any) => {
      console.warn('[SpeechRecognition Error]', event?.error);
      const error = event?.error;

      if (error === 'not-allowed' || error === 'service-not-allowed') {
        isExplicitlyStoppedRef.current = true;
        isListeningRef.current = false;
        setIsListening(false);
        setSpeechError('يرجى السماح للمتصفح باستخدام الميكروفون.');
        setTimeout(() => setSpeechError(null), 5000);
      } else if (error === 'audio-capture') {
        isExplicitlyStoppedRef.current = true;
        isListeningRef.current = false;
        setIsListening(false);
        setSpeechError('لم يتم العثور على ميكروفون متاح على هذا الجهاز.');
        setTimeout(() => setSpeechError(null), 5000);
      } else if (error === 'network') {
        setSpeechError('تعذر الاتصال بخدمة التعرّف على الصوت. يرجى التحقق من اتصال الإنترنت.');
        setTimeout(() => setSpeechError(null), 4000);
      }
      // 'no-speech' and 'aborted' are non-fatal, do not show generic permission error
    };

    recognition.onend = () => {
      // Cleanly stop listening without running in the background
      setIsListening(false);
      isListeningRef.current = false;
    };

    return recognition;
  };

  const startListening = () => {
    setSpeechError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('التعرّف على الصوت غير مدعوم في هذا المتصفح.');
      setTimeout(() => setSpeechError(null), 5000);
      return;
    }

    baseTextRef.current = currentInputTextRef.current;
    isExplicitlyStoppedRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }

    try {
      const recognition = createRecognition();
      if (!recognition) {
        setSpeechError('التعرّف على الصوت غير مدعوم في هذا المتصفح.');
        setTimeout(() => setSpeechError(null), 5000);
        return;
      }

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      isListeningRef.current = true;
    } catch (err: any) {
      console.warn('[SpeechRecognition] Start error:', err);
      setIsListening(false);
      isListeningRef.current = false;
    }
  };

  const stopListening = () => {
    isExplicitlyStoppedRef.current = true;
    isListeningRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-1.5 sm:pb-2.5 select-none font-['Cairo',sans-serif]">
      {/* Attached image preview banner if user attaches image */}
      {attachedImage && (
        <div className="flex items-center gap-2 p-1.5 sm:p-2 mb-2 bg-[#f0eee8] border border-[#cfcac0] rounded-xl animate-in fade-in">
          <img
            src={attachedImage.dataUrl}
            alt="Attached document"
            className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-lg border border-[#006967] flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-right">
            <span className="text-[clamp(0.7rem,2vw,0.75rem)] text-[#242b27] font-semibold truncate block">
              {attachedImage.fileName}
            </span>
            <span className="text-[clamp(0.6rem,1.8vw,0.65rem)] text-[#006967]">مرفق جاهز للتحليل</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Speech recognition error banner */}
      {speechError && (
        <div className="flex items-center gap-1.5 p-2 mb-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Input container exactly matching screenshot with responsive height and font */}
      <div
        style={{ backgroundColor: '#ffffff' }}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#ffffff] hover:bg-[#ffffff] focus-within:bg-[#ffffff] border border-[#cfcac0] focus-within:border-[#1b7f6c] rounded-2xl shadow-2xs transition-all"
      >
        
        {/* Paperclip for attaching school certificate or document */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1 sm:p-1.5 text-[#5e6964] hover:text-[#1b7f6c] rounded-lg transition-colors cursor-pointer hidden sm:block flex-shrink-0"
          title="إرفاق مستند أو شهادة دراسية"
        >
          <Paperclip className="w-4 h-4 stroke-[1.8]" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text Input Field */}
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              currentInputTextRef.current = e.target.value;
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'جاري الاستماع... تحدث الآن'
                : 'اكتب استفسارك...'
            }
            disabled={isLoading}
            className="w-full bg-transparent px-1.5 sm:px-2 py-1 text-[clamp(0.8125rem,2.5vw,0.95rem)] text-[#242b27] placeholder-[#7d8782] focus:outline-none text-right font-normal disabled:opacity-70"
          />
        </div>

        {/* Microphone Button (🎙) with native browser Speech-to-Text */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isLoading}
          className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-sm'
              : 'text-[#4a5550] hover:text-[#1b7f6c] hover:bg-[#eae7e1]'
          }`}
          title={
            isListening
              ? 'إيقاف الاستماع الصوتي'
              : 'تحدث بصوتك (تحويل الصوت إلى نص)'
          }
        >
          {isListening ? (
            <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current flex-shrink-0" />
          ) : (
            <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2] flex-shrink-0" />
          )}
        </button>

        {/* Send Up-Arrow Button (↑) */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!inputText.trim() && !attachedImage) || isLoading}
          style={{ backgroundColor: '#1b7f6c' }}
          className={`w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 bg-[#1b7f6c] text-white hover:bg-[#16483c] shadow-xs ${
            (!inputText.trim() && !attachedImage) || isLoading
              ? 'opacity-85'
              : ''
          }`}
          title="إرسال"
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
          )}
        </button>

      </div>
    </div>
  );
};
