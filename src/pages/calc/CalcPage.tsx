import { useMemo, useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message, type TableColumnType, Tag, Typography } from 'antd';

import { type CalcItem, useCalcQuery } from '../../entities/product/api/useCalcQuery';
import { localDayKeyFromIso } from '../../shared/functions/productFunctions';
import { CategoryColorMap, CategoryNameMapRu } from '../../shared/lib/categoryConfig';
import { formatLocalDateRu } from '../../shared/lib/formatLocalDateRu';
import { PageShell } from '../../shared/ui/PageShell/PageShell';

import type { ChartMode, LineDatum, TableDataType } from './model/types';
import { BalanceModal } from './ui/BalanceModal/BalanceModal';
import type { BalanceFormValues } from './ui/BalanceModal/model/types';
import { BalanceTable } from './ui/BalanceTable/BalanceTable';
import { DynamicsChart } from './ui/DynamicsChart/DynamicsChart';
import { selectOptions } from './ui/DynamicsChart/utils/selectConfig';
import { InfoBlock } from './ui/InfoBlock/InfoBlock';
import {
  baselineForTooltipDelta,
  formatDeltaVsPrevDay,
  formatTooltipPlainLines,
  rubFormatSignedTable,
  tooltipRowToSeries,
} from './utils/calcFunctions';
import { lineChartConfigBase, lineChartTooltipTitle } from './utils/lineChartConfig';
import { CHART_LINE_COLORS, SERIES, SERIES_LABEL } from './utils/pageConfig';

const { Text } = Typography;

function normalizeAmountByType(amount: number, type: CalcItem['type']): number {
  if (type === 'expenses') return -Math.abs(amount);
  return Math.abs(amount);
}

const CalcPage = () => {
  const { data } = useCalcQuery();
  const [chartMode, setChartMode] = useState<ChartMode>('all');
  const [isEditOperationModalOpen, setIsEditOperationModalOpen] = useState(false);
  const [initialValues, setInitialValues] = useState<BalanceFormValues | null>(null);
  const [localAdditions, setLocalAdditions] = useState<CalcItem[]>([]);
  const [overridesById, setOverridesById] = useState<
    Record<number, Partial<Pick<CalcItem, 'amount' | 'date' | 'notes' | 'category' | 'type'>>>
  >({});

  const mergedData = useMemo(() => {
    // Локальные добавления должны перекрывать базовые строки с тем же id (если вдруг совпали).
    const byId = new Map<number, CalcItem>();
    for (const item of [...(data ?? []), ...localAdditions]) {
      byId.set(item.id, item);
    }

    return [...byId.values()].map((item) => {
      const override = overridesById[item.id];
      const patched = override ? { ...item, ...override } : item;
      return {
        ...patched,
        amount: normalizeAmountByType(patched.amount ?? 0, patched.type),
      };
    });
  }, [data, localAdditions, overridesById]);

  const draftOperationId = useMemo(() => {
    const ids = [...(data ?? []), ...localAdditions].map((x) => x.id);
    const max = ids.length ? Math.max(...ids) : 0;
    return max + 1;
  }, [data, localAdditions]);

  const income = useMemo(
    () =>
      mergedData.reduce(
        (acc, item) => (item.type === 'income' ? acc + (item.amount ?? 0) : acc),
        0
      ) || 0,
    [mergedData]
  );
  const expenses = useMemo(
    () =>
      mergedData.reduce(
        (acc, item) => (item.type === 'expenses' ? acc + (item.amount ?? 0) : acc),
        0
      ) || 0,
    [mergedData]
  );
  const expensesDisplay = useMemo(() => (expenses < 0 ? -expenses : 0), [expenses]);

  const { byDayNet, byDayIncome, byDayExpenses, sortedKeys } = useMemo(() => {
    const byDayNet = new Map<string, number>();
    const byDayIncome = new Map<string, number>();
    const byDayExpenses = new Map<string, number>();
    for (const item of mergedData) {
      if (item.type !== 'income' && item.type !== 'expenses') continue;
      const key = localDayKeyFromIso(item.date);
      if (!key) continue;
      const a = item.amount ?? 0;
      if (item.type === 'income') {
        byDayNet.set(key, (byDayNet.get(key) ?? 0) + a);
        byDayIncome.set(key, (byDayIncome.get(key) ?? 0) + a);
      } else {
        byDayNet.set(key, (byDayNet.get(key) ?? 0) + a);
        byDayExpenses.set(key, (byDayExpenses.get(key) ?? 0) + a);
      }
    }
    return {
      byDayNet,
      byDayIncome,
      byDayExpenses,
      sortedKeys: [...byDayNet.keys()].sort(),
    };
  }, [mergedData]);

  const lineDataByDayAndType = useMemo(() => {
    const out: LineDatum[] = [];
    for (const key of sortedKeys) {
      const [y, m, d] = key.split('-').map(Number);
      const atNoon = new Date(y, m - 1, d, 12, 0, 0, 0);
      const dateLabel = formatLocalDateRu(atNoon);
      const inc = byDayIncome.get(key) ?? 0;
      const expRaw = byDayExpenses.get(key) ?? 0;
      const exp = Math.abs(expRaw);
      // На каждый календарный день с любыми операциями — две точки: доход и расход.
      // Нет операций этого типа за день → value: 0 (раньше такие дни пропускались).
      out.push({ dateKey: key, dateLabel, value: inc, type: 'income', series: SERIES.income });
      out.push({ dateKey: key, dateLabel, value: exp, type: 'expenses', series: SERIES.expenses });
    }
    return out;
  }, [sortedKeys, byDayIncome, byDayExpenses]);

  const balanceCumulativeData = useMemo(() => {
    const log = '[CalcPage · balanceCumulativeData]';
    // 1. useMemo пересчитывается при изменении sortedKeys или byDayNet (см. зависимости внизу).
    if (import.meta.env.DEV) {
      console.groupCollapsed(`${log} расчёт кумулятивного баланса по дням`);
    }
    // 2. Если ни одного дня с операциями нет — для графика возвращаем пустой массив.
    if (sortedKeys.length === 0) {
      if (import.meta.env.DEV) {
        console.log(`${log} 2. sortedKeys.length === 0 → возврат []`);
        console.groupEnd();
      }
      return [];
    }
    if (import.meta.env.DEV) {
      // 3. sortedKeys — дни в формате YYYY-MM-DD, уже отсортированы по возрастанию (см. useMemo выше).
      console.log(`${log} 3. отсортированные ключи дней`, sortedKeys);
      // 4. byDayNet.get(key) — сумма всех amount за день (доходы положительные, расходы в данных отрицательные).
      console.log(
        `${log} 4. дневной «нетто» по ключам (доход + расход за день)`,
        Object.fromEntries(sortedKeys.map((k) => [k, byDayNet.get(k) ?? 0]))
      );
    }
    // 5. run — накопленный баланс с начала периода; перед циклом равен 0.
    let run = 0;
    // 6. Для каждого дня по порядку: парсим ключ → дата полдень локально → прибавляем дневной нетто → точка графика.
    const rows = sortedKeys.map((key) => {
      // 6a. Разбор YYYY-MM-DD в числа для конструктора Date (месяц 0-based).
      const [y, m, d] = key.split('-').map(Number);
      // 6b. Полдень локального времени — стабильная метка для formatLocalDateRu (меньше сдвигов из-за TZ).
      const atNoon = new Date(y, m - 1, d, 12, 0, 0, 0);
      // 6c. Дневной вклад; если ключа нет в Map (не должно быть), берём 0.
      const dayNet = byDayNet.get(key) ?? 0;
      // 6d. Кумулятив: баланс после этого дня = баланс до дня + дневной нетто.
      run += dayNet;
      // 6e. Подпись по оси X в человекочитаемом виде (ДД мес ГГГГ, ru).
      const dateLabel = formatLocalDateRu(atNoon);
      if (import.meta.env.DEV) {
        console.log(
          `${log} 6. день ${key} → «${dateLabel}» | дневной нетто: ${dayNet} | кумулятив после дня: ${run}`
        );
      }
      // 6f. Одна точка линии «Баланс» для графика (series — легенда/цвет).
      return {
        dateKey: key,
        dateLabel,
        value: run,
        type: 'balance' as const,
        series: SERIES.balance,
      };
    });
    if (import.meta.env.DEV) {
      console.log(`${log} 7. итоговый массив точек для <Line />`, rows);
      console.groupEnd();
    }
    // 7. Возвращаем массив точек; React Query при новых data пересчитает useMemo.
    return rows;
  }, [sortedKeys, byDayNet]);

  const total = useMemo(() => {
    if (balanceCumulativeData.length === 0) return 0;
    return balanceCumulativeData[balanceCumulativeData.length - 1]?.value ?? 0;
  }, [balanceCumulativeData]);

  const lineChartData = useMemo(() => {
    if (chartMode === 'balance') return balanceCumulativeData;
    if (chartMode === 'all') {
      // Три серии: кумулятивный баланс + дневные доходы + дневные расходы (без дублирующей «балансовой» линии по inc+exp).
      return [...balanceCumulativeData, ...lineDataByDayAndType];
    }
    return lineDataByDayAndType.filter((row) => row.type === chartMode);
  }, [chartMode, balanceCumulativeData, lineDataByDayAndType]);

  const tableData = useMemo(() => {
    return mergedData.map((item) => {
      return {
        id: item.id,
        date: item.date,
        amount: item.amount,
        type: item.type,
        notes: item.notes,
        category: item.category,
      } as TableDataType;
    });
  }, [mergedData]);

  const lineChartConfig = useMemo(
    () => ({
      ...lineChartConfigBase,
      tooltip: {
        title: lineChartTooltipTitle,
        items: [
          (row: unknown) => {
            const d = tooltipRowToSeries(row);
            if (!d) {
              return { name: '', value: '—', color: '#8c8c8c' };
            }
            const prev = baselineForTooltipDelta(balanceCumulativeData, lineDataByDayAndType, d);
            const { pct, deltaRub } = formatDeltaVsPrevDay(d.value, prev);
            return {
              name: SERIES_LABEL[d.type] ?? String(d.type),
              value: formatTooltipPlainLines(d.value, pct, deltaRub),
              color: CHART_LINE_COLORS[d.type],
            };
          },
        ],
      },
    }),
    [balanceCumulativeData, lineDataByDayAndType]
  );
  const onEditOperation = (record: TableDataType) => {
    setIsEditOperationModalOpen(true);
    setInitialValues({
      id: Number(record.id),
      date: record.date,
      amount: record.amount,
      notes: record.notes,
      category: record.category,
      type: record.type,
    });
  };
  const onAddOperation = () => {
    setInitialValues(null);
    setIsEditOperationModalOpen(true);
  };

  const tableColumns: TableColumnType<TableDataType>[] = [
    {
      key: 'date',
      title: 'Дата',
      dataIndex: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
      render: (value: string) => (
        <Text style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatLocalDateRu(new Date(value))}
        </Text>
      ),
      width: 150,
      minWidth: 100,
      align: 'center',
    },
    {
      key: 'amount',
      title: 'Сумма',
      dataIndex: 'amount',
      sorter: (a: TableDataType, b: TableDataType) => a.amount - b.amount,
      render: (value: number) => (
        <Text
          style={{
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
            color: value > 0 ? '#237804' : value < 0 ? '#cf1322' : undefined,
          }}
        >
          {rubFormatSignedTable(value)}
        </Text>
      ),
      align: 'center',
    },
    {
      key: 'type',
      title: 'Тип',
      dataIndex: 'type',
      sorter: (a: TableDataType, b: TableDataType) => a.type.localeCompare(b.type) as number,
      render: (value: 'balance' | 'income' | 'expenses' | 'all') => (
        <Tag
          icon={value === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          variant="outlined"
          styles={{
            root: {
              borderWidth: '1px',
              borderColor:
                value === 'income' ? '#3f8600' : value === 'expenses' ? '#cf1322' : '#8c8c8c',
            },
          }}
          color={value === 'income' ? '#3f8600' : value === 'expenses' ? '#cf1322' : '#8c8c8c'}
        >
          {value in SERIES_LABEL ? SERIES_LABEL[value as 'balance' | 'income' | 'expenses'] : value}
        </Tag>
      ),
      align: 'center',
    },

    {
      key: 'notes',
      title: 'Примечание',
      dataIndex: 'notes',
      render: (value: string) => <Text>{value}</Text>,
      width: 200,
      minWidth: 150,
      align: 'center',
    },
    {
      key: 'category',
      title: 'Категория',
      dataIndex: 'category',
      render: (value: string) => {
        const key = value?.toLocaleLowerCase() as keyof typeof CategoryNameMapRu;
        const label = CategoryNameMapRu[key] ?? value ?? '—';
        const color = CategoryColorMap[key as keyof typeof CategoryColorMap] ?? '#8c8c8c';
        return (
          <Tag color={color} styles={{ root: { borderWidth: '1px' } }} variant="outlined">
            {label}
          </Tag>
        );
      },
      width: 200,
      minWidth: 150,
      align: 'center',
    },
    {
      key: 'action',
      title: 'Действие',
      dataIndex: 'action',
      render: (_value: string, _record: TableDataType) => (
        <Button
          aria-label="Изменить операцию"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEditOperation(_record)}
        />
      ),
      align: 'center',
    },
  ];

  return (
    <PageShell
      title="Калькулятор"
      description="Сводка по балансу, доходам и расходам; ниже — динамика по дням и список операций."
    >
      <InfoBlock
        total={total}
        income={income}
        expenses={expenses}
        expensesDisplay={expensesDisplay}
        onAddOperation={onAddOperation}
      />

      <DynamicsChart
        chartMode={chartMode}
        onChartModeChange={setChartMode}
        lineChartData={lineChartData}
        lineChartConfig={lineChartConfig}
        selectOptions={selectOptions}
      />
      <BalanceTable tableData={tableData} tableColumns={tableColumns} />
      <BalanceModal
        open={isEditOperationModalOpen}
        draftOperationId={initialValues ? undefined : draftOperationId}
        onCancel={() => setIsEditOperationModalOpen(false)}
        onSubmit={(values) => {
          const id = Number(values.id);
          const existsInBase = (data ?? []).some((item) => item.id === id);
          const existsInLocal = localAdditions.some((item) => item.id === id);

          if (existsInBase || existsInLocal) {
            setOverridesById((prev) => ({
              ...prev,
              [id]: {
                amount: normalizeAmountByType(values.amount, values.type),
                date: values.date,
                notes: values.notes,
                category: values.category,
                type: values.type,
              },
            }));
          } else {
            const categoryRu = CategoryNameMapRu[values.category];
            const next: CalcItem = {
              id,
              date: values.date,
              descriptionEn: values.category,
              descriptionRu: categoryRu,
              amount: normalizeAmountByType(values.amount, values.type),
              type: values.type,
              notes: values.notes,
              category: values.category,
            };
            setLocalAdditions((prev) => {
              const idx = prev.findIndex((x) => x.id === id);
              if (idx === -1) return [...prev, next];
              const copy = [...prev];
              copy[idx] = next;
              return copy;
            });
          }

          setIsEditOperationModalOpen(false);
          message.success('Изменения успешно внесены в таблицу');
        }}
        initialValues={initialValues ?? undefined}
      />
    </PageShell>
  );
};

export { CalcPage };
