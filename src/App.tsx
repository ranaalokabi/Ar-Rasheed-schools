import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { MessageItem, ChatMessage } from './components/MessageItem';
import { ChatInput } from './components/ChatInput';
import { OfficialFeesModal } from './components/OfficialFeesModal';
import { FeeCalculatorModal } from './components/FeeCalculatorModal';
import { SchoolGuideModal } from './components/SchoolGuideModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { adminConversationsService } from './services/adminConversationsService';
import { naturalVoice } from './services/speechSynthesis';
import { getArabicTime } from './utils/time';
import { playMessageChime } from './services/notificationSound';
import { RotateCcw } from 'lucide-react';

const CHAT_STORAGE_KEY = 'alrasheed_chat_history_v2';

export default function App() {
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Private Admin-Only Dashboard States
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Track conversation session for persistent sequence review in Admin Dashboard
  const [conversationId, setConversationId] = useState<string>(() => {
    try {
      const saved = sessionStorage.getItem('alrasheed_conv_session_id');
      if (saved) return saved;
      const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('alrasheed_conv_session_id', newId);
      return newId;
    } catch {
      return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial state: load saved conversation from localStorage if available, maintaining continuity across visits
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Persist conversation history to localStorage on any message update
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [messages]);

  // Ensure document direction is RTL for Arabic
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  // Subscribe to speech synthesis state
  useEffect(() => {
    const unsubscribe = naturalVoice.subscribe((speaking) => {
      setIsSpeaking(speaking);
      if (!speaking) {
        setPlayingMessageId(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Private Administrator Access Listener (Ctrl + Shift + 6 / Cmd + Shift + 6 only)
  useEffect(() => {
    // Private Admin Shortcut (Ctrl + Shift + 6)
    const handleAdminShortcut = (e: KeyboardEvent) => {
      const isKey6 =
        e.code === 'Digit6' ||
        e.code === 'Numpad6' ||
        e.key === '6' ||
        e.key === '^' ||
        e.key === 'ـ' ||
        e.key === '×' ||
        e.keyCode === 54 ||
        e.which === 54;

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && isKey6) {
        e.preventDefault();
        const isAuthed = adminConversationsService.isAdminAuthenticated();
        if (isAuthed) {
          setIsAdminDashboardOpen((prev) => !prev);
        } else {
          setIsAdminAuthModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleAdminShortcut);

    return () => {
      window.removeEventListener('keydown', handleAdminShortcut);
    };
  }, []);

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthModalOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleCloseAdminView = () => {
    setIsAdminDashboardOpen(false);
    setIsAdminAuthModalOpen(false);
    if (window.location.search.includes('admin=true') || window.location.hash === '#admin' || window.location.pathname === '/admin') {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleAdminLogout = () => {
    adminConversationsService.logout();
    setIsAdminDashboardOpen(false);
    setIsAdminAuthModalOpen(false);
    if (window.location.search.includes('admin=true') || window.location.hash === '#admin' || window.location.pathname === '/admin') {
      window.history.replaceState(null, '', '/');
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Audio Playback
  const handlePlayAudio = async (text: string, id: string) => {
    if (playingMessageId === id && isSpeaking) {
      naturalVoice.stop();
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(id);
    await naturalVoice.speak(text, 'ar');
  };

  const handleStopAudio = () => {
    naturalVoice.stop();
    setPlayingMessageId(null);
  };

  // Reset conversation to initial state (clearing localStorage and resetting chat)
  const handleResetChat = () => {
    naturalVoice.stop();
    setPlayingMessageId(null);
    setMessages([]);
    const freshConvId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setConversationId(freshConvId);
    try {
      sessionStorage.setItem('alrasheed_conv_session_id', freshConvId);
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Direct Phone Contact
  const handleContactPhone = () => {
    window.open('tel:+967771444242', '_self');
  };

  // Direct WhatsApp Contact
  const handleContactWhatsApp = () => {
    window.open('https://wa.me/967771444242', '_blank');
  };

  function normalizeArabicText(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[أإآء]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim();
  }

  const MODERATE_INSULT_REPLIES = [
    'أتفهم أنك قد تكون منزعجاً، لكن خلّينا نحافظ على الاحترام 🤍 إذا عندك ملاحظة أو مشكلة معينة في المدرسة، اذكرها لي وسأحاول مساعدتك.',
    'أقدّر مشاعرك حتى لو كنت متضايقاً، لكن يهمنا دائماً أن يبقى الحديث راقياً ومحترماً 🤍 إذا فيه أمر محدد واجهك في المدرسة، قل لي عنه وبإذن الله أساعدك.',
    'أتفهم شعورك بالاستياء، وبإمكاننا مناقشة أي ملاحظة بكل احترام وهدوء 🤍 إذا تحب توضّح المشكلة أو الاستفسار اللي عندك، أنا هنا لمساعدتك.',
    'خلّينا نتحدث باحترام ولباقة 🤍 إذا عندك أي تجربة أو ملاحظة بخصوص المدرسة أو خدماتها، اذكرها وبحاول أفيدك قدر الإمكان.',
    'نحرص دائماً على سماع الملاحظات ومعالجة المشكلات، لكن يُفضّل أن نتحدث باحترام متبادل 🤍 تفضل بطرح ما ترغب في إيضاحه وسأساعدك بكل سرور.',
  ];

  const MILD_PROVOCATION_REPLIES = [
    'إذا عندك ملاحظة أو مشكلة معينة، قل لي عنها وبحاول أساعدك.',
    'أنا هنا لأساعدك بكل ما أستطيع، إذا واجهتك صعوبة أو نقطة ما كانت واضحة، تفضل واذكرها لي.',
    'حقك عليّ إذا ما وصلت الفكرة بالشكل المطلوب، وضّح لي استفسارك وبحاول أساعدك بطريقة أفضل 🤍',
    'أعتذر لو ما وضحت الإجابة بالشكل المناسب، اذكر لي موضوعك وسأحرص على إفادتك مباشرة وبدقة.',
    'أنا معك لتسهيل أي استفسار، اذكر لي الجانب الذي تود توضيحه وسأجيبك بكل سرور.',
  ];

  const SEVERE_OR_REPEATED_REPLIES = [
    'أستطيع مساعدتك، لكن يُرجى استخدام لغة محترمة حتى أتمكن من متابعة المحادثة معك.',
    'يسعدني خدمتك والإجابة على أي استفسار، شرط أن يكون الحوار محترماً ومهذباً.',
    'أنا هنا للمساعدة وتزويدك بالمعلومات الرسمية، وأرجو الحفاظ على لغة لائقة لنستمر في الحديث.',
  ];

  function getRandomReply(pool: string[]): string {
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  function evaluateAbuseOrProvocation(
    text: string,
    history: ChatMessage[] = []
  ): { isAbuse: boolean; reply: string } | null {
    if (!text) return null;
    const normalized = normalizeArabicText(text);

    const severeRegex =
      /يلعن|لعن[هة]|العن|يلعنكم|يلعن والديك|يلعن ابوك|يلعن امك|ابن الكلب|ابن الحرام|ابن القحب|قحب[هة]|شرموط|عرص|منيوك|طيز|كس |زب |الله يلعن|الله ياخذكم|سحق[ااً]|تب[ااً] لك|fuck|bitch|asshole|bastard/i;

    const insultRegex =
      /(?:المدرسه|مدرستكم|المدرسة|مدرسه|مدرسة|ادارتكم|الاداره|الإدارة|معلمينكم|المعلمين|المساعد|مساعدكم|مساعد|البوت|الذكاء|انتم|انتو|انت|أنت|يا)\s*(?:غبي[هة]?|اغبياء|غبا[ءا]?|فاشل(?:[هة]|ين|ون)?|سي(?:ئ|ي|ء)(?:[هة]|ين|ون)?|زبال[هة]|خايس(?:[هة]|ين)?|تعبان(?:[هة]|ين)?|نصاب(?:[هة]|ين|ون)?|سارق(?:[هة]|ين|ون)?|حرامي[هة]?|لصوص|حقير(?:[هة]|ين)?|سافل(?:[هة]|ين)?|كلب|حيوان|حمار|تافه(?:[هة]|ين)?|وسخ(?:[هة]|ين)?|قذر(?:[هة]|ين)?|زفت|رخمه|نذل|واطي|متخلف(?:[هة]|ين|ون)?)|(?:^|\s)(?:غبي[هة]?|اغبياء|غبا[ءا]?|فاشل(?:[هة]|ين|ون)|سي(?:ئ|ي|ء)(?:[هة]|ين|ون)|خايس(?:[هة]|ين)|زبال[هة]|تعبان(?:[هة]|ين)|متخلف(?:ين|ون)|حقراء|سفله|كلاب|حمير|يا كلب|يا حيوان|يا حمار|يا غبي|يا تافه|يا حقير|يا سافل|يا وسخ|يا قذر|يا فاشل|يا زفت|يا رخمه|يا نذل|يا واطي|يا متخلف|خرا|خراء|خراا|زق|تفو|نصابين|حراميه|لصوص|اسوا مدرسه|اسوأ مدرسة|idiot|stupid|moron|crap)(?:\s|$)/i;

    const mildProvocationRegex =
      /ما تفهم|ما بتفهم|ما تفهموا|ما تفهمون|ما بتفهموا|ما فهمت|ما فهمتني|ما منك فا[يئ]د|مافيكم فا[يئ]د|ما فيكم فا[يئ]د|مافي فا[يئ]د|ما في فا[يئ]د|كلام فاضي|خرط|كذابين|تكذب|بطل كذب|انقلع|انجب|اسكت|اخرس|انطم|shut up/i;

    const isSevere = severeRegex.test(normalized);
    const isInsult = insultRegex.test(normalized);
    const isMild = mildProvocationRegex.test(normalized);

    if (!isSevere && !isInsult && !isMild) {
      return null;
    }

    const priorHistory = Array.isArray(history) ? history : [];
    const priorAbuseCount = priorHistory.filter((m) => {
      if (m?.role !== 'user' || !m?.content) return false;
      const normPrior = normalizeArabicText(m.content);
      return severeRegex.test(normPrior) || insultRegex.test(normPrior) || mildProvocationRegex.test(normPrior);
    }).length;

    if (isSevere || priorAbuseCount >= 1) {
      return {
        isAbuse: true,
        reply: getRandomReply(SEVERE_OR_REPEATED_REPLIES),
      };
    }

    if (isMild && !isInsult) {
      return {
        isAbuse: true,
        reply: getRandomReply(MILD_PROVOCATION_REPLIES),
      };
    }

    return {
      isAbuse: true,
      reply: getRandomReply(MODERATE_INSULT_REPLIES),
    };
  }

  // Helper: Enforce assistant authority boundaries and out-of-scope actions
  function evaluateAssistantLimitations(text: string): string | null {
    if (!text) return null;
    const normalized = normalizeArabicText(text);

    // 1. Booking, modifying, or cancelling appointments directly
    const isBookingAction =
      /احجز|حجز موعد|حجز لي|تعديل موعد|الغاء موعد|كنسل موعد|كنسل لي/i.test(normalized) &&
      !/شروط|طريقه|طريقة|كيف|كم|بكم|مت[يى]|مواعيد|ساعات/i.test(normalized);

    if (isBookingAction) {
      return 'لا أستطيع حجز المواعيد أو تعديلها مباشرة، لكن يمكنك التواصل مع المدرسة لتأكيد الموعد.';
    }

    // 2. Contacting administration or forwarding requests on behalf of user
    const isContactAdminAction =
      /تواصل مع (?:ال)?اداره|تواصلوا مع (?:ال)?اداره|بلغ (?:ال)?مدير|بلغ (?:ال)?موظف|بلغوا (?:ال)?اداره|ارفع طلبي|ارفعوا طلبي|ارسل طلبي|ارسلوا طلبي|ارفع شكوتي|ارفع الشكو[يى]|كلم (?:ال)?اداره|تواصل معهم وقل/i.test(
        normalized
      );

    if (isContactAdminAction) {
      return 'لا أستطيع التواصل مع إدارة المدرسة أو إرسال طلبات نيابةً عنك. يمكنك التواصل معهم مباشرة عبر قنوات المدرسة الرسمية.';
    }

    // 3. Guaranteeing admission, promising seats, or approving exceptions/discounts
    const isGuaranteeAction =
      /تضمن لي (?:ال)?قبول|تضمنوا لي (?:ال)?قبول|هل (?:ال)?قبول مضمون|اضمن لي (?:ال)?قبول|اضمن لي (?:ال)?مقعد|هل (?:ال)?مقعد مضمون|اعطني استثناء|اعطونا استثناء|وافق على الخصم|وافق لي|وافقوا لي/i.test(
        normalized
      );

    if (isGuaranteeAction) {
      return 'لا أستطيع ضمان القبول، لأن قرار القبول يعتمد على إجراءات وشروط المدرسة.';
    }

    // 4. Promising callback from staff
    const isCallbackAction =
      /خليهم يتصلوا|خلوهم يتصلوا|اتصلوا بي|اتصلوا علي|خل احد يكلمني|خلو احد يكلمني|خل (?:ال)?اداره تتصل|خلو (?:ال)?اداره تتصل|يرنوا علي|يدقوا علي/i.test(
        normalized
      );

    if (isCallbackAction) {
      return 'لا أستطيع ترتيب اتصال من إدارة المدرسة أو المعلمين؛ يمكنك التواصل معهم مباشرة عبر قنوات المدرسة الرسمية.';
    }

    // 5. Direct registration on user behalf
    const isDirectRegisterAction =
      /سجل ابني الان|سجل ابني الحين|سجلني الان|سجلني الحين|سجل اسم ابني|احجز مقعد لابني/i.test(
        normalized
      );

    if (isDirectRegisterAction) {
      return 'لا أستطيع تسجيل الطلاب أو حجز المقاعد مباشرة نيابةً عنك؛ التسجيل يتطلب استكمال الإجراءات الرسمية وتقديم الوثائق في مبنى المدرسة. تفضل بالاطلاع على شروط التسجيل والوثائق المطلوبة إذا تحب.';
    }

    return null;
  }

  function isGibberishOrIncomprehensible(text: string): boolean {
    if (!text) return true;
    const trimmed = text.trim();
    if (/^[\p{P}\p{S}\d\s]+$/u.test(trimmed)) return true;
    if (/^(.)\1{3,}$/u.test(trimmed)) return true;
    if (
      /^[a-zA-Z\s]{4,}$/.test(trimmed) &&
      !/^(hello|hi|hey|welcome|fees|school|admission|discount|tuition|thanks|thank you|ok|okay|how are you|good morning|good evening)$/i.test(
        trimmed
      )
    ) {
      return true;
    }
    return false;
  }

  function isSpecificQuestionForInformation(text: string): boolean {
    if (!text) return false;
    const normalized = normalizeArabicText(text);
    return (
      /(?:^|\s)(?:هل|كيف|وين|أين|اين|مت[يى]|بكم|كم|ليش|لماذا|ما|ماذا|ماهي|ما هي|ايش|إيش|شو|فين|ممكن|لو|تتوفر|يتوفر|توجد|يوجد|توفرون|عندكم|لديكم|تقدر|تقدروا|اريد اعرف|اشتي اعرف|ابي اعرف|حاب اعرف|علمني|خبرني|قولي|احتاج اعرف|تفاصيل)(?:\s|$)|[?؟]/i.test(
        normalized
      )
    );
  }

  // Intelligent client-side fallback matching all user experience rules
  const generateClientFallbackResponse = (
    text: string,
    currentHistory: ChatMessage[]
  ): string => {
    const normalized = normalizeArabicText(text.trim());

    // 0. Abuse & Inappropriate language handling (De-escalation with calm respect and natural variety)
    const abuseEval = evaluateAbuseOrProvocation(text, currentHistory);
    if (abuseEval) {
      return abuseEval.reply;
    }

    // 0.5 Assistant limitations & authority boundaries check
    const limitationReply = evaluateAssistantLimitations(text);
    if (limitationReply) {
      return limitationReply;
    }

    // 1. Social "How are you?"
    if (
      /^(كيف حالك|كيفك|كيف الحال|كيفك اليوم|شخبارك|شلونك|عساك بخير|عساكم بخير|اخبارك|أخبارك|كيف امورك|كيف أمورك|كيف صحتك|how are you|how are you\?)[\s.!?؟]*$/i.test(
        normalized
      )
    ) {
      return 'الحمدلله بخير 🤍 كيف أقدر أساعدك؟';
    }

    // 2. Status / Confirmation ("تمام" / "الحمدلله" -> respond naturally)
    if (
      /^(تمام|الحمدلله|الحمد لله|كويس|طيب|اوكي|أوكي|اوك|أوك|ماشي|حلو|واضح|ممتاز|بخير|تمام الحمدلله|تمام الحمد لله|الحمدلله بخير|ok|okay)[\s.!]*$/i.test(
        normalized
      )
    ) {
      return 'دوم يا رب 🤍 إذا عندك أي استفسار آخر أو تحب تعرف أي تفاصيل، أنا في الخدمة.';
    }

    // 3. Salam
    if (/^(السلام عليكم ورحمة الله وبركاته|السلام عليكم ورحمة الله|السلام عليكم|سلام عليكم|سلام)[\s.!]*$/i.test(normalized)) {
      return 'وعليكم السلام ورحمة الله 🤍 أهلاً وسهلاً بك، تفضل كيف أقدر أساعدك؟';
    }

    // 4. Marhaba
    if (/^(مرحبا|مرحباً|مرحبتين|مراحب|مرحبا بك|مرحبا بكم)[\s.!]*$/i.test(normalized)) {
      return 'يا ألف مرحباً بك 🤍✨ كيف أقدر أساعدك؟';
    }

    // 5. Ahlan
    if (/^(أهلا|أهلاً|اهلين|أهلين|هلا|يا هلا|هلا وغلا|اهلاً وسهلاً|أهلاً وسهلاً)[\s.!]*$/i.test(normalized)) {
      return 'أهلين وسهلاً بك 🤍 كيف أقدر أساعدك؟';
    }

    // 6. Gratitude
    if (
      /^(شكراً|شكرا|مشكور|مشكورة|مشكورين|تسلم|تسلمي|تسلموا|يعطيك العافية|الله يعطيك العافية|جزاك الله خير|thanks|thank you)[\s.!]*$/i.test(
        normalized
      )
    ) {
      return 'العفو، في خدمتكم دائماً 🤍 وأهلاً وسهلاً بكم في أي وقت.';
    }

    // 7. Acknowledgment
    if (/^(العفو|عفوا|عفواً|لا شكر على واجب|حياك|على الرحب والسعة)[\s.!]*$/i.test(normalized)) {
      return 'حياك الله 🤍 على الرحب والسعة.';
    }

    // 8. Presence
    if (/^(الو|ألو|موجود|معي|تسمعني)[\s.!?؟]*$/i.test(normalized)) {
      return 'أهلاً بك 🤍 معك، تفضل كيف أقدر أساعدك؟';
    }

    // 9. Farewell
    if (/^(مع السلامة|باي|في أمان الله|ودعتك الله|إلى اللقاء|مع السلامه|bye)[\s.!]*$/i.test(normalized)) {
      return 'في أمان الله وحفظه 🤍 وأهلاً وسهلاً بك في أي وقت.';
    }

    // 10. School Location & Google Maps link
    if (/موقع|الموقع|مكان|المكان|وينكم|وين موقعكم|عنوان|العنوان|خريطة|خرائط|maps|لوكيشن/i.test(normalized)) {
      return `موقع المدرسة:
**مدارس الرشيد الحديثة – فرع معين إنجليزي**

رابط الموقع على Google Maps:
https://maps.app.goo.gl/grq2F6qbFRLy6FHP6?g_st=aw`;
    }

    // 10.5 Afternoon / Evening / Outside working hours inquiry (e.g. "اذا ما ينفع اجي العصر صح؟", "ينفع اجي العصر؟", "دوام العصر")
    const asksAfternoonOrEvening =
      /عصر|العصر|مساء|المساء|مسائي|مسائيه|في الليل|بالليل|بعد الظهر|خارج (?:اوقات )?(?:ال)?دوام/i.test(
        normalized
      ) &&
      /ينفع|ما ينفع|صح|اجي|اجيكم|ازور|ازوركم|زيار|دوام|تفتح|فاتح|مفتوح|اقدر|ممكن|في دوام|فيه دوام|امركم|نمركم/i.test(
        normalized
      );

    if (asksAfternoonOrEvening) {
      const isConfirmation = /ما ينفع|صح|اذا|يعني|مش كذا|اليس كذلك/i.test(normalized);
      const leadWord = isConfirmation ? 'أيوه ما ينفع' : 'ما ينفع';
      return `${leadWord}، فقط في ساعات الدوام الرسمي المعتمدة للمدرسة:

- **السبت إلى الثلاثاء:** من 7:30 صباحاً إلى 1:40 ظهراً.
- **الأربعاء:** من 7:30 صباحاً إلى 1:15 ظهراً.
- **الخميس:** من 8:00 صباحاً إلى 1:00 ظهراً.
(يوم الجمعة عطلة أسبوعية رسمية).

أهلاً وسهلاً بك في أي وقت خلال ساعات الدوام الرسمي 🤍`;
    }

    // 11. Specific single day working hours
    if (/اربعاء|الأربعاء|اربعا|الاربعا|wednesday/i.test(normalized) && /دوام|ساعات|وقت|مت[يى]/i.test(normalized)) {
      return 'دوام يوم الأربعاء في مدارس الرشيد الحديثة – فرع معين إنجليزي: من **7:30 صباحاً إلى 1:15 ظهراً**.';
    }
    if (/خميس|الخميس|thursday/i.test(normalized) && /دوام|ساعات|وقت|مت[يى]/i.test(normalized)) {
      return 'دوام يوم الخميس في مدارس الرشيد الحديثة – فرع معين إنجليزي: من **8:00 صباحاً إلى 1:00 ظهراً**.';
    }
    if (/جمعه|الجمعة|friday/i.test(normalized) && /دوام|ساعات|وقت|مت[يى]/i.test(normalized)) {
      return 'يوم الجمعة عطلة أسبوعية رسمية للمدرسة.';
    }
    if (/(سبت|السبت|احد|الأحد|اثنين|الإثنين|الاثنين|ثلاثاء|الثلاثاء)/i.test(normalized) && /دوام|ساعات|وقت|مت[يى]/i.test(normalized)) {
      return 'الدوام من **7:30 صباحاً إلى 1:40 ظهراً**.';
    }

    // 12. General working hours
    if (/زور|ازور|نزور|زيار|دوام|الدوام|ساعات العمل|اوقات العمل|مواعيد|مت[يى] تفتح|مت[يى] تغلق|مت[يى] أزوركم|مت[يى] ازوركم|مت[يى] اجي|مت[يى] اجيكم|وقت الاستقبال|ساعات الاستقبال/i.test(normalized)) {
      return `أوقات الدوام في مدارس الرشيد الحديثة – فرع معين إنجليزي:
- **السبت إلى الثلاثاء:** من 7:30 صباحاً إلى 1:40 ظهراً.
- **الأربعاء:** من 7:30 صباحاً إلى 1:15 ظهراً.
- **الخميس:** من 8:00 صباحاً إلى 1:00 ظهراً.
(يوم الجمعة عطلة أسبوعية رسمية).`;
    }

    // 13. Refund policy intent
    if (/استرجاع|استرداد|refund|استرجع/i.test(normalized)) {
      return 'في حال الاسترجاع، يتم خصم مبلغ الفترة التي درس فيها الطالب فقط.';
    }

    // 14. Installments & Bus Transportation
    const mentionsInstallments = /تقسيط|التقسيط|اقساط|قسط|دفعات|طريقه الدفع|installment/i.test(normalized);
    const mentionsBus = /باص|حافل|مواصل|نقل|خطوط السير|bus|transport/i.test(normalized);

    // Bus transportation coverage / all places in Sana'a inquiry
    const isBusCoverageInquiry =
      mentionsBus &&
      /جميع الأماكن|كل الأماكن|جميع الاماكن|كل الاماكن|جميع المناطق|كل المناطق|كل صنعاء|صنعاء كامل|تغطي|تغطية|تغطيه|تصل|توصل|لكل مكان|اي مكان|أي مكان|كل مكان|كل الشوارع|كل مكان بصنعاء|كل مكان في صنعاء|مناطق|اماكن|أماكن|صنعاء/i.test(
        normalized
      );

    if (isBusCoverageInquiry) {
      return `لا تتوفر لدي حالياً معلومة رسمية تؤكد أن المواصلات تغطي جميع مناطق صنعاء، ويمكن التواصل مع المدرسة للتأكد من توفر النقل للمنطقة المطلوبة.

علماً بأن رسوم المواصلات المعتمدة تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، وقد تتغير بحسب أسعار الوقود.`;
    }

    if (mentionsInstallments && mentionsBus) {
      return `**أولاً - خطة التقسيط المعتمدة:**
تتوفر إمكانية تقسيط الرسوم على 12 شهراً من خلال بنك اليمن والكويت، بما يوفر خطة تقسيط مريحة.

**ثانياً - رسوم المواصلات المعتمدة:**
رسوم المواصلات تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، وقد تتغير بحسب أسعار الوقود.`;
    }

    if (mentionsBus) {
      return 'رسوم المواصلات تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، وقد تتغير بحسب أسعار الوقود.';
    }

    if (mentionsInstallments) {
      return 'تتوفر إمكانية تقسيط الرسوم على 12 شهراً من خلال بنك اليمن والكويت، بما يوفر خطة تقسيط مريحة.';
    }

    // 15. Discounts & Scholarships (Adhering strictly to approved 4 types & answering exactly what was asked)
    if (/خصم|خصوم|اوائل|تخفيض|منح|منحه|معدل|امتياز|نسبه|نسبة|95|كامل السداد|سداد كامل|discount|scholarship/i.test(normalized)) {
      if (/اخوه|اخوة|اخوان|اخوات|الابن الثاني|الابن الثالث|ابناء المعلمين|معلمين|ايتام|تحفيظ|قران|حفظه/i.test(normalized)) {
        return 'هذه المعلومة غير متوفرة لدينا حالياً ضمن لائحة الخصومات الرسمية المعتمدة في المدرسة.';
      }

      // If asking about ALL discounts or general discounts
      const asksAllDiscounts =
        /انواع|جميع الخصومات|كل الخصومات|ما هي الخصومات|ماهي الخصومات|ايش الخصومات|ايش هي الخصومات|الخصومات المعتمد|قائمه الخصومات|لائحه الخصومات|تفاصيل الخصومات/i.test(
          normalized
        ) ||
        normalized === 'الخصومات' ||
        normalized === 'الخصومات؟' ||
        normalized === 'خصومات' ||
        normalized === 'خصومات؟';

      if (asksAllDiscounts) {
        return `أنواع الخصومات الرسمية المعتمدة في مدارس الرشيد الحديثة:

1. **خصم كامل السداد:**
   - إذا قام ولي الأمر بسداد الرسوم الدراسية كاملة خلال شهر رمضان، يحصل على خصم بنسبة **20%**.
   - إذا قام ولي الأمر بسداد الرسوم الدراسية كاملة خلال الشهر التالي لرمضان، وهو شهر شوال، يحصل على خصم بنسبة **15%**.
   - إذا تم السداد بعد شهر شوال، فلا يتم احتساب خصم كامل السداد.

2. **خصم أوائل الجمهورية وطلاب الشهادة الأساسية:**
   - الحاصلون على ترتيب الأول إلى الخامس على مستوى الجمهورية في الصف التاسع: خصم **100%**.
   - الحاصلون على ترتيب السادس إلى العاشر على مستوى الجمهورية في الصف التاسع: خصم **80%**.
   - الطلاب الحاصلون على نسبة 95% أو أكثر في الشهادة الأساسية في الصف التاسع، ولكنهم ليسوا من أوائل الجمهورية: خصم **30%**.

3. **خصم الشركات:**
   الطلاب المستفيدون من الشركات التي وقعت اتفاقية مع المدرسة: خصم **10%**.

4. **خصم أوائل المدرسة:**
   هذا الخصم خاص بأوائل الطلاب على مستوى الصف نفسه، وليس على مستوى المدرسة كاملة، وليس على مستوى الجمهورية:
   - الطالب الحاصل على المركز الأول في صفه: خصم **15%**.
   - الطالب الحاصل على المركز الثاني في صفه: خصم **12%**.
   - الطالب الحاصل على المركز الثالث في صفه: خصم **10%**.
   ويشمل هذا الخصم طلاب النقل من الصف الرابع الأساسي إلى الصف الثالث الثانوي فقط.`;
      }

      const mentionsSchoolLevel = /مدرسه|المدرسه|مدرسة|المدرسة|فرع|الفرع|صفه|صف|صفوف|نقل|صفوف النقل/i.test(normalized);
      const mentionsRepublic = /جمهوريه|الجمهوريه|جمهورية|الجمهورية|republic/i.test(normalized);
      const mentionsBasicCertOr95 = /95|تاسع|الصف التاسع|الشهاده الاساسيه|الشهادة الأساسية|الاساسيه|الأساسية/i.test(normalized);
      const mentionsFullPayment = /كامل السداد|سداد كامل|رمضان|شوال|سداد مبكر/i.test(normalized);
      const mentionsCorporate = /شركات|الشركات|شركه|الشركة|اتفاقيه|اتفاقية/i.test(normalized);

      const isFirstRank = /الاول|الأول|1st/i.test(normalized);
      const isSecondRank = /الثاني|2nd/i.test(normalized);
      const isThirdRank = /الثالث|3rd/i.test(normalized);

      if (isFirstRank && (mentionsSchoolLevel || (!mentionsRepublic && !mentionsBasicCertOr95 && !mentionsFullPayment && !mentionsCorporate))) {
        return 'الطالب الحاصل على المركز الأول في صفه يحصل على خصم **15%** من الرسوم. (هذا الخصم خاص بأوائل الطلاب على مستوى الصف نفسه، وليس على مستوى المدرسة كاملة، ويشمل طلاب النقل من الصف الرابع الأساسي إلى الصف الثالث الثانوي فقط).';
      }

      if (isSecondRank && (mentionsSchoolLevel || (!mentionsRepublic && !mentionsBasicCertOr95 && !mentionsFullPayment && !mentionsCorporate))) {
        return 'الطالب الحاصل على المركز الثاني في صفه يحصل على خصم **12%** من الرسوم. (هذا الخصم خاص بأوائل الطلاب على مستوى الصف نفسه، وليس على مستوى المدرسة كاملة، ويشمل طلاب النقل من الصف الرابع الأساسي إلى الصف الثالث الثانوي فقط).';
      }

      if (isThirdRank && (mentionsSchoolLevel || (!mentionsRepublic && !mentionsBasicCertOr95 && !mentionsFullPayment && !mentionsCorporate))) {
        return 'الطالب الحاصل على المركز الثالث في صفه يحصل على خصم **10%** من الرسوم. (هذا الخصم خاص بأوائل الطلاب على مستوى الصف نفسه، وليس على مستوى المدرسة كاملة، ويشمل طلاب النقل من الصف الرابع الأساسي إلى الصف الثالث الثانوي فقط).';
      }

      if (mentionsSchoolLevel && !mentionsRepublic && !mentionsBasicCertOr95 && !mentionsFullPayment && !mentionsCorporate) {
        return `خصم أوائل المدرسة خاص بأوائل الطلاب على مستوى الصف نفسه، وليس على مستوى المدرسة كاملة، وليس على مستوى الجمهورية:
- الطالب الحاصل على المركز الأول في صفه: خصم **15%**.
- الطالب الحاصل على المركز الثاني في صفه: خصم **12%**.
- الطالب الحاصل على المركز الثالث في صفه: خصم **10%**.
ويشمل هذا الخصم طلاب النقل من الصف الرابع الأساسي إلى الصف الثالث الثانوي فقط.`;
      }

      if (mentionsRepublic && !mentionsBasicCertOr95) {
        return `خصومات أوائل الجمهورية في الصف التاسع:
- الحاصلون على ترتيب الأول إلى الخامس على مستوى الجمهورية: خصم **100%**.
- الحاصلون على ترتيب السادس إلى العاشر على مستوى الجمهورية: خصم **80%**.`;
      }

      if (mentionsBasicCertOr95 && !mentionsRepublic && !mentionsFullPayment && !mentionsCorporate && !mentionsSchoolLevel) {
        return 'الطلاب الحاصلون على نسبة 95% أو أكثر في الشهادة الأساسية في الصف التاسع، ولكنهم ليسوا من أوائل الجمهورية: خصم **30%** من الرسوم.';
      }

      if (mentionsFullPayment && !mentionsRepublic && !mentionsCorporate && !mentionsSchoolLevel) {
        return `خصم كامل السداد:
- إذا قام ولي الأمر بسداد الرسوم الدراسية كاملة خلال شهر رمضان، يحصل على خصم بنسبة **20%**.
- إذا قام ولي الأمر بسداد الرسوم الدراسية كاملة خلال الشهر التالي لرمضان، وهو شهر شوال، يحصل على خصم بنسبة **15%**.
- إذا تم السداد بعد شهر شوال، فلا يتم احتساب خصم كامل السداد.`;
      }

      if (mentionsCorporate && !mentionsRepublic && !mentionsFullPayment && !mentionsSchoolLevel) {
        return 'خصم الشركات: الطلاب المستفيدون من الشركات التي وقعت اتفاقية مع المدرسة يحصلون على خصم بنسبة **10%**.';
      }

      return `أنواع الخصومات الرسمية المعتمدة في مدارس الرشيد الحديثة:

1. **خصم كامل السداد:**
   - إذا قام ولي الأمر بسداد الرسوم الدراسية كاملة خلال شهر رمضان، يحصل على خصم بنسبة **20%**.
   - إذا قام ولي الأمر بسداد الرسوم الدراسية كاملة خلال الشهر التالي لرمضان، وهو شهر شوال، يحصل على خصم بنسبة **15%**.
   - إذا تم السداد بعد شهر شوال، فلا يتم احتساب خصم كامل السداد.

2. **خصم أوائل الجمهورية وطلاب الشهادة الأساسية:**
   - الحاصلون على ترتيب الأول إلى الخامس على مستوى الجمهورية في الصف التاسع: خصم **100%**.
   - الحاصلون على ترتيب السادس إلى العاشر على مستوى الجمهورية في الصف التاسع: خصم **80%**.
   - الطلاب الحاصلون على نسبة 95% أو أكثر في الشهادة الأساسية في الصف التاسع، ولكنهم ليسوا من أوائل الجمهورية: خصم **30%**.

3. **خصم الشركات:**
   الطلاب المستفيدون من الشركات التي وقعت اتفاقية مع المدرسة: خصم **10%**.

4. **خصم أوائل المدرسة:**
   هذا الخصم خاص بأوائل الطلاب على مستوى الصف نفسه، وليس على مستوى المدرسة كاملة، وليس على مستوى الجمهورية:
   - الطالب الحاصل على المركز الأول في صفه: خصم **15%**.
   - الطالب الحاصل على المركز الثاني في صفه: خصم **12%**.
   - الطالب الحاصل على المركز الثالث في صفه: خصم **10%**.
   ويشمل هذا الخصم طلاب النقل من الصف الرابع الأساسي إلى الصف الثالث الثانوي فقط.`;
    }

    // 16. Specific Grade, Books, or Uniform Fee Queries
    // 16.1 Books only
    const isBooksOnly =
      (/كتب|الكتب|كتاب|كراسات|اسعار الكتب|سعر الكتب/i.test(normalized) &&
        !/رسوم|دراسه|تسجيل|شروط|خصم|تقسيط/i.test(normalized)) ||
      normalized === 'الكتب' ||
      normalized === 'الكتب؟' ||
      normalized === 'كم الكتب' ||
      normalized === 'كم الكتب؟' ||
      normalized === 'بكم الكتب' ||
      normalized === 'بكم الكتب؟';

    if (isBooksOnly) {
      return `أسعار الكتب المدرسية المقررة للعام 2026-2027:
- التمهيدي (قسم العربي): 13,000 ريال.
- الأول الأساسي (قسم العربي): 13,000 ريال.
- 2 - 6 الأساسي: 35,000 ريال.
- 7 - 8 الأساسي: 35,000 ريال.
- التاسع الأساسي: 27,000 ريال.
- الأول ثانوي: 38,000 ريال.
- الثاني ثانوي: 54,000 ريال.
- الثالث ثانوي: 62,000 ريال.`;
    }

    // 16.2 Uniform only
    const isUniformOnly =
      !/انجليزي|انكليزي|english|لغه|لغة/i.test(normalized) &&
      ((/(?:^|\s)(?:زي|الزي)(?:\s|$)|الزي المدرسي|يونيفورم|ملابس|لباس|اسعار الزي|سعر الزي/i.test(normalized) &&
        !/رسوم|دراسه|تسجيل|شروط|خصم|تقسيط/i.test(normalized)) ||
        normalized === 'الزي' ||
        normalized === 'الزي؟' ||
        normalized === 'كم الزي' ||
        normalized === 'كم الزي؟' ||
        normalized === 'بكم الزي' ||
        normalized === 'بكم الزي؟');

    if (isUniformOnly) {
      return `أسعار الزي المدرسي المعتمد للعام 2026-2027:
- التمهيدي (قسم العربي): 15,000 ريال.
- الأول الأساسي (قسم العربي): 18,000 ريال.
- 2 - 6 الأساسي: 18,000 ريال.
- 7 - 8 الأساسي: الأولاد 20,000 ريال / البنات 10,000 ريال.
- التاسع الأساسي: الأولاد 20,000 ريال / البنات 10,000 ريال.
- الصفوف الثانوية (أول، ثاني، ثالث ثانوي): الأولاد 20,000 ريال / البنات 10,000 ريال.`;
    }

    // 16.3 Grade 9 specifically ("كم رسوم التاسع؟")
    if (/تاسع|الصف التاسع|grade 9/i.test(normalized)) {
      return `رسوم الصف التاسع الأساسي للعام الدراسي 2026-2027:
* الرسوم الدراسية: 770,000 ريال.
* الكتب: 27,000 ريال.
* الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.`;
    }

    // 16.4 1st Secondary specifically
    if (/اول ثانوي|اول الثانوي|الأول ثانوي|الأول الثانوي|10|عاشر/i.test(normalized)) {
      return `رسوم الصف الأول ثانوي للعام الدراسي 2026-2027:
* الرسوم الدراسية: 935,000 ريال.
* الكتب: 38,000 ريال.
* الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.`;
    }

    // 16.5 2nd Secondary specifically
    if (/ثاني ثانوي|ثاني الثانوي|الثاني ثانوي|الثاني الثانوي|11|حادي عشر/i.test(normalized)) {
      return `رسوم الصف الثاني ثانوي للعام الدراسي 2026-2027:
* الرسوم الدراسية: 935,000 ريال.
* الكتب: 54,000 ريال.
* الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.`;
    }

    // 16.6 3rd Secondary specifically
    if (/ثالث ثانوي|ثالث الثانوي|الثالث ثانوي|الثالث الثانوي|12|ثاني عشر/i.test(normalized)) {
      return `رسوم الصف الثالث ثانوي للعام الدراسي 2026-2027:
* الرسوم الدراسية: 990,000 ريال.
* الكتب: 62,000 ريال.
* الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.`;
    }

    // 16.7 All Secondary grades ("كم رسوم الثانوية؟")
    if (/ثانوي|الثانوية|الثانويه|المرحلة الثانوية|المرحله الثانويه|secondary/i.test(normalized)) {
      return `رسوم الصفوف الثانوية الثلاثة للعام الدراسي 2026-2027:
* الأول ثانوي: 935,000 ريال، الكتب 38,000 ريال، الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.
* الثاني ثانوي: 935,000 ريال، الكتب 54,000 ريال، الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.
* الثالث ثانوي: 990,000 ريال، الكتب 62,000 ريال، الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.`;
    }

    // 16.8 Grades 7 - 8
    if (/سابع|ثامن|7|8/i.test(normalized)) {
      return `رسوم الصف 7 - 8 الأساسي للعام الدراسي 2026-2027:
* الرسوم الدراسية: 770,000 ريال.
* الكتب: 35,000 ريال.
* الزي: الأولاد 20,000 ريال / البنات 10,000 ريال.`;
    }

    // 16.9 Grades 2 - 6 Basic
    if (/ثاني|ثالث|رابع|خامس|سادس|2|3|4|5|6/i.test(normalized) && /اساسي|ابتدائي/i.test(normalized)) {
      return `رسوم الصفوف 2 - 6 الأساسي للعام الدراسي 2026-2027:
* الرسوم الدراسية: 685,000 ريال.
* الكتب: 35,000 ريال.
* الزي: 18,000 ريال.`;
    }

    // 16.10 Grade 1 Basic (Arabic section)
    if (/اول اساسي|الأول اساسي|اول ابتدائي|الأول ابتدائي|الصف الأول الأساسي|الصف الاول الاساسي/i.test(normalized)) {
      return `رسوم الصف الأول الأساسي (قسم العربي) للعام الدراسي 2026-2027:
* الرسوم الدراسية: 535,000 ريال.
* الكتب: 13,000 ريال.
* الزي: 18,000 ريال.`;
    }

    // 16.11 KG / Kindergarten (Arabic section)
    if (/روضه|تمهيدي|kg|كي جي|التمهيدي/i.test(normalized)) {
      return `رسوم مرحلة التمهيدي (قسم العربي) للعام الدراسي 2026-2027:
* الرسوم الدراسية: 390,000 ريال.
* الكتب: 13,000 ريال.
* الزي: 15,000 ريال.`;
    }

    // 16.12 General Fees Table
    if (/كم الرسوم|بكم الدراسة|كم أدفع|أريد معرفة الرسوم|جدول الرسوم|رسوم/i.test(normalized)) {
      return `تفضل، هذا جدول الرسوم الدراسية المعتمد للعام الدراسي 2026-2027: 📄✨

| الصف | الرسوم الدراسية | الكتب | الزي |
| :--- | :---: | :---: | :---: |
| التمهيدي (قسم العربي) | 390,000 ريال | 13,000 ريال | 15,000 ريال |
| الأول الأساسي (قسم العربي) | 535,000 ريال | 13,000 ريال | 18,000 ريال |
| 2 - 6 الأساسي | 685,000 ريال | 35,000 ريال | 18,000 ريال |
| 7 - 8 الأساسي | 770,000 ريال | 35,000 ريال | الأولاد 20,000 ريال / البنات 10,000 ريال |
| التاسع الأساسي | 770,000 ريال | 27,000 ريال | الأولاد 20,000 ريال / البنات 10,000 ريال |
| الأول ثانوي | 935,000 ريال | 38,000 ريال | الأولاد 20,000 ريال / البنات 10,000 ريال |
| الثاني ثانوي | 935,000 ريال | 54,000 ريال | الأولاد 20,000 ريال / البنات 10,000 ريال |
| الثالث ثانوي | 990,000 ريال | 62,000 ريال | الأولاد 20,000 ريال / البنات 10,000 ريال |

**المواصلات:**
رسوم المواصلات تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، وقد تتغير بحسب أسعار الوقود.`;
    }

    // 17. Employment & Jobs inquiry (التوظيف والوظائف)
    if (/توظيف|وظائف|وظايف|وظيفة|وظيفه|شواغر|شاغر|تقديم على وظيف|مطلوب معلمين|مطلوب مدرسين|jobs|job/i.test(normalized)) {
      return `شروط ومعلومات التوظيف في مدارس الرشيد الحديثة:

- **الحد الأدنى للمؤهل:** درجة البكالوريوس لأي وظيفة، كحد أدنى.
- **الشروط والتفاصيل الخاصة بكل وظيفة:** يتم الإعلان عنها عند توفر أي وظيفة شاغرة، ويجب الرجوع إلى صفحة الوظائف الرسمية للمدرسة لمعرفة الشروط المطلوبة لكل إعلان.

**رابط التوظيف الرسمي:**
[صفحة الوظائف الرسمية](https://www.rasheed.school/arabic/jobs)
https://www.rasheed.school/arabic/jobs

(صفحة الوظائف الرسمية هي المكان المعتمد للإعلانات الوظيفية، وتُنشر الوظائف الشاغرة وشروطها هناك).`;
    }

    // 18. Accepted Ages for Early Stages (الأعمار المقبولة للمراحل الأولى)
    if (/عمر القبول|سن القبول|الاعمار المقبوله|الأعمار المقبولة|كم عمر|كم سن|سن دخول|عمر دخول|عمر التسجيل|سن التسجيل/i.test(normalized)) {
      const mentionsKg1 = /kg1|كي جي 1|كي جي1|روضه اول|الروضة الأولى/i.test(normalized);
      const mentionsKg2 = /kg2|كي جي 2|كي جي2|تمهيدي|التمهيدي/i.test(normalized);
      const mentionsGrade1 = /(?:ال|لل)?صف (?:ال)?اول|اول اساسي|الأول اساسي|اول ابتدائي|الأول ابتدائي/i.test(normalized);
      const mentionsGrade2 = /(?:ال|لل)?صف (?:ال)?ثاني|ثاني اساسي|الثاني اساسي|ثاني ابتدائي|الثاني ابتدائي/i.test(normalized);

      if (mentionsKg1 && !mentionsKg2 && !mentionsGrade1 && !mentionsGrade2) {
        return 'عمر القبول لـ KG1: أربع سنوات ونصف.';
      }
      if (mentionsKg2 && !mentionsKg1 && !mentionsGrade1 && !mentionsGrade2) {
        return 'عمر القبول لـ KG2: خمس سنوات ونصف.';
      }
      if (mentionsGrade1 && !mentionsKg1 && !mentionsKg2 && !mentionsGrade2) {
        return 'عمر القبول للصف الأول الأساسي: ست سنوات ونصف.';
      }
      if (mentionsGrade2 && !mentionsKg1 && !mentionsKg2 && !mentionsGrade1) {
        return 'عمر القبول للصف الثاني الأساسي: سبع سنوات ونصف.';
      }

      if (/ثالث|رابع|خامس|سادس|سابع|ثامن|تاسع|ثانوي/i.test(normalized)) {
        return 'هذه المعلومة غير متوفرة ضمن البيانات الرسمية الحالية، حيث تقتصر بيانات أعمار القبول المعتمدة حالياً على المراحل الأولى (KG1, KG2, الصف الأول, الصف الثاني).';
      }

      return `الأعمار المقبولة للمراحل الأولى هي:
- KG1: أربع سنوات ونصف.
- KG2: خمس سنوات ونصف.
- الصف الأول: ست سنوات ونصف.
- الصف الثاني: سبع سنوات ونصف.`;
    }

    // 19. Transfer documents by student origin (مستندات النقل حسب جهة القدوم)
    if (/استماره نقل|استمارة نقل|مستندات النقل|اوراق النقل|طالب منقول|نقل من مدرسة|نقل من مدرسه|نقل داخلي|نقل محافظات|من خارج اليمن|من خارج الامانه|من خارج الأمانة/i.test(normalized)) {
      const isInsideCapital = /داخل (?:ال)?امان[هة]|داخل صنعاء|من مدرس[هة] في صنعاء|نقل داخلي/i.test(normalized);
      const isOtherGovernorates = /خارج (?:ال)?امان[هة]|محافظات|محافظ[هة] اخر[يى]|من محافظ[هة]/i.test(normalized);
      const isOutsideYemen = /خارج اليمن|من الخارج|دول[هة] اخر[يى]|بلد [اأ]خر/i.test(normalized);

      if (isInsideCapital && !isOtherGovernorates && !isOutsideYemen) {
        return `إذا كان الطالب قادماً من مدرسة أخرى داخل أمانة العاصمة:
- يجب إحضار استمارة نقل داخلي.`;
      }
      if (isOtherGovernorates && !isInsideCapital && !isOutsideYemen) {
        return `إذا كان الطالب قادماً من خارج أمانة العاصمة ومن محافظة أخرى داخل اليمن:
- يجب إحضار استمارة نقل محافظات.`;
      }
      if (isOutsideYemen && !isInsideCapital && !isOtherGovernorates) {
        return `إذا كان الطالب قادماً من خارج اليمن:
1. يجب أن تكون الوثائق الدراسية معمدة من الجهة المختصة في البلد الذي أتى منه الطالب.
2. ثم يتم اعتمادها من وزارة الخارجية.
3. ثم من الكنترول.`;
      }

      return `مستندات النقل حسب جهة قدوم الطالب:

1. إذا كان الطالب قادماً من مدرسة أخرى داخل أمانة العاصمة:
   - يجب إحضار استمارة نقل داخلي.

2. إذا كان الطالب قادماً من خارج أمانة العاصمة ومن محافظة أخرى داخل اليمن:
   - يجب إحضار استمارة نقل محافظات.

3. إذا كان الطالب قادماً من خارج اليمن:
   - يجب أن تكون الوثائق الدراسية معمدة من الجهة المختصة في البلد الذي أتى منه الطالب.
   - ثم يتم اعتمادها من وزارة الخارجية.
   - ثم من الكنترول.`;
    }

    // 20. Registration Schedule & Late Registration (مواعيد التسجيل والتسجيل المتأخر)
    if (/مواعيد التسجيل|موعد التسجيل|فتر[هة] التسجيل|وقت التسجيل|مت[يى] يبدا التسجيل|مت[يى] يفتح التسجيل|مت[يى] ينتهي التسجيل|تسجيل مت[اأ]خر|التسجيل المت[اأ]خر|متاخر|متأخر/i.test(normalized)) {
      if (/متاخر|متأخر/i.test(normalized)) {
        return `بالنسبة للطلاب الذين يتم تسجيلهم في وقت متأخر:
يجب أن يكون لديهم ورقة من المنطقة التعليمية.`;
      }
      return `مواعيد التسجيل في مدارس الرشيد الحديثة:
- يبدأ التسجيل من شهر رمضان، ويستمر حتى قبل نهاية السنة الدراسية بشهر ونصف تقريباً.
- بالنسبة للطلاب الذين يتم تسجيلهم في وقت متأخر: يجب أن يكون لديهم ورقة من المنطقة التعليمية.`;
    }

    // 20.1 General Registration & Required Documents
    if (!/مواعيد|موعد|مت[يى]|مت[اأ]خر/i.test(normalized) && /تسجيل|تسجل|اسجل|قبول|التحاق|شروط التسجيل|الوثائق المطلوبه|الاوراق المطلوبه|اوراق التسجيل|وثائق التسجيل/i.test(normalized)) {
      return `شروط التسجيل والوثائق المطلوبة في مدارس الرشيد الحديثة:

**الوثائق المطلوبة:**
- صورة من شهادة الميلاد.
- صورة من شهادة التطعيم.
- صورة من بطاقة الأب.
- عدد 4 صور شخصية مقاس 4×6.
- يجب أن تكون الوثائق كاملة ومختومة ومعمدة من مكتب التربية.

**في حال كان الطالب منقولاً من مدرسة أخرى (مستندات النقل بحسب جهة القدوم):**
1. داخل أمانة العاصمة: يجب إحضار استمارة نقل داخلي.
2. من خارج أمانة العاصمة ومن محافظة أخرى داخل اليمن: يجب إحضار استمارة نقل محافظات.
3. من خارج اليمن: يجب أن تكون الوثائق الدراسية معمدة من الجهة المختصة في بلد القدوم، ثم من وزارة الخارجية، ثم من الكنترول.`;
    }

    // 20.2 Curriculum & Language of Instruction (المناهج ولغة التدريس)
    if (/مناهج|منهج|ما هي المناهج|ماهي المناهج|ما هو المنهج|ماهو المنهج|كتبكم|ماكسملان|ماكميلان|اكسفورد|macmillan|oxford|لغ[هة] التدريس|لغ[هة] التعليم|التدريس بالانجليزي|باللغ[هة] (?:ال)?انجليزي|تدريس بالانجليزي/i.test(normalized)) {
      const asksLanguageOnly =
        (/لغ[هة] التدريس|لغ[هة] التعليم|بالانجليزي|باللغ[هة] (?:ال)?انجليزي/i.test(normalized) &&
          !/منهج|مناهج|macmillan|oxford/i.test(normalized));

      if (asksLanguageOnly) {
        return `لغة التدريس في مدارس الرشيد الحديثة:
- اللغة الإنجليزية هي اللغة الأساسية للتدريس.
- يستثنى من ذلك الصف الأول والتمهيدي، حيث تكون لغة التدريس فيهما العربية.`;
      }

      return `المناهج ولغة التدريس في مدارس الرشيد الحديثة:

المناهج التعليمية المستخدمة:
- Macmillan
- Oxford

لغة التدريس:
- اللغة الإنجليزية هي اللغة الأساسية للتدريس.
- يستثنى من ذلك الصف الأول والتمهيدي، حيث تكون لغة التدريس فيهما العربية.`;
    }

    // 20.3 Number of Study Days (عدد أيام الدراسة)
    if (/عدد ايام الدراسه|عدد أيام الدراسة|كم يوم دراسه|كم يوم دراسة|ايام الدراسه الفعليه|أيام الدراسة الفعلية|كم اسبوع دراسه|كم أسبوع دراسة|كم شهر دراسه|كم شهر دراسة/i.test(normalized)) {
      return `عدد أيام الدراسة الفعلية يتم تحديده وفقاً لـ:
1. عدد أيام الدراسة في التقويم.
2. الإجازات الطارئة.
3. الإجازات الوطنية.

لذلك لا يوجد رقم ثابت محدد لعدد أيام الدراسة السنوية.`;
    }

    // 20.4 Examination System (نظام الاختبارات)
    if (/نظام الاختبارات|نظام الامتحانات|طريقه الاختبارات|طريقة الاختبارات|كيف الاختبارات|كيف الامتحانات|مواعيد الاختبارات|مواعيد الامتحانات|امتحانات منتصف السنه|امتحانات منتصف السنة|امتحانات نهايه السنه|امتحانات نهاية السنة/i.test(normalized)) {
      return `نظام الاختبارات في مدارس الرشيد الحديثة خلال العام الدراسي يكون على مرحلتين:

1. بعد مرور شهرين من الدراسة: يتم إجراء امتحانات منتصف السنة.
2. بعد مرور شهرين آخرين: يتم إجراء امتحانات نهاية السنة.`;
    }

    // 20.5 Parent Follow-up & Homework (متابعة ولي الأمر لمستوى الطالب والواجبات)
    if (/تطبيق اقرا|تطبيق اقرأ|الرشيد اقرا|الرشيد اقرأ|متابعه الطالب|متابعة الطالب|متابعه ابني|متابعة ابني|متابعه الواجبات|متابعة الواجبات|الواجبات|كيف اتابع|الاطلاع على الواجبات|قروب الصف|مجموعه الصف|مجموعة الصف|واتساب الصف|جروب الصف/i.test(normalized)) {
      return `يمكن لولي الأمر متابعة مستوى ابنه أو ابنته والاطلاع على الواجبات من خلال إحدى الوسيلتين:

1. تطبيق الرشيد اقرأ.
2. مجموعة WhatsApp الخاصة بالصف.`;
    }

    // 20.6 Academic Calendar (التقويم الدراسي وبداية العام)
    if (/التقويم الدراسي|تقويم دراسي|مت[يى] يبدا العام الدراسي|بدايه التقويم الدراسي|بداية التقويم الدراسي|1 محرم|واحد محرم/i.test(normalized)) {
      return `التقويم الدراسي في مدارس الرشيد الحديثة:
يتم احتساب التقويم الدراسي وفق التقويم الهجري، ويبدأ العام الدراسي من 1 محرم.`;
    }

    // 20.7 Exam Results Receipt (موعد استلام النتائج)
    if (/موعد استلام النتائج|استلام النتائج|موعد النتائج|مت[يى] النتائج|مت[يى] استلم النتيج[هة]|مت[يى] استلم الشهاد[هة]|مت[يى] تطلع النتائج|نتائج الامتحانات النصفيه|نتائج الامتحانات النصفية|نتائج الامتحانات النهائيه|نتائج الامتحانات النهائية/i.test(normalized)) {
      const isMidtermOnly = /نصفيه|النصفيه|نصفية|النصفية|منتصف/i.test(normalized);
      const isFinalOnly = /نهائيه|النهائيه|نهائية|النهائية/i.test(normalized);

      if (isMidtermOnly && !isFinalOnly) {
        return 'نتائج الامتحانات النصفية: يتم استلامها بعد أسبوعين من انتهاء الامتحانات.';
      }
      if (isFinalOnly && !isMidtermOnly) {
        return 'نتائج الامتحانات النهائية: يتم استلامها بعد شهر من انتهاء الامتحانات (وسبب المدة الإضافية هو مراجعة الشهادة في الوزارة وإجراء المطابقة).';
      }

      return `موعد استلام نتائج الامتحانات:

- نتائج الامتحانات النصفية: يتم استلامها بعد أسبوعين من انتهاء الامتحانات.
- نتائج الامتحانات النهائية: يتم استلامها بعد شهر من انتهاء الامتحانات (وسبب المدة الإضافية هو مراجعة الشهادة في الوزارة وإجراء المطابقة).`;
    }

    // Vision inquiry (الرؤية فقط)
    if (/ر[ؤو][يى][هة]/i.test(normalized)) {
      return 'حيث التربية رسالة، والتعلم متعة، والإبداع ممارسة.';
    }

    // Mission inquiry (الرسالة فقط)
    if (/رسال[هة]/i.test(normalized)) {
      return 'إعداد جيل مبدع يشارك في بناء وطنه، من خلال بيئة تربوية وتعليمية مشوقة، وتنمية مهنية مستدامة، وتقنية معاصرة، وشراكة مجتمعية فاعلة.';
    }

    // 15. Contacts (أرقام التواصل)
    if (/تواصل|رقم|ارقام|أرقام|هاتف|تلفون|اتصال/i.test(normalized)) {
      return `أرقام التواصل:

الرقم: 1 218 606

الهاتف: +967 771 444 242`;
    }

    // 16. Praise / Positive feedback (Category 3)
    const isPraiseOrPositiveComment =
      /ما شاء الله|تبارك الله|الله يبارك|الله يوفق|موفقين|بالتوفيق|تستاهل|تستاهلوا|فكرة حلوة|شيء جميل|ما قصرت|ما قصرتوا|مبدعين|عظيم|فخر|أفضل مدرسة|افضل مدرسة|مدرسة ممتازة|مدرسه ممتازه|كفو|حبيبي|حياكم|شكرا جزيلا|جزاك الله/i.test(
        normalized
      );

    if (isPraiseOrPositiveComment) {
      return 'تسلم كلك ذوق 🤍 نسعد دائماً بكلماتكم الطيبة ونتمنى لأبنائنا وبناتنا الطلاب كل التوفيق والتميز. تفضل بأي استفسار ترغب به.';
    }

    // 17. General opinions / observations (Category 3)
    const isGeneralCommentOrOpinion =
      /غالي|غالين|بعيد|بعيده|زحمه|صعب|سهل|عجبني|حبيت|شايف|اعتقد|اظن|رايي|رأيي/i.test(
        normalized
      );

    if (isGeneralCommentOrOpinion) {
      return 'نقدّر رأيك وملاحظتك الكريمة 🤍 ونسعى دائماً لتقديم أفضل بيئة تعليمية وتربوية لأبنائنا. إذا عندك أي سؤال أو استفسار محدد عن المدرسة، تفضل وسأجيبك مباشرة.';
    }

    // 18. Incomprehensible input / gibberish (Category 5)
    if (isGibberishOrIncomprehensible(text)) {
      return 'عفواً، لم أفهم استفسارك بوضوح 🤍 تفضل بطرح ما ترغب في معرفته وسأجيبك مباشرة وبدقة.';
    }

    // 19. Specific question seeking school information not present in database (Category 2)
    // Only invoke "المعلومة غير محددة حالياً" when the user is explicitly asking a question for details!
    const isActualQuestion = isSpecificQuestionForInformation(text);
    if (isActualQuestion) {
      return 'هذه المعلومة غير محددة حالياً في جدولنا الرسمي المعتمد. لتزويدكم بالمعلومة المؤكدة والتفاصيل الدقيقة، يرجى التواصل مباشرة مع إدارة المدرسة عبر الرقم (1 218 606) أو الهاتف (+967 771 444 242).';
    }

    if (currentHistory.length > 1) {
      return 'أنا معك ومتابع لاستفسارك 🤍 تفضل بطرح ما ترغب في معرفته وسأجيبك مباشرة وبدقة عن مواعيد الدوام، الرسوم، شروط التسجيل، أو موقع المدرسة.';
    }

    return 'أهلاً وسهلاً بك 🤍 تفضل بطرح استفسارك وسأجيبك مباشرة وبدقة عن مواعيد الدوام، الرسوم المعتمدة، شروط التسجيل، أو موقع المدرسة.';
  };

  // Sending message to backend
  const handleSendMessage = async (
    text: string,
    imageBase64?: string,
    imageMimeType?: string
  ) => {
    if (!text && !imageBase64) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      image: imageBase64,
      timestamp: getArabicTime(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Resilient fetch helper with automatic 1-shot retry for server warmup or non-JSON responses
      const fetchChatReply = async (retryCount = 0): Promise<{ reply: string; conversationId?: string }> => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            message: text,
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            imageBase64,
            imageMimeType,
            lang: 'ar',
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');

        if (!response.ok || !isJson) {
          if (retryCount < 1) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            return fetchChatReply(retryCount + 1);
          }
          throw new Error(`Non-JSON response (${response.status})`);
        }

        const rawText = await response.text();
        try {
          const parsed = JSON.parse(rawText);
          return {
            reply: parsed.reply || '',
            conversationId: parsed.conversationId,
          };
        } catch {
          if (retryCount < 1) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            return fetchChatReply(retryCount + 1);
          }
          throw new Error('Invalid JSON format');
        }
      };

      const result = await fetchChatReply();
      if (result.conversationId) {
        setConversationId(result.conversationId);
        try {
          sessionStorage.setItem('alrasheed_conv_session_id', result.conversationId);
        } catch {
          // ignore
        }
      }
      const trimmedReply = result.reply?.trim();
      // Ensure we NEVER present an empty message box to the user
      const replyContent =
        trimmedReply || generateClientFallbackResponse(text, newMessages);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: getArabicTime(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      playMessageChime();
    } catch {
      // Graceful fallback response without empty box or asking user to repeat
      const fallbackContent = generateClientFallbackResponse(text, newMessages);

      // Persist fallback turn to server conversations repository for supervisor review
      fetch('/api/conversations/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          userMessage: text,
          assistantReply: fallbackContent,
          hasImage: !!imageBase64,
        }),
      }).then((res) => res.json()).then((data) => {
        if (data?.conversationId) {
          setConversationId(data.conversationId);
          try {
            sessionStorage.setItem('alrasheed_conv_session_id', data.conversationId);
          } catch {
            // ignore
          }
        }
      }).catch(() => {});

      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        timestamp: getArabicTime(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      playMessageChime();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full rasheed-portal-bg flex flex-col justify-between text-[#242b27] font-['Cairo',sans-serif] selection:bg-[#1e5d4e] selection:text-white">
      
      {/* 1. Header matching screenshot exactly */}
      <Header
        onOpenFeesModal={() => setIsFeesModalOpen(true)}
        onOpenCalculatorModal={() => setIsCalculatorOpen(true)}
        onOpenGuideModal={() => setIsGuideOpen(true)}
        onContactWhatsApp={handleContactWhatsApp}
        onContactPhone={handleContactPhone}
        onResetChat={handleResetChat}
        hasMessages={messages.length > 0}
      />

      {/* 2. Main Center Body */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 relative overflow-hidden">
        
        {/* If no messages yet, display the exact Home Hero from screenshot */}
        {messages.length === 0 ? (
          <HomeHero
            onSelectPrompt={(query) => {
              handleSendMessage(query);
            }}
            onOpenFeesModal={() => setIsFeesModalOpen(true)}
          />
        ) : (
          /* Active Chat Stream */
          <div className="w-full flex-1 flex flex-col py-4 overflow-y-auto max-h-[calc(100vh-160px)]">
            
            {/* Messages list */}
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isPlayingAudio={playingMessageId === message.id && isSpeaking}
                  onPlayAudio={handlePlayAudio}
                  onStopAudio={handleStopAudio}
                  onOpenFeesModal={() => setIsFeesModalOpen(true)}
                />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="animate-message-entrance flex items-center gap-2.5 my-3 text-xs text-[#5e6964]">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#dedad0] flex items-center justify-center p-0.5 shadow-2xs">
                    <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#1e5d4e] rounded-full animate-spin" />
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-[#dedad0] shadow-2xs">
                    <span>جاري تحضير الإجابة...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

          </div>
        )}

      </main>

      {/* 3. Bottom Input Bar matching screenshot exactly */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />

      {/* Interactive Modals */}
      <OfficialFeesModal
        isOpen={isFeesModalOpen}
        onClose={() => setIsFeesModalOpen(false)}
      />

      <FeeCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onSendToChat={(inquiry) => {
          handleSendMessage(inquiry);
        }}
      />

      <SchoolGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Private Administrator Dashboard (ADMIN ONLY) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onSuccess={handleAdminAuthSuccess}
        onClose={() => {
          setIsAdminAuthModalOpen(false);
          if (window.location.search.includes('admin=true') || window.location.hash === '#admin' || window.location.pathname === '/admin') {
            window.history.replaceState(null, '', '/');
          }
        }}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={handleCloseAdminView}
        onLogout={handleAdminLogout}
      />

    </div>
  );
}
