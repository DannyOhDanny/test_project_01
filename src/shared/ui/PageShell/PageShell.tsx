import type React from 'react';
import { Button, Flex, Typography } from 'antd';

import {
  PAGE_SECTION_GAP,
  pageContentContainerStyle,
  pageDescriptionStyle,
  pageTitleStyle,
} from '../../styles/shell';

import type { PageShellProps } from './model/types';

const { Title, Paragraph } = Typography;

const PageShell: React.FC<PageShellProps> = ({
  themeMode,
  title,
  description,
  buttonText,
  children,
  style,
  onButtonClick,
}) => {
  return (
    <div
      style={{
        WebkitFontSmoothing: 'antialiased',
        ...pageContentContainerStyle(themeMode),
        ...style,
      }}
    >
      <header style={{ marginBottom: PAGE_SECTION_GAP }}>
        <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
          <div style={{ minWidth: 0, flex: '1 1 280px' }}>
            <Title level={2} style={pageTitleStyle(themeMode)}>
              {title}
            </Title>
            {description != null && description !== '' ? (
              <Paragraph type="secondary" style={pageDescriptionStyle(themeMode)}>
                {description}
              </Paragraph>
            ) : null}
          </div>
          {buttonText && onButtonClick ? (
            <Button
              type="primary"
              style={{ flex: '0 0 auto', alignSelf: 'flex-start' }}
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
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
