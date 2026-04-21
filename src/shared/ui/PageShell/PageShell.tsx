import type { CSSProperties, ReactNode } from 'react';
import { Flex, Typography } from 'antd';

import {
  PAGE_SECTION_GAP,
  pageContentContainerStyle,
  pageDescriptionStyle,
  pageTitleStyle,
} from '../../styles/shell';

const { Title, Paragraph } = Typography;

type PageShellProps = {
  title: string;
  description?: ReactNode;
  headerExtra?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
};

const PageShell = ({ title, description, headerExtra, children, style }: PageShellProps) => {
  return (
    <div
      style={{
        WebkitFontSmoothing: 'antialiased',
        ...pageContentContainerStyle,
        ...style,
      }}
    >
      <header style={{ marginBottom: PAGE_SECTION_GAP }}>
        <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
          <div style={{ minWidth: 0, flex: '1 1 280px' }}>
            <Title level={2} style={pageTitleStyle}>
              {title}
            </Title>
            {description != null && description !== '' ? (
              <Paragraph type="secondary" style={pageDescriptionStyle}>
                {description}
              </Paragraph>
            ) : null}
          </div>
          {headerExtra ? (
            <div style={{ flex: '0 0 auto', alignSelf: 'flex-start' }}>{headerExtra}</div>
          ) : null}
        </Flex>
      </header>
      <Flex vertical gap={PAGE_SECTION_GAP} style={{ width: '100%' }}>
        {children}
      </Flex>
    </div>
  );
};

export { PageShell };
