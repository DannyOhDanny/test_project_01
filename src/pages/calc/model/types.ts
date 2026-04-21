import type { CalcItem } from '../../../entities/product/api/useCalcQuery';

type ChartMode = 'balance' | 'income' | 'expenses' | 'all';
type LineDatum = {
  dateKey: string;
  dateLabel: string;
  value: number;
  type: 'balance' | 'income' | 'expenses';
  series: string;
};
type TableDataType = {
  id: string | number;
  date: string;
  amount: number;
  type: CalcItem['type'];
  descriptionEn: CalcItem['descriptionEn'];
  descriptionRu: CalcItem['descriptionRu'];
  notes: CalcItem['notes'];
  category: CalcItem['category'];
};
export type { ChartMode, LineDatum, TableDataType };
