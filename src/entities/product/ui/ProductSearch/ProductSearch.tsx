import './ProductSearch.css';
import { Input, Flex } from 'antd';
import type { GetProps, InputRef } from 'antd';
import type { Ref } from 'react';
import SearchIcon from '../../../../shared/assets/search-icon.svg?react';
import { createStaticStyles } from 'antd-style';

const { Search } = Input;

type ProductSearchProps = GetProps<typeof Input.Search>;

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

const stylesFnSearch: ProductSearchProps['styles'] = (info) => {
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
  onSearch: (value: string) => void;
  ref?: Ref<InputRef>;
};

const ProductSearch = ({ onSearch, ref }: Props) => {
  return (
    <Flex justify="center" style={{ flex: 1 }}>
      <Search
        ref={ref}
        onSearch={onSearch}
        prefix={<SearchIcon />}
        classNames={styles}
        styles={stylesFnSearch}
        size="large"
        placeholder="Найти"
        name="search-fn"
        allowClear={false}
        style={{ maxWidth: '1023px', width: '100%' }}
      />
    </Flex>
  );
};

export { ProductSearch };
