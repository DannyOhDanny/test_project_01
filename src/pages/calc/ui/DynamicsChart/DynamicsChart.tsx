import { useMemo } from 'react';
import type { LineConfig } from '@ant-design/charts';
import { Line } from '@ant-design/charts';
import { Card, Col, Flex, Row, Select, Typography } from 'antd';

import { cardShellStyle } from '../../../stats/utils/styles';
import type { ChartMode, LineDatum } from '../../model/types';

const { Title, Text } = Typography;

const sectionTitleStyle = { margin: 0, letterSpacing: '-0.02em', fontWeight: 600 } as const;

type DynamicsChartProps = {
  chartMode: ChartMode;
  onChartModeChange: (mode: ChartMode) => void;
  selectOptions: { label: string; value: ChartMode }[];
  lineChartData: LineDatum[];
  lineChartConfig: Partial<LineConfig>;
};

const DynamicsChart = ({
  chartMode,
  onChartModeChange,
  selectOptions,
  lineChartData,
  lineChartConfig,
}: DynamicsChartProps) => {
  const lineChartDataSafe = useMemo(
    () => (lineChartData.length > 0 ? lineChartData : []),
    [lineChartData]
  );

  const lineChartKey = useMemo(
    () => [chartMode, lineChartDataSafe.length, lineChartDataSafe[0]?.dateKey ?? ''].join('|'),
    [chartMode, lineChartDataSafe]
  );

  return (
    <Row
      gutter={[20, 20]}
      style={{ maxWidth: 1200, margin: '0 auto', padding: '16px clamp(12px, 3vw, 24px) 0' }}
    >
      <Col span={24}>
        <Card
          variant="borderless"
          styles={{ body: { padding: '20px 22px 22px' } }}
          style={cardShellStyle}
        >
          <Flex
            justify="space-between"
            align="flex-start"
            gap={16}
            wrap="wrap"
            style={{ marginBottom: 16 }}
          >
            <div style={{ minWidth: 0, flex: '1 1 220px' }}>
              <Title level={4} style={sectionTitleStyle}>
                Динамика
              </Title>
              <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.5, display: 'block' }}>
                Кумулятивный баланс и дневные суммы; переключение серий — справа.
              </Text>
            </div>
            <Select
              aria-label="Серия на графике"
              placeholder="Серия на графике"
              options={selectOptions}
              value={chartMode}
              onChange={onChartModeChange}
              style={{ width: '100%', maxWidth: 280, minWidth: 200 }}
            />
          </Flex>
          <Line
            key={lineChartKey}
            {...lineChartConfig}
            data={lineChartDataSafe}
            style={{ minHeight: 400 }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export { DynamicsChart };
