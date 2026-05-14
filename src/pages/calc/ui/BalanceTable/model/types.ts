import type { TableColumnType } from 'antd';

import type { AppThemeMode } from '../../../../../shared/config/themeMode';
import type { TableDataType } from '../../../model/types';
export type BalanceTableProps = {
  tableData: TableDataType[] | undefined;
  tableColumns: TableColumnType<TableDataType>[];
  themeMode: AppThemeMode;
};
