import type { AppThemeMode } from '../../../../shared/config/themeMode';

interface TableCategoriesBlockProps {
  categoryOptions: { value: string; label: string }[];
  handleAllCategoriesClick: () => void;
  handleCategoryClick: (value: string) => void;
  filters: { category: string | null };
  themeMode: AppThemeMode;
}
export type { TableCategoriesBlockProps };
