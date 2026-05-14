import type { InputRef } from 'antd';

import type { AppThemeMode } from '../../../../shared/config/themeMode';

interface TableSearchBlockProps {
  themeMode: AppThemeMode;
  searchQuoteRef: React.RefObject<InputRef | null> | null;
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: (value: string) => void;
  handleRefresh: () => void;
}

export type { TableSearchBlockProps };
