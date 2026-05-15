import type { CSSProperties } from 'react';
import { Typography } from 'antd';

import type { InfoBlockProps } from '../model/type';

import type { InfoCardValueSource } from './cardsConfig';

const { Text } = Typography;

export const rowWrap: CSSProperties = { width: '100%' };

export const cardBody = { padding: '22px 24px 24px' };

export const STAT_PREFIX_ICON_SIZE = 20;

export const mutedArrowColor = 'rgba(0, 0, 0, 0.45)';

export const statTitle = (label: string, hint: string) => (
  <div style={{ marginBottom: 8 }}>
    <Text
      strong
      style={{ fontSize: 15, display: 'block', letterSpacing: '-0.02em', lineHeight: 1.35 }}
    >
      {label}
    </Text>
    <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.45 }}>
      {hint}
    </Text>
  </div>
);

export function statisticValue(
  source: InfoCardValueSource,
  p: Pick<InfoBlockProps, 'total' | 'income' | 'expensesDisplay'>
): number {
  switch (source) {
    case 'total':
      return p.total;
    case 'income':
      return p.income;
    case 'expensesDisplay':
      return p.expensesDisplay;
    default:
      return 0;
  }
}
