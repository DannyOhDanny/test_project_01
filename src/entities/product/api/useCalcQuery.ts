import { useQuery } from '@tanstack/react-query';

type CalcItem = {
  id: number;
  date: string;
  descriptionEn: string;
  descriptionRu: string;
  amount: number;
  type: 'expenses' | 'income';
};

const getExpenses = (): Promise<CalcItem[]> =>
  Promise.resolve([
    {
      id: 2,
      date: '2026-04-02T00:00:00.000Z',
      descriptionEn: 'Transport',
      descriptionRu: 'Транспорт',
      amount: -200,
      type: 'expenses',
    },
    {
      id: 3,
      date: '2026-04-03T00:00:00.000Z',
      descriptionEn: 'Entertainment',
      descriptionRu: 'Развлечения',
      amount: -300,
      type: 'expenses',
    },
    {
      id: 4,
      date: '2026-04-04T00:00:00.000Z',
      descriptionEn: 'Salary',
      descriptionRu: 'Зарплата',
      amount: 1000,
      type: 'income',
    },
    {
      id: 5,
      date: '2026-04-05T00:00:00.000Z',
      descriptionEn: 'Salary',
      descriptionRu: 'Зарплата',
      amount: 1000,
      type: 'income',
    },
    {
      id: 6,
      date: '2026-04-06T00:00:00.000Z',
      descriptionEn: 'Salary',
      descriptionRu: 'Зарплата',
      amount: 2300,
      type: 'income',
    },
    {
      id: 7,
      date: '2026-04-07T00:00:00.000Z',
      descriptionEn: 'Gift',
      descriptionRu: 'Подарок',
      amount: 1000,
      type: 'income',
    },
    {
      id: 8,
      date: '2026-04-08T00:00:00.000Z',
      descriptionEn: 'Deposit',
      descriptionRu: 'Вклад',
      amount: 1500,
      type: 'income',
    },
    {
      id: 9,
      date: '2026-04-09T00:00:00.000Z',
      descriptionEn: 'Expenses',
      descriptionRu: 'Расходы',
      amount: -670,
      type: 'expenses',
    },
    {
      id: 10,
      date: '2026-04-10T00:00:00.000Z',
      descriptionEn: 'Expenses',
      descriptionRu: 'Расходы',
      amount: -350,
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
