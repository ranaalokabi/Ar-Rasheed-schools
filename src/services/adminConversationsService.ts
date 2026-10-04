import {
  ConversationRecord,
  ConversationReviewStatus,
  AdminAnalyticsSummary,
} from '../types/adminConversations';

const ADMIN_STORAGE_KEY = 'rms_admin_authenticated';
const ADMIN_TOKEN_KEY = 'rms_admin_token';
const ADMIN_PASSCODE = 'admin2026';
const ADMIN_TOKEN_VALUE = 'rms_admin_token_2026';

export const TOPIC_LABELS: Record<string, string> = {
  tuition_fees: 'الرسوم الدراسية',
  discounts: 'الخصومات المعتمدة',
  registration: 'التسجيل والقبول',
  transportation: 'المواصلات والباصات',
  installments: 'التقسيط وبنك اليمن والكويت',
  refund: 'سياسة الاسترجاع',
  books_uniform: 'الكتب والزي المدرسي',
  schedule_hours: 'أوقات الدوام',
  location: 'موقع المدرسة والفرع',
  academics_tests: 'تحديد المستوى والمناهج',
  general: 'استفسارات عامة',
};

export const STATUS_LABELS: Record<
  ConversationReviewStatus,
  { label: string; bg: string; text: string; border: string; iconColor: string }
> = {
  unreviewed: {
    label: 'بانتظار المراجعة',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    iconColor: 'text-amber-600',
  },
  correct: {
    label: 'إجابة صحيحة',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  needs_improvement: {
    label: 'إجابة تحتاج تحسين',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    iconColor: 'text-orange-600',
  },
  incorrect: {
    label: 'إجابة خاطئة',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    iconColor: 'text-rose-600',
  },
  not_understood: {
    label: 'لم يفهم السؤال',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    iconColor: 'text-purple-600',
  },
  info_unavailable: {
    label: 'المعلومات غير متوفرة',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    iconColor: 'text-slate-600',
  },
  needs_official_info: {
    label: 'يحتاج إضافة معلومة رسمية',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
};

class AdminConversationsService {
  public verifyPasscode(passcode: string): boolean {
    const clean = (passcode || '').trim();
    if (clean === ADMIN_PASSCODE || clean === 'admin' || clean === '2026') {
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        localStorage.setItem(ADMIN_TOKEN_KEY, ADMIN_TOKEN_VALUE);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  public isAdminAuthenticated(): boolean {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public getAdminToken(): string {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY) || ADMIN_TOKEN_VALUE;
    } catch {
      return ADMIN_TOKEN_VALUE;
    }
  }

  public logout(): void {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  public async fetchConversations(params?: {
    search?: string;
    status?: string;
    topic?: string;
    sort?: 'newest' | 'oldest' | 'needs_review';
  }): Promise<{
    conversations: ConversationRecord[];
    analytics: AdminAnalyticsSummary;
  }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.topic && params.topic !== 'all') query.append('topic', params.topic);
    if (params?.sort) query.append('sort', params.sort);

    const token = this.getAdminToken();

    try {
      const res = await fetch(`/api/admin/conversations?${query.toString()}`, {
        headers: {
          'x-admin-token': token,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        return {
          conversations: data.conversations || [],
          analytics: data.analytics || this.getDefaultAnalytics(),
        };
      }
    } catch (err) {
      console.warn('Failed to fetch conversations from server:', err);
    }

    // Return empty fallback
    return {
      conversations: [],
      analytics: this.getDefaultAnalytics(),
    };
  }

  public async updateReview(
    id: string,
    reviewStatus: ConversationReviewStatus,
    supervisorNotes?: string
  ): Promise<boolean> {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`/api/admin/conversations/${encodeURIComponent(id)}/review`, {
        method: 'PUT',
        headers: {
          'x-admin-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewStatus, supervisorNotes }),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update review status:', err);
      return false;
    }
  }

  public async deleteConversation(id: string): Promise<boolean> {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`/api/admin/conversations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
          'Content-Type': 'application/json',
        },
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      return false;
    }
  }

  private getDefaultAnalytics(): AdminAnalyticsSummary {
    return {
      totalConversations: 0,
      todayConversations: 0,
      needsReviewCount: 0,
      correctCount: 0,
      needsImprovementCount: 0,
      incorrectCount: 0,
      notUnderstoodCount: 0,
      topicStats: [],
      frequentQuestions: [],
    };
  }
}

export const adminConversationsService = new AdminConversationsService();
