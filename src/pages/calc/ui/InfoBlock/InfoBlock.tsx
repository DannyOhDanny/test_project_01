import type { CSSProperties } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';

import { cardShellStyle } from '../../../stats/utils/styles';
import { CHART_LINE_COLORS } from '../../utils/pageConfig';

import type { InfoBlockProps } from './model/type';

const { Text } = Typography;

const pageWrap: CSSProperties = {
  maxWidth: 1200,
  margin: '16px auto 0 auto',
  padding: '0 clamp(12px, 3vw, 24px) 8px',
};

const cardBody = { padding: '22px 24px 24px' };

const statTitle = (label: string, hint: string) => (
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

const InfoBlock = ({ total, income, expenses, expensesDisplay }: InfoBlockProps) => {
  return (
    <Row gutter={[20, 20]} style={pageWrap}>
      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          styles={{ body: cardBody }}
          style={{
            ...cardShellStyle,
            height: '100%',
            borderLeft: `3px solid ${CHART_LINE_COLORS.balance}`,
          }}
        >
          <Statistic
            title={statTitle('Баланс', 'Итого за период')}
            value={total}
            precision={2}
            prefix={
              total >= 0 ? (
                <ArrowUpOutlined style={{ color: '#3f8600', fontSize: 20 }} />
              ) : (
                <ArrowDownOutlined style={{ color: '#cf1322', fontSize: 20 }} />
              )
            }
            suffix={<span style={{ marginLeft: 4, fontWeight: 500 }}>₽</span>}
            styles={{
              content: {
                fontSize: 28,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                color: total >= 0 ? '#237804' : '#cf1322',
                fontFeatureSettings: '"tnum" 1',
              },
            }}
          />
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          styles={{ body: cardBody }}
          style={{
            ...cardShellStyle,
            height: '100%',
            borderLeft: `3px solid ${CHART_LINE_COLORS.income}`,
          }}
        >
          <Statistic
            title={statTitle('Доходы', 'Сумма поступлений')}
            value={income}
            precision={2}
            prefix={
              income > 0 ? (
                <ArrowUpOutlined style={{ color: '#3f8600', fontSize: 20 }} />
              ) : (
                <ArrowDownOutlined style={{ color: '#cf1322', fontSize: 20 }} />
              )
            }
            suffix={<span style={{ marginLeft: 4, fontWeight: 500 }}>₽</span>}
            styles={{
              content: {
                fontSize: 28,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                color: income > 0 ? '#237804' : 'rgba(0,0,0,0.45)',
                fontFeatureSettings: '"tnum" 1',
              },
            }}
          />
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          styles={{ body: cardBody }}
          style={{
            ...cardShellStyle,
            height: '100%',
            borderLeft: `3px solid ${CHART_LINE_COLORS.expenses}`,
          }}
        >
          <Statistic
            title={statTitle('Расходы', 'Сумма списаний')}
            value={expensesDisplay}
            precision={2}
            prefix={
              expenses < 0 ? (
                <ArrowDownOutlined style={{ color: '#cf1322', fontSize: 20 }} />
              ) : (
                <ArrowUpOutlined style={{ color: '#389e0d', fontSize: 20 }} />
              )
            }
            suffix={<span style={{ marginLeft: 4, fontWeight: 500 }}>₽</span>}
            styles={{
              content: {
                fontSize: 28,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                color: expenses < 0 ? '#cf1322' : 'rgba(0,0,0,0.45)',
                fontFeatureSettings: '"tnum" 1',
              },
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export { InfoBlock };
