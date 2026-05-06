import { Button, Flex, Typography } from 'antd';

import AddIcon from '../../../shared/assets/add-icon.svg?react';

import type { InfoTitleProps } from './model/types';

import './InfoTitle.css';

const { Title, Text } = Typography;

const InfoTitle: React.FC<InfoTitleProps> = ({ title, showModal, buttonText, total, subtitle }) => {
  return (
    <Flex vertical gap={0} style={{ marginBottom: 20 }}>
      <Flex justify="space-between" gap={0} wrap="wrap" align="center">
        <Title className="table-title">{title}</Title>
        {buttonText && (
          <Button type="primary" icon={<AddIcon />} className="table-add-btn" onClick={showModal}>
            {buttonText}
          </Button>
        )}
      </Flex>
      {total && <Text className="table-text">Все позиции: {total > 0 ? total : '0'}</Text>}
      {subtitle && (
        <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.5, display: 'block' }}>
          {subtitle}
        </Text>
      )}
    </Flex>
  );
};

export { InfoTitle };
