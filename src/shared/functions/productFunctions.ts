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

const formatPrice = (value?: number | string | undefined | null): string => {
  if (value === null || value === undefined || value === '') return ' - ';

  const numberValue =
    typeof value === 'string' ? Number(value.replace(/\s/g, '').replace(',', '.')) : value;

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

function localDayKeyFromIso(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
export { formatPrice, getCategory, getRandomInt, getRatingColor, localDayKeyFromIso };
