export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function mode(values: number[]): number {
  if (values.length === 0) return 0;
  const bucketed = values.map((v) => Math.round(v / 5) * 5);
  const freq: Record<number, number> = {};
  for (const v of bucketed) freq[v] = (freq[v] ?? 0) + 1;
  let maxCount = 0;
  let modeVal = 0;
  for (const [k, count] of Object.entries(freq)) {
    if (count > maxCount) { maxCount = count; modeVal = Number(k); }
  }
  return modeVal;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h} hod ${m} min`;
  return `${m} min${s > 0 ? ` ${s} s` : ''}`;
}

export function successRateColor(rate: number): string {
  if (rate < 40) return 'var(--color-admin-danger)';
  if (rate < 70) return '#f5a623';
  return '#2db868';
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'dnes';
  if (days === 1) return 'včera';
  if (days < 7) return `před ${days} dny`;
  if (days < 30) return `před ${Math.floor(days / 7)} týd.`;
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' });
}
