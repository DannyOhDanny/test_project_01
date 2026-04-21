import type { CalcItem } from '../../../../../entities/product/api/useCalcQuery';

export type BalanceModalProps = {
  onCancel: () => void;
  onSubmit: (values: BalanceFormValues) => void;
  initialValues?: BalanceFormValues;
  draftOperationId?: number;
  open: boolean;
};

export type BalanceFormValues = {
  id: number;
  date: string;
  amount: number;
  notes: string;
  category: CalcItem['category'];
  type: CalcItem['type'];
};
