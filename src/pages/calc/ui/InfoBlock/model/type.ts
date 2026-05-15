import type { AppThemeMode } from '../../../../../shared/config/themeMode';

export type InfoBlockProps = {
  total: number;
  income: number;
  expenses: number;
  expensesDisplay: number;
  onAddOperation: () => void;
  themeMode: AppThemeMode;
};
