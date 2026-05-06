import { Card, Col, Row, Table } from 'antd';

import { cardShellStyle, PAGE_ROW_GUTTER } from '../../../../shared/styles/shell';
import { InfoTitle } from '../../../../shared/ui/InfoTitle/InfoTitle';
import type { TableDataType } from '../../model/types';

import type { BalanceTableProps } from './model/types';

const BalanceTable = ({ tableData, tableColumns }: BalanceTableProps) => {
  return (
    <Row gutter={PAGE_ROW_GUTTER} style={{ width: '100%' }}>
      <Col span={24}>
        <Card
          variant="borderless"
          styles={{ body: { padding: '20px 22px 24px' } }}
          style={cardShellStyle}
        >
          <InfoTitle title="Журнал операций" subtitle="Все проводки за выбранный период данных." />
          <Table<TableDataType>
            dataSource={tableData ?? []}
            columns={tableColumns}
            rowKey={(record) => String(record.id)}
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
