import type { LineDatum } from '../model/types';

const SERIES = {
  balance: 'Баланс',
  income: 'Доходы',
  expenses: 'Расходы',
} as const;

const CHART_LINE_COLORS: Record<'balance' | 'income' | 'expenses', string> = {
  balance: '#242EDB',
  income: '#52c41a',
  expenses: '#ff4d4f',
};

const LINE_WIDTH = 2;

const SERIES_LABEL: Record<'balance' | 'income' | 'expenses', string> = {
  balance: SERIES.balance,
  income: SERIES.income,
  expenses: SERIES.expenses,
};

const SERIES_KEY_BY_LABEL: Record<string, LineDatum['type']> = {
  [SERIES.balance]: 'balance',
  [SERIES.income]: 'income',
  [SERIES.expenses]: 'expenses',
};

export { CHART_LINE_COLORS, LINE_WIDTH, SERIES, SERIES_KEY_BY_LABEL, SERIES_LABEL };
