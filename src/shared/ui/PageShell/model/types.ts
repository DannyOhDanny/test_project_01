import type { CSSProperties, ReactNode } from 'react';

type PageShellProps = {
  title: string;
  description?: ReactNode;
  buttonText?: string;
  // headerExtra?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
};

export type { PageShellProps };
