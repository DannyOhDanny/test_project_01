import type { LineConfig } from '@ant-design/charts';

import { formatLocalDateRu } from '../../../shared/lib/formatLocalDateRu';

import { LINE_WIDTH } from './pageConfig';
import { SERIES_LABEL } from './pageConfig';

const lineChartConfigBase: Partial<LineConfig> = {
  xField: 'dateKey',
  yField: 'value',
  seriesField: 'type',
  padding: 'auto',
  connectNulls: true,
  shape: 'smooth',
  colorField: 'type',
  style: { lineWidth: LINE_WIDTH },
  point: {
    size: 0,
    shape: 'circle',
  },
  scale: {
    x: { paddingOuter: 0, paddingInner: 0 },
    y: { min: 0, nice: true },
  },
  axis: {
    x: {
      title: 'Дата',
      labelFormatter: (text: string) => formatLocalDateRu(`${text}T12:00:00`),
    },
    y: { title: 'Сумма, ₽' },
  },
  legend: {
    position: 'bottom',
    color: {
      itemLabel: (channel: { value?: string }) =>
        (channel.value && SERIES_LABEL[channel.value as 'balance' | 'income' | 'expenses']) ||
        channel.value ||
        '',
    },
  },

  interaction: {
    tooltip: { shared: true, series: true, marker: true, crosshairsY: true },
  },
};

const lineChartTooltipTitle = (datum: { dateLabel?: string; dateKey?: string }) =>
  datum.dateLabel ?? (datum.dateKey ? formatLocalDateRu(`${datum.dateKey}T12:00:00`) : '');

export { lineChartConfigBase, lineChartTooltipTitle };
