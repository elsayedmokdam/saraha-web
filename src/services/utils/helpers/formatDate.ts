export function formatDate(value?: string | number | Date | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value?: string | number | Date | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** "5 minutes ago", "2 days ago" ... */
export function timeAgo(value?: string | number | Date | null): string {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000000],
    ["month", 2592000000],
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms) return rtf.format(-Math.round(diff / ms), unit);
  }
  return "just now";
}

/** 14:05 */
export function timeOnly(value?: string | number | Date | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(d);
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** "Today" · "Yesterday" · "12 Oct 2026" (separator between days inside a chat) */
export function dayLabel(value?: string | number | Date | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return formatDate(d);
}

/** Chat-list timestamp: the time for today, otherwise the short date */
export function listTime(value?: string | number | Date | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  if (startOfDay(d) === startOfDay(new Date())) return timeOnly(d);
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(d);
}
