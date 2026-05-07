import type { CSSProperties } from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Flex, Row, Statistic, Typography } from 'antd';

import { cardShellStyle, PAGE_ROW_GUTTER } from '../../../../shared/styles/shell';
import { CHART_LINE_COLORS } from '../../utils/pageConfig';

import type { InfoBlockProps } from './model/type';

const { Text } = Typography;

const rowWrap: CSSProperties = { width: '100%' };

const cardBody = { padding: '22px 24px 24px' };

const STAT_PREFIX_ICON_SIZE = 20;
/** Нейтральный префикс при нулевом значении (стрелка без акценса расхода/дохода). */
const mutedArrowColor = 'rgba(0, 0, 0, 0.45)';

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

const InfoBlock = ({
  total,
  income,
  expenses,
  expensesDisplay,
  onAddOperation,
}: InfoBlockProps) => {
  return (
    <Row gutter={PAGE_ROW_GUTTER} style={rowWrap}>
      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          styles={{
            body: cardBody,
            header: {
              background: CHART_LINE_COLORS.balance,
            },
          }}
          style={{
            ...cardShellStyle,
            height: '100%',
          }}
        >
          <Statistic
            title={statTitle('Баланс', 'Итого за период')}
            value={total}
            precision={2}
            prefix={
              total >= 0 ? (
                <ArrowUpOutlined
                  style={{ color: CHART_LINE_COLORS.balance, fontSize: STAT_PREFIX_ICON_SIZE }}
                />
              ) : (
                <ArrowDownOutlined
                  style={{ color: CHART_LINE_COLORS.expenses, fontSize: STAT_PREFIX_ICON_SIZE }}
                />
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
                color: total >= 0 ? CHART_LINE_COLORS.balance : CHART_LINE_COLORS.expenses,
                fontFeatureSettings: '"tnum" 1',
              },
            }}
          />
          <Divider
            style={{
              height: 5,
              background: `linear-gradient(to right, #fff, ${CHART_LINE_COLORS.balance})`,
            }}
          />
          <Flex align="center" justify="space-between" gap={10}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddOperation}
              aria-label="Добавить операцию"
            >
              Добавить операцию
            </Button>
            <CheckCircleOutlined style={{ fontSize: 30, color: CHART_LINE_COLORS.balance }} />
          </Flex>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          styles={{ body: cardBody }}
          style={{
            ...cardShellStyle,
            height: '100%',
          }}
        >
          <Statistic
            title={statTitle('Доходы', 'Сумма поступлений')}
            value={income}
            precision={2}
            prefix={
              income > 0 ? (
                <ArrowUpOutlined
                  style={{ color: CHART_LINE_COLORS.income, fontSize: STAT_PREFIX_ICON_SIZE }}
                />
              ) : (
                <ArrowDownOutlined
                  style={{ color: mutedArrowColor, fontSize: STAT_PREFIX_ICON_SIZE }}
                />
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
                color: income > 0 ? CHART_LINE_COLORS.income : mutedArrowColor,
                fontFeatureSettings: '"tnum" 1',
              },
            }}
          />
          <Divider
            style={{
              height: 5,
              background: `linear-gradient(to right, #fff, ${CHART_LINE_COLORS.income})`,
            }}
          />
          <Flex align="center" justify="flex-end" gap={10}>
            <PlusCircleOutlined style={{ fontSize: 30, color: CHART_LINE_COLORS.income }} />
          </Flex>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card
          variant="borderless"
          styles={{ body: cardBody }}
          style={{
            ...cardShellStyle,
            height: '100%',
          }}
        >
          <Statistic
            title={statTitle('Расходы', 'Сумма списаний')}
            value={expensesDisplay}
            precision={2}
            prefix={
              expenses < 0 ? (
                <ArrowDownOutlined
                  style={{ color: CHART_LINE_COLORS.expenses, fontSize: STAT_PREFIX_ICON_SIZE }}
                />
              ) : (
                <ArrowUpOutlined
                  style={{ color: CHART_LINE_COLORS.income, fontSize: STAT_PREFIX_ICON_SIZE }}
                />
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
                color: expenses < 0 ? CHART_LINE_COLORS.expenses : mutedArrowColor,
                fontFeatureSettings: '"tnum" 1',
              },
            }}
          />
          <Divider
            style={{
              height: 5,
              background: `linear-gradient(to right, #fff, ${CHART_LINE_COLORS.expenses})`,
            }}
          />
          <Flex align="center" justify="flex-end" gap={10}>
            <MinusCircleOutlined style={{ fontSize: 30, color: CHART_LINE_COLORS.expenses }} />
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};

export { InfoBlock };
