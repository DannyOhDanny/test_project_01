import { categoryMap } from '../lib/categoryConfig';

function getCategory(category: string): string {
  return categoryMap[category] || category;
}

function getRatingColor(rating: number): string {
  const ratingNumber = rating;
  if (isNaN(ratingNumber)) return 'grey';
  if (ratingNumber < 3.5) return 'red';
  return 'black';
}

const formatPrice = (value: number | string): string => {
  if (value === null || value === undefined || value === '') return '';

  const numberValue =
    typeof value === 'string' ? Number(value.replace(/\s/g, '').replace(',', '.')) : value;

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};
export { formatPrice, getCategory, getRatingColor };
