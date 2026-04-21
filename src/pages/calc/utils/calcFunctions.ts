import { calendarDayBefore } from '../../../shared/lib/formatLocalDateRu';
import type { LineDatum } from '../model/types';

import { SERIES_KEY_BY_LABEL } from './pageConfig';

function cumulativeBalanceAtEndOfCalendarDay(rows: LineDatum[], inclusiveDayKey: string): number {
  let bestKey = '';
  let value = 0;
  for (const r of rows) {
    if (r.type !== 'balance') continue;
    if (r.dateKey <= inclusiveDayKey && r.dateKey > bestKey) {
      bestKey = r.dateKey;
      value = r.value;
    }
  }
  return bestKey === '' ? 0 : value;
}
function baselineForTooltipDelta(
  balanceRows: LineDatum[],
  dailyRows: LineDatum[],
  current: Pick<LineDatum, 'type' | 'dateKey'>
): number {
  const prevKey = calendarDayBefore(current.dateKey);
  if (current.type === 'balance') {
    return cumulativeBalanceAtEndOfCalendarDay(balanceRows, prevKey);
  }
  return dailyRows.find((r) => r.type === current.type && r.dateKey === prevKey)?.value ?? 0;
}

function tooltipRowToSeries(d: unknown): Pick<LineDatum, 'type' | 'dateKey' | 'value'> | null {
  if (!d || typeof d !== 'object') return null;
  const r = d as Record<string, unknown>;
  const dateKey = r.dateKey != null ? String(r.dateKey) : '';
  const rawType = r.type;
  let type: LineDatum['type'] | null =
    rawType === 'balance' || rawType === 'income' || rawType === 'expenses' ? rawType : null;
  if (!type && typeof r.series === 'string') {
    type = SERIES_KEY_BY_LABEL[r.series] ?? null;
  }
  const value = Number(r.value);
  if (!type || !dateKey || !Number.isFinite(value)) return null;
  return { type, dateKey, value };
}

const rubFormatSigned = (value: number): string => {
  const abs = Math.abs(value);
  const body = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  if (value > 0) return `+${body}`;
  if (value < 0) return `-${body}`;
  return body;
};

type DeltaVsYesterday = { pct: string; deltaRub: string };

function formatDeltaRub(value: number, prev: number): string {
  const d = value - prev;
  if (!Number.isFinite(d)) return '— ₽';
  return `${rubFormatSigned(d)} ₽`;
}

function formatDeltaVsPrevDay(value: number, prev: number): DeltaVsYesterday {
  const deltaRub = formatDeltaRub(value, prev);
  if (prev === 0 && value === 0) {
    return { pct: '0%', deltaRub };
  }
  if (prev === 0) {
    if (value > 0) {
      return { pct: '+100%', deltaRub };
    }
    return { pct: '-100%', deltaRub };
  }
  const raw = ((value - prev) / prev) * 100;
  if (!Number.isFinite(raw)) {
    return { pct: '—', deltaRub };
  }
  const rounded = Math.round(raw * 10) / 10;
  if (rounded === 0) {
    return { pct: '0%', deltaRub };
  }
  const sign = rounded > 0 ? '+' : '-';
  return {
    pct: `${sign}${Math.abs(rounded)}%`,
    deltaRub,
  };
}

function formatTooltipPlainLines(current: number, pct: string, deltaRub: string): string {
  const amount = `${rubFormatSigned(current)}\u00A0₽`;
  return [`Сумма: ${amount}`, `Изм.: ${pct} · ${deltaRub}`].join('\n');
}

function rubFormatSignedTable(value: number): string {
  return `${rubFormatSigned(value)} ₽`;
}
export {
  baselineForTooltipDelta,
  formatDeltaRub,
  formatDeltaVsPrevDay,
  formatTooltipPlainLines,
  rubFormatSigned,
  rubFormatSignedTable,
  tooltipRowToSeries,
};
