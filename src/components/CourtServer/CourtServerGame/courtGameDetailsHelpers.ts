export const formatTime = (timestamp: { toDate?: () => Date }): string => {
  try {
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp as unknown as number);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
};

export const formatDuration = (
  start: { toDate?: () => Date },
  end?: { toDate?: () => Date },
): string => {
  if (!end) return "N/A";
  try {
    const s = start.toDate
      ? start.toDate()
      : new Date(start as unknown as number);
    const e = end.toDate ? end.toDate() : new Date(end as unknown as number);
    const diffMin = Math.round((e.getTime() - s.getTime()) / 60000);
    return `${diffMin} Min`;
  } catch {
    return "N/A";
  }
};

export const capitalizeFirst = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
