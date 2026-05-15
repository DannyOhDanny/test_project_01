import { useLayoutEffect, useRef } from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Flex, Row, Statistic } from 'antd';
import gsap from 'gsap';

import { cardShellStyle, PAGE_ROW_GUTTER } from '../../../../shared/styles/shell';
import { CHART_LINE_COLORS } from '../../utils/pageConfig';

import { INFO_BLOCK_CARDS, type InfoCardKey } from './config/cardsConfig';
import {
  cardBody,
  mutedArrowColor,
  rowWrap,
  STAT_PREFIX_ICON_SIZE,
  statisticValue,
  statTitle,
} from './config/styleConfig';
import type { InfoBlockProps } from './model/type';
const InfoBlock = ({
  themeMode,
  total,
  income,
  expenses,
  expensesDisplay,
  onAddOperation,
}: InfoBlockProps) => {
  const cardsRowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<InfoCardKey, HTMLDivElement | null>>({
    balance: null,
    income: null,
    expenses: null,
  });

  useLayoutEffect(() => {
    const cards = INFO_BLOCK_CARDS.map((c) => cardRefs.current[c.key]).filter(
      (el): el is HTMLDivElement => el != null
    );
    const scope = cardsRowRef.current;
    if (cards.length === 0 || !scope) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration: 0.55, ease: 'power2.out' } });
      cards.forEach((cardEl, index) => {
        timeline.from(
          cardEl,
          { x: -36, opacity: 0, autoAlpha: 0 },
          index === 0 ? undefined : '+=0.1'
        );
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <Row gutter={PAGE_ROW_GUTTER} style={rowWrap} ref={cardsRowRef}>
      {INFO_BLOCK_CARDS.map((card) => {
        const accent = CHART_LINE_COLORS[card.accentKey];
        const value = statisticValue(card.valueSource, { total, income, expensesDisplay });

        const prefix =
          card.valueSource === 'total' ? (
            total >= 0 ? (
              <ArrowUpOutlined
                style={{ color: CHART_LINE_COLORS.balance, fontSize: STAT_PREFIX_ICON_SIZE }}
              />
            ) : (
              <ArrowDownOutlined
                style={{ color: CHART_LINE_COLORS.expenses, fontSize: STAT_PREFIX_ICON_SIZE }}
              />
            )
          ) : card.valueSource === 'income' ? (
            income > 0 ? (
              <ArrowUpOutlined
                style={{ color: CHART_LINE_COLORS.income, fontSize: STAT_PREFIX_ICON_SIZE }}
              />
            ) : (
              <ArrowDownOutlined
                style={{ color: mutedArrowColor, fontSize: STAT_PREFIX_ICON_SIZE }}
              />
            )
          ) : expenses < 0 ? (
            <ArrowDownOutlined
              style={{ color: CHART_LINE_COLORS.expenses, fontSize: STAT_PREFIX_ICON_SIZE }}
            />
          ) : (
            <ArrowUpOutlined
              style={{ color: CHART_LINE_COLORS.income, fontSize: STAT_PREFIX_ICON_SIZE }}
            />
          );

        const contentColor =
          card.valueSource === 'total'
            ? total >= 0
              ? CHART_LINE_COLORS.balance
              : CHART_LINE_COLORS.expenses
            : card.valueSource === 'income'
              ? income > 0
                ? CHART_LINE_COLORS.income
                : mutedArrowColor
              : expenses < 0
                ? CHART_LINE_COLORS.expenses
                : mutedArrowColor;

        return (
          <Col xs={card.col.xs} lg={card.col.lg} key={card.key}>
            <Card
              ref={(el) => {
                cardRefs.current[card.key] = el;
              }}
              variant="borderless"
              styles={{
                body: cardBody,
                ...(card.tintedHeader
                  ? {
                      header: {
                        background: CHART_LINE_COLORS.balance,
                      },
                    }
                  : {}),
              }}
              style={{
                ...cardShellStyle(themeMode),
                height: '100%',
              }}
            >
              <Statistic
                title={statTitle(card.title, card.subtitle)}
                value={value}
                precision={2}
                prefix={prefix}
                suffix={<span style={{ marginLeft: 4, fontWeight: 500 }}>₽</span>}
                styles={{
                  content: {
                    fontSize: 28,
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.2,
                    color: contentColor,
                    fontFeatureSettings: '"tnum" 1',
                  },
                }}
              />
              <Divider
                style={{
                  height: 5,
                  background: `linear-gradient(to right, #fff, ${accent})`,
                }}
              />
              <Flex align="center" justify={card.footerJustify} gap={10}>
                {card.footerSlot === 'addOperationPlusCheck' ? (
                  <>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={onAddOperation}
                      aria-label="Добавить операцию"
                    >
                      Добавить операцию
                    </Button>
                    <CheckCircleOutlined
                      style={{ fontSize: 30, color: CHART_LINE_COLORS.balance }}
                    />
                  </>
                ) : card.footerSlot === 'plusCircleOnly' ? (
                  <PlusCircleOutlined style={{ fontSize: 30, color: CHART_LINE_COLORS.income }} />
                ) : (
                  <MinusCircleOutlined
                    style={{ fontSize: 30, color: CHART_LINE_COLORS.expenses }}
                  />
                )}
              </Flex>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export { InfoBlock };
