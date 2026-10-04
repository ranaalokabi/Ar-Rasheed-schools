export type ConversationReviewStatus =
  | 'unreviewed' // بانتظار المراجعة
  | 'correct' // إجابة صحيحة
  | 'needs_improvement' // إجابة تحتاج تحسين
  | 'incorrect' // إجابة خاطئة
  | 'not_understood' // لم يفهم السؤال
  | 'info_unavailable' // المعلومات غير متوفرة
  | 'needs_official_info'; // يحتاج إلى إضافة معلومة رسمية

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasImage?: boolean;
}

export interface ConversationRecord {
  id: string;
  anonymousId: string; // e.g. #A82F91
  createdAt: string;
  updatedAt: string;
  lastQuestion: string;
  lastAnswer?: string;
  messageCount: number;
  messages: ConversationMessage[];
  reviewStatus: ConversationReviewStatus;
  supervisorNotes?: string;
  detectedTopics: string[];
  flaggedAsInappropriate?: boolean;
}

export interface TopicStat {
  topicKey: string;
  topicLabelAr: string;
  count: number;
  percentage: number;
}

export interface FrequentQuestionItem {
  question: string;
  topicLabelAr: string;
  frequency: number;
  lastAskedTime: string;
}

export interface AdminAnalyticsSummary {
  totalConversations: number;
  todayConversations: number;
  needsReviewCount: number;
  correctCount: number;
  needsImprovementCount: number;
  incorrectCount: number;
  notUnderstoodCount: number;
  topicStats: TopicStat[];
  frequentQuestions: FrequentQuestionItem[];
}
