export function getArabicTime(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  const h12 = hours % 12 || 12;
  const padH = h12 < 10 ? `0${h12}` : `${h12}`;
  const padMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const period = isPM ? 'م' : 'ص';
  const str = `${padH}:${padMin} ${period}`;

  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (d) => arabicDigits[Number(d)]);
}

export function formatArabicTimeAgo(dateInput?: string | number | Date | null): string {
  if (!dateInput) return 'غير محدد';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'غير محدد';

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'الآن';
  if (diffMin === 1) return 'منذ دقيقة';
  if (diffMin === 2) return 'منذ دقيقتين';
  if (diffMin >= 3 && diffMin <= 10) return `منذ ${diffMin} دقائق`;
  if (diffMin > 10 && diffMin < 60) return `منذ ${diffMin} دقيقة`;
  if (diffHours === 1) return 'منذ ساعة';
  if (diffHours === 2) return 'منذ ساعتين';
  if (diffHours >= 3 && diffHours <= 10) return `منذ ${diffHours} ساعات`;
  if (diffHours > 10 && diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays === 1) return 'منذ يوم (أمس)';
  if (diffDays === 2) return 'منذ يومين';
  if (diffDays >= 3 && diffDays <= 10) return `منذ ${diffDays} أيام`;
  return date.toLocaleDateString('ar-YE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
