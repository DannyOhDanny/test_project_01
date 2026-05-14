import type { CSSProperties, ReactNode } from 'react';

import type { AppThemeMode } from '../../../config/themeMode';
type PageShellProps = {
  title: string;
  description?: ReactNode;
  // headerExtra?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  buttonText?: string;
  onButtonClick?: () => void;
  themeMode: AppThemeMode;
};

export type { PageShellProps };
