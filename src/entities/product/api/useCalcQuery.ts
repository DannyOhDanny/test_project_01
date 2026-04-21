import { useQuery } from '@tanstack/react-query';

export type CalcItem = {
  id: number;
  date: string;
  descriptionEn: string;
  descriptionRu: string;
  amount: number;
  type: 'expenses' | 'income';
  notes: string;
  category:
    | 'food'
    | 'transport'
    | 'entertainment'
    | 'salary'
    | 'gift'
    | 'deposit'
    | 'clothing'
    | 'footwear'
    | 'accessories'
    | 'utilities'
    | 'housing'
    | 'other';
};

const getExpenses = (): Promise<CalcItem[]> =>
  Promise.resolve([
    {
      id: 2,
      date: '2026-04-02T00:00:00.000Z',
      descriptionEn: 'Transport',
      descriptionRu: 'Транспорт',
      description: 'Транспортная карта',
      amount: -200,
      type: 'expenses',
      category: 'transport',
      notes: 'Транспортная карта',
    },
    {
      id: 3,
      date: '2026-04-03T00:00:00.000Z',
      descriptionEn: 'Entertainment',
      category: 'entertainment',
      descriptionRu: 'Развлечения',
      description: 'Билеты в кино',
      amount: -300,
      type: 'expenses',
      notes: 'Билеты в кино',
    },
    {
      id: 5,
      date: '2026-04-05T00:00:00.000Z',
      descriptionEn: 'Salary',
      descriptionRu: 'Зарплата',
      description: 'Зарплата март',
      amount: 1000,
      type: 'income',
      category: 'salary',
      notes: 'Зарплата март',
    },
    {
      id: 6,
      date: '2026-04-06T00:00:00.000Z',
      descriptionEn: 'Salary',
      descriptionRu: 'Зарплата',
      description: 'Зарплата апрель',
      amount: 2300,
      type: 'income',
      category: 'salary',
      notes: 'Зарплата апрель',
    },
    {
      id: 7,
      date: '2026-04-07T00:00:00.000Z',
      descriptionEn: 'Gift',
      descriptionRu: 'Подарок',
      amount: 1000,
      type: 'income',
      category: 'gift',
      notes: 'Подарок другу',
    },
    {
      id: 8,
      date: '2026-04-08T00:00:00.000Z',
      descriptionEn: 'Deposit',
      descriptionRu: 'Вклад',
      amount: 1500,
      type: 'income',
      category: 'deposit',
      notes: 'Вклад в банк',
    },
    {
      id: 9,
      date: '2026-04-09T00:00:00.000Z',
      descriptionEn: 'Expenses',
      descriptionRu: 'Расходы',
      amount: -670,
      type: 'expenses',
      notes: 'Покупка продуктов',
      category: 'food',
    },
    {
      id: 10,
      date: '2026-04-10T00:00:00.000Z',
      descriptionEn: 'Expenses',
      descriptionRu: 'Расходы',
      amount: -350,
      type: 'expenses',
      notes: 'Покупка одежды',
      category: 'clothing',
    },
    {
      id: 11,
      date: '2026-04-11T00:00:00.000Z',
      descriptionEn: 'Expenses',
      descriptionRu: 'Расходы',
      amount: -100,
      notes: 'Покупка обуви',
      category: 'footwear',
      type: 'expenses',
    },
    {
      id: 12,
      date: '2026-04-12T00:00:00.000Z',
      descriptionEn: 'Expenses',
      descriptionRu: 'Расходы',
      amount: -200,
      notes: 'Покупка аксессуаров',
      category: 'accessories',
      type: 'expenses',
    },
  ]);

const useCalcQuery = () => {
  return useQuery({
    queryKey: ['calc'],
    queryFn: getExpenses,
    staleTime: 1000 * 60 * 60 * 24,
    refetchInterval: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });
};
export { useCalcQuery };
