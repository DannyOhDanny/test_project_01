import { useNavigate } from 'react-router';

export const menuItems = (navigate: ReturnType<typeof useNavigate>) => [
  {
    key: '/table',
    label: 'Таблица',
    onClick: () => navigate('/table'),
  },

  {
    key: '/stats',
    label: 'Статистика',
    onClick: () => navigate('/stats'),
  },
  { key: '/calc', label: 'Калькулятор', onClick: () => navigate('/calc') },
];
