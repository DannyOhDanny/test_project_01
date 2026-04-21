import { Card, Col, Row, Table, Typography } from 'antd';

import {
  cardShellStyle,
  PAGE_ROW_GUTTER,
  sectionBlockTitleStyle,
} from '../../../../shared/styles/shell';
import type { TableDataType } from '../../model/types';

import type { BalanceTableProps } from './model/types';

const { Title, Text } = Typography;

const BalanceTable = ({ tableData, tableColumns }: BalanceTableProps) => {
  return (
    <Row gutter={PAGE_ROW_GUTTER} style={{ width: '100%' }}>
      <Col span={24}>
        <Card
          variant="borderless"
          styles={{ body: { padding: '20px 22px 24px' } }}
          style={cardShellStyle}
        >
          <Title level={4} style={{ ...sectionBlockTitleStyle, marginBottom: 6 }}>
            Журнал операций
          </Title>
          <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
            Все проводки за выбранный период данных.
          </Text>
          <Table<TableDataType>
            dataSource={tableData ?? []}
            columns={tableColumns}
            rowKey={(_, index) => String(index)}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            size="middle"
            styles={{
              header: {
                cell: {
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.55)',
                },
              },
              body: { cell: { fontSize: 14 } },
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export { BalanceTable };
