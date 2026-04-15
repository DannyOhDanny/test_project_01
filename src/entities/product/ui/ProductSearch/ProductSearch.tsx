import { type ComponentProps, forwardRef, type KeyboardEvent } from 'react';
import type { InputRef } from 'antd';
import { Flex, Input } from 'antd';
import { createStaticStyles } from 'antd-style';

import CloseIcon from '../../../../shared/assets/close-icon.svg?react';
import SearchIcon from '../../../../shared/assets/search-icon.svg?react';

import './ProductSearch.css';

const { Search } = Input;

type SearchProps = ComponentProps<typeof Search>;

const styles = createStaticStyles(({ css, cssVar }) => ({
  focusEffect: css`
    border-width: ${cssVar.lineWidth};
    border-radius: ${cssVar.borderRadius};
    transition: box-shadow ${cssVar.motionDurationMid};
    &:hover {
      border: 1px solid #d9d9d9;
    }
    &:focus-visible {
      border-color: lab(66.128% 0 0);
      box-shadow: 0 0 0 4px color-mix(in oklab, lab(66.128% 0 0) 50%, transparent);
    }
  `,
}));

const stylesFnSearch: SearchProps['styles'] = (info) => {
  if (info.props.size === 'large') {
    return {
      root: { color: 'var(--bg-color)' },
      input: {
        color: 'var(--bg-color)',
        borderColor: 'transparent',
        backgroundColor: '#f3f3f3',
      },
      prefix: { color: 'var(--bg-color)' },
      count: { color: 'var(--bg-color)' },
      button: {
        root: { color: 'transparent', borderColor: 'transparent', display: 'none' },
      },
    };
  }
  return {};
};

type Props = {
  onSearch: SearchProps['onSearch'];
};

const ProductSearch = forwardRef<InputRef, Props>(function ProductSearch({ onSearch }, ref) {
  return (
    <Flex justify="center" style={{ flex: 1 }}>
      <Search
        ref={ref}
        onSearch={onSearch}
        onPressEnter={(e: KeyboardEvent<HTMLInputElement>) => {
          onSearch?.(e.currentTarget.value, e);
        }}
        prefix={<SearchIcon />}
        classNames={styles}
        styles={stylesFnSearch}
        size="large"
        placeholder="Найти"
        name="search-fn"
        allowClear={{ clearIcon: <CloseIcon /> }}
        style={{ maxWidth: '1023px', width: '100%' }}
      />
    </Flex>
  );
});

export { ProductSearch };
