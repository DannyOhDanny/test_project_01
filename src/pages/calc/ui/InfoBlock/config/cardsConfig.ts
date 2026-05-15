export type InfoCardKey = 'balance' | 'income' | 'expenses';

export type ChartAccentKey = 'balance' | 'income' | 'expenses';

export type InfoCardValueSource = 'total' | 'income' | 'expensesDisplay';

export type InfoBlockCardFooterSlot =
  | 'addOperationPlusCheck'
  | 'plusCircleOnly'
  | 'minusCircleOnly';

export type InfoBlockCardConfig = Readonly<{
  key: InfoCardKey;
  title: string;
  subtitle: string;
  accentKey: ChartAccentKey;
  valueSource: InfoCardValueSource;
  col: Readonly<{ xs: number; lg: number }>;
  tintedHeader: boolean;
  footerJustify: 'space-between' | 'flex-end';
  footerSlot: InfoBlockCardFooterSlot;
}>;

export const INFO_BLOCK_CARDS: readonly InfoBlockCardConfig[] = [
  {
    key: 'balance',
    title: 'Баланс',
    subtitle: 'Итого за период',
    accentKey: 'balance',
    valueSource: 'total',
    col: { xs: 24, lg: 8 },
    tintedHeader: true,
    footerJustify: 'space-between',
    footerSlot: 'addOperationPlusCheck',
  },
  {
    key: 'income',
    title: 'Доходы',
    subtitle: 'Сумма поступлений',
    accentKey: 'income',
    valueSource: 'income',
    col: { xs: 24, lg: 8 },
    tintedHeader: false,
    footerJustify: 'flex-end',
    footerSlot: 'plusCircleOnly',
  },
  {
    key: 'expenses',
    title: 'Расходы',
    subtitle: 'Сумма списаний',
    accentKey: 'expenses',
    valueSource: 'expensesDisplay',
    col: { xs: 24, lg: 8 },
    tintedHeader: false,
    footerJustify: 'flex-end',
    footerSlot: 'minusCircleOnly',
  },
];
