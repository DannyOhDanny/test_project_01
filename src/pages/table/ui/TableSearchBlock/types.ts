import type { InputRef } from 'antd';

interface TableSearchBlockProps {
  searchQuoteRef: React.RefObject<InputRef | null> | null;
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: (value: string) => void;
  handleRefresh: () => void;
}

export type { TableSearchBlockProps };
