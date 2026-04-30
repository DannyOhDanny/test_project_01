interface TableCategoriesBlockProps {
  categoryOptions: { value: string; label: string }[];
  handleAllCategoriesClick: () => void;
  handleCategoryClick: (value: string) => void;
  filters: { category: string | null };
}
export type { TableCategoriesBlockProps };
