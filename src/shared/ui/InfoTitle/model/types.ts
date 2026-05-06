import React from 'react';

interface InfoTitleProps {
  title: string;
  showModal?: () => void;
  buttonText?: string;
  total?: number;
  subtitle?: string;
  children?: React.ReactNode;
}

export type { InfoTitleProps };
