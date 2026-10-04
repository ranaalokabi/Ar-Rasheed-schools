import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  BarChart3,
  LogOut,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  HelpCircle,
  Clock,
  RefreshCw,
  Eye,
  Trash2,
  Save,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpDown,
  BookOpen,
  Download,
} from 'lucide-react';
import {
  ConversationRecord,
  ConversationReviewStatus,
  AdminAnalyticsSummary,
} from '../../types/adminConversations';
import {
  adminConversationsService,
  STATUS_LABELS,
  TOPIC_LABELS,
} from '../../services/adminConversationsService';
import { SchoolEmblem } from '../SchoolEmblem';
import { formatArabicTimeAgo } from '../../utils/time';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'analytics'>('conversations');
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'needs_review'>('newest');

  // Selected Conversation for Review Modal
  const [selectedConversation, setSelectedConversation] = useState<ConversationRecord | null>(null);
  const [editingStatus, setEditingStatus] = useState<ConversationReviewStatus>('unreviewed');
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await adminConversationsService.fetchConversations({
        search: searchQuery,
        status: statusFilter,
        topic: topicFilter,
        sort: sortOrder,
      });
      setConversations(result.conversations);
      setAnalytics(result.analytics);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, searchQuery, statusFilter, topicFilter, sortOrder]);

  const handleOpenReviewModal = (conv: ConversationRecord) => {
    setSelectedConversation(conv);
    setEditingStatus(conv.reviewStatus || 'unreviewed');
    setEditingNotes(conv.supervisorNotes || '');
    setSaveSuccessMessage(null);
  };

  const handleSaveReview = async () => {
    if (!selectedConversation) return;
    setIsSavingReview(true);
    setSaveSuccessMessage(null);
    try {
      const ok = await adminConversationsService.updateReview(
        selectedConversation.id,
        editingStatus,
        editingNotes.trim()
      );
      if (ok) {
        setSaveSuccessMessage('تم حفظ التقييم والملاحظة بنجاح.');
        setSelectedConversation((prev) =>
          prev
            ? {
                ...prev,
                reviewStatus: editingStatus,
                supervisorNotes: editingNotes.trim(),
              }
            : null
        );
        // Refresh conversations in background
        loadData();
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to save review:', err);
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذه المحادثة من سجل المراجعة؟')) return;
    try {
      const ok = await adminConversationsService.deleteConversation(id);
      if (ok) {
        if (selectedConversation?.id === id) {
          setSelectedConversation(null);
        }
        loadData();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(conversations, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `alrasheed_conversations_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations;
  }, [conversations]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#f7f6f2] text-slate-800 font-['Cairo',sans-serif] overflow-hidden select-none animate-in fade-in duration-200"
      dir="rtl"
    >
      {/* 1. Header Toolbar */}
      <header className="bg-white border-b border-[#dedad0] px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center flex-shrink-0">
            <SchoolEmblem size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-[#1b7f6c]">
                لوحة تحكم المشرفة (Admin Dashboard)
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-200">
                منطقة آمنة ومحمية
              </span>
            </div>
            <p className="text-xs text-[#5e6964] font-medium hidden sm:block">
              مراجعة جودة الإجابات وتحليل الأسئلة المتكررة وتطوير المساعد الذكي
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-[#f0eee8] p-1 rounded-xl border border-[#dedad0] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('conversations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'conversations'
                ? 'bg-white text-[#1b7f6c] shadow-2xs font-bold'
                : 'text-[#5e6964] hover:text-[#1b7f6c]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>المحادثات ({analytics?.totalConversations ?? conversations.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-[#1b7f6c] shadow-2xs font-bold'
                : 'text-[#5e6964] hover:text-[#1b7f6c]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>الأسئلة المتكررة والإحصاءات</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            title="تصدير سجل المحادثات بصيغة JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1b7f6c] hover:text-[#16483c] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصدير السجل</span>
          </button>
          <button
            type="button"
            onClick={loadData}
            title="تحديث البيانات"
            className="p-2 text-slate-500 hover:text-[#1b7f6c] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#1b7f6c]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onLogout}
            title="تسجيل الخروج"
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="إغلاق لوحة التحكم والعودة للمساعد"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* Tab 1: Conversations Management */}
        {activeTab === 'conversations' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            
            {/* Simple Analytics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-[#dedad0] shadow-2xs flex flex-col justify-between">
                <span className="text-xs text-[#5e6964] font-medium flex items-center justify-between">
                  إجمالي المحادثات
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <span className="text-2xl font-extrabold text-[#242b27] mt-1">
                  {analytics?.totalConversations ?? conversations.length}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#dedad0] shadow-2xs flex flex-col justify-between">
                <span className="text-xs text-[#5e6964] font-medium flex items-center justify-between">
                  محادثات اليوم
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                </span>
                <span className="text-2xl font-extrabold text-blue-700 mt-1">
                  {analytics?.todayConversations ?? 0}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-2xs flex flex-col justify-between">
                <span className="text-xs text-amber-800 font-semibold flex items-center justify-between">
                  تحتاج مراجعة
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                </span>
                <span className="text-2xl font-extrabold text-amber-700 mt-1">
                  {analytics?.needsReviewCount ?? 0}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-2xs flex flex-col justify-between">
                <span className="text-xs text-emerald-800 font-semibold flex items-center justify-between">
                  إجابات صحيحة
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </span>
                <span className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {analytics?.correctCount ?? 0}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-orange-200 bg-orange-50/40 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
                <span className="text-xs text-orange-800 font-semibold flex items-center justify-between">
                  تحتاج تحسين / لم يفهم
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                </span>
                <span className="text-2xl font-extrabold text-orange-700 mt-1">
                  {(analytics?.needsImprovementCount ?? 0) + (analytics?.notUnderstoodCount ?? 0)}
                </span>
              </div>
            </div>

            {/* Privacy & Methodology Notice */}
            <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-teal-900">
              <ShieldCheck className="w-4 h-4 text-[#1b7f6c] flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>حماية خصوصية المستخدمين وسرية البيانات:</strong> يتم تعيين معرّف مجهول (مثل <code className="font-mono bg-teal-100 px-1 py-0.5 rounded text-teal-950 font-bold">#A82F91</code>) لكل محادثة، ولا يتم تخزين أو عرض أي بيانات هوية شخصية (كالأسماء أو أرقام الهواتف). الهدف الحصري هو تدقيق جودة ردود المساعد واكتشاف الأسئلة المتكررة.
              </div>
            </div>

            {/* Search, Filter, and Sort Controls Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#dedad0] shadow-2xs flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحثي بكلمات مفتاحية (الرسوم، خصم، باص، تسجيل، تقسيط)..."
                  className="w-full bg-[#f9f8f5] border border-[#dedad0] rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 placeholder-[#7d8782] focus:outline-none focus:border-[#1b7f6c]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#5e6964] font-medium hidden md:inline">الحالة:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#f9f8f5] border border-[#dedad0] rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1b7f6c]"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="unreviewed">بانتظار المراجعة</option>
                  <option value="correct">إجابة صحيحة</option>
                  <option value="needs_improvement">إجابة تحتاج تحسين</option>
                  <option value="incorrect">إجابة خاطئة</option>
                  <option value="not_understood">لم يفهم السؤال</option>
                  <option value="info_unavailable">المعلومات غير متوفرة</option>
                  <option value="needs_official_info">يحتاج إضافة معلومة رسمية</option>
                </select>
              </div>

              {/* Topic Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#5e6964] font-medium hidden md:inline">الموضوع:</span>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="bg-[#f9f8f5] border border-[#dedad0] rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1b7f6c]"
                >
                  <option value="all">كافة المواضيع</option>
                  <option value="tuition_fees">الرسوم الدراسية</option>
                  <option value="discounts">الخصومات</option>
                  <option value="registration">التسجيل والقبول</option>
                  <option value="transportation">المواصلات</option>
                  <option value="installments">التقسيط</option>
                  <option value="refund">الاسترجاع</option>
                  <option value="books_uniform">الكتب والزي</option>
                  <option value="schedule_hours">أوقات الدوام</option>
                  <option value="location">الموقع</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#5e6964] font-medium hidden md:inline">الترتيب:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="bg-[#f9f8f5] border border-[#dedad0] rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1b7f6c]"
                >
                  <option value="newest">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                  <option value="needs_review">المحادثات التي تحتاج مراجعة</option>
                </select>
              </div>
            </div>

            {/* Conversations List */}
            {isLoading ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#dedad0]">
                <RefreshCw className="w-6 h-6 animate-spin text-[#1b7f6c] mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">جاري تحميل سجل المحادثات...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#dedad0]">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">لا توجد محادثات تطابق معايير البحث</h4>
                <p className="text-xs text-slate-500 mt-1">جرّبي تغيير كلمات البحث أو إعادة ضبط الفلاتر.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredConversations.map((conv) => {
                  const statusInfo = STATUS_LABELS[conv.reviewStatus] || STATUS_LABELS.unreviewed;
                  const dateStr = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString('ar-YE', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleOpenReviewModal(conv)}
                      className="bg-white p-4 rounded-2xl border border-[#dedad0] hover:border-[#1b7f6c] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        {/* Conversation Header: Anonymous ID & Activity metadata */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-xs sm:text-sm font-extrabold px-2.5 py-0.5 rounded-lg bg-teal-50 text-[#1b7f6c] border border-teal-200">
                            {conv.anonymousId}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                          >
                            {statusInfo.label}
                          </span>
                          <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1 bg-[#f7f6f2] px-2 py-0.5 rounded-md border border-slate-200/60">
                            <Clock className="w-3 h-3 text-[#1b7f6c]" />
                            <span className="text-[#1b7f6c] font-bold">آخر نشاط:</span>
                            <span className="font-bold text-slate-700">{formatArabicTimeAgo(conv.updatedAt || conv.createdAt)}</span>
                          </span>
                          <span className="text-[11px] text-slate-600 font-semibold px-2 py-0.5 rounded bg-[#f0eee8] border border-slate-200/60">
                            عدد الرسائل: {conv.messageCount}
                          </span>
                        </div>

                        {/* Last Question Snippet */}
                        <div className="bg-[#faf9f5] px-3 py-1.5 rounded-xl border border-slate-200/70 inline-block max-w-full">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            <span className="text-[#1b7f6c] ml-1.5 font-extrabold">آخر سؤال:</span>
                            {conv.lastQuestion || 'بدء المحادثة'}
                          </p>
                        </div>

                        {/* Supervisor Notes Preview (if any) */}
                        {conv.supervisorNotes && (
                          <p className="text-xs text-amber-900 bg-amber-50/70 border border-amber-200/80 px-2.5 py-1 rounded-xl mt-2 line-clamp-1">
                            <strong>ملاحظة المشرفة:</strong> {conv.supervisorNotes}
                          </p>
                        )}

                        {/* Topic Tags */}
                        {conv.detectedTopics && conv.detectedTopics.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            {conv.detectedTopics.map((top) => (
                              <span
                                key={top}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-[#f0eee8] text-[#5e6964] font-medium"
                              >
                                #{TOPIC_LABELS[top] || top}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Action button */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReviewModal(conv);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#1b7f6c] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>عرض المحادثة والتقييم</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="حذف المحادثة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Analytics & Frequent Questions */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Top Topics Section */}
            <div className="bg-white p-5 rounded-3xl border border-[#dedad0] shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#1b7f6c]" />
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    المواضيع الأكثر طرحاً واستفساراً (Frequent Topics)
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">مبنية على المحادثات الفعلية</span>
              </div>

              <div className="space-y-3">
                {analytics?.topicStats && analytics.topicStats.length > 0 ? (
                  analytics.topicStats.map((stat) => (
                    <div key={stat.topicKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#1b7f6c]" />
                          {stat.topicLabelAr}
                        </span>
                        <span>
                          {stat.count} استفسار ({stat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1b7f6c] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, stat.percentage))}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">
                    لا تتوفر إحصاءات كافية بعد. تزداد الإحصاءات مع استمرار استقبال استفسارات أولياء الأمور.
                  </p>
                )}
              </div>
            </div>

            {/* Frequent Questions List */}
            <div className="bg-white p-5 rounded-3xl border border-[#dedad0] shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1b7f6c]" />
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    قائمة الأسئلة المتكررة من أولياء الأمور (Recurring Queries)
                  </h3>
                </div>
                <span className="text-xs text-teal-800 font-semibold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  تساعد المشرفة على سد الفجوات المعرفية
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {analytics?.frequentQuestions && analytics.frequentQuestions.length > 0 ? (
                  analytics.frequentQuestions.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-900 block">
                          {idx + 1}. "{item.question}"
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                            {item.topicLabelAr}
                          </span>
                          <span>تكرر {item.frequency} مرات</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">
                    سيتم عرض صيغ الأسئلة الأكثر تكراراً تلقائياً هنا مع استمرار المحادثات.
                  </p>
                )}
              </div>
            </div>

            {/* Quality Improvement Guidelines Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-3xl border border-amber-200 text-xs text-amber-950 space-y-2">
              <h4 className="font-extrabold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                قواعد التعلم وتحسين جودة المساعد الرسمية:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-amber-900/90 leading-relaxed pr-2">
                <li>
                  تُستخدم المحادثات لاكتشاف صيغ الأسئلة والكلمات المختلفة والأسئلة التي لم يفهمها المساعد.
                </li>
                <li>
                  <strong>لا يتم اعتبار كلام المستخدمين مصدراً للمعلومات:</strong> أي معلومة جديدة يجب أن تمر بمراجعة المشرفة وإضافتها يدوياً للتعليمات الرسمية.
                </li>
                <li>
                  <strong>تصفية المحتوى غير اللائق:</strong> يتم استبعاد الشتائم أو المحتوى العشوائي تلقائياً من خوارزميات التعلّم وتحليل الأسئلة.
                </li>
              </ul>
            </div>

          </div>
        )}
      </div>

      {/* 3. Conversation Details & Review Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#dedad0] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-right">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-extrabold px-3 py-1 rounded-xl bg-teal-50 text-[#1b7f6c] border border-teal-200">
                  {selectedConversation.anonymousId}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    مراجعة وتدقيق المحادثة
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {new Date(selectedConversation.createdAt).toLocaleString('ar-YE')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedConversation(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Stream Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#f9f8f5]">
              {selectedConversation.messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-semibold text-slate-500">
                      <span>{isUser ? 'السائل (مجهول)' : 'المساعد الذكي'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#1b7f6c] text-white rounded-br-xs shadow-2xs'
                          : 'bg-white text-slate-800 border border-[#dedad0] rounded-bl-xs shadow-2xs whitespace-pre-wrap'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Supervisor Evaluation & Notes Footer Form */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-extrabold text-slate-800">
                    تقييم جودة الإجابة:
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as ConversationReviewStatus)}
                    className="bg-[#f9f8f5] border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1b7f6c]"
                  >
                    <option value="unreviewed">بانتظار المراجعة</option>
                    <option value="correct">إجابة صحيحة</option>
                    <option value="needs_improvement">إجابة تحتاج تحسين</option>
                    <option value="incorrect">إجابة خاطئة</option>
                    <option value="not_understood">لم يفهم السؤال</option>
                    <option value="info_unavailable">المعلومات غير متوفرة</option>
                    <option value="needs_official_info">يحتاج إضافة معلومة رسمية</option>
                  </select>
                </div>

                {saveSuccessMessage && (
                  <span className="text-xs text-emerald-700 font-bold animate-in fade-in flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {saveSuccessMessage}
                  </span>
                )}
              </div>

              {/* Notes Field */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ملاحظات المشرفة (للتطوير الداخلي فقط):
                </label>
                <textarea
                  rows={2}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="اكتبي ملاحظتك هنا، مثال: (المساعد لم يفهم أن المقصود هو ترتيب الطالب داخل صفه، يلزم إضافة هذه الصياغة)..."
                  className="w-full bg-[#f9f8f5] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1b7f6c]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleDeleteConversation(selectedConversation.id)}
                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف هذه المحادثة</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedConversation(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    إغلاق
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    disabled={isSavingReview}
                    className="px-5 py-2 text-xs font-extrabold text-white bg-[#1b7f6c] hover:bg-[#156958] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingReview ? 'جاري الحفظ...' : 'حفظ التقييم والملاحظة'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
