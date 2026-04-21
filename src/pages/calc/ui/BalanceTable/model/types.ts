import type { TableColumnType } from 'antd';

import type { TableDataType } from '../../../model/types';

export type BalanceTableProps = {
  tableData: TableDataType[] | undefined;
  tableColumns: TableColumnType<TableDataType>[];
};
