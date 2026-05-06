import { useMemo } from 'react';
import type { LineConfig } from '@ant-design/charts';
import { Line } from '@ant-design/charts';
import { Card, Col, Flex, Row, Select } from 'antd';

import { cardShellStyle, PAGE_ROW_GUTTER } from '../../../../shared/styles/shell';
import { InfoTitle } from '../../../../shared/ui/InfoTitle/InfoTitle';
import type { ChartMode, LineDatum } from '../../model/types';

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
    <Row gutter={PAGE_ROW_GUTTER} style={{ width: '100%' }}>
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
              <InfoTitle
                title="Динамика"
                subtitle="Кумулятивный баланс и дневные суммы, переключение серий данных."
              />
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
