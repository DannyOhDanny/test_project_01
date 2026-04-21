type ChartMode = 'balance' | 'income' | 'expenses' | 'all';
type LineDatum = {
  dateKey: string;
  dateLabel: string;
  value: number;
  type: 'balance' | 'income' | 'expenses';
  series: string;
};
type TableDataType = {
  date: string;
  amount: number;
  type: string;
};
export type { ChartMode, LineDatum, TableDataType };
