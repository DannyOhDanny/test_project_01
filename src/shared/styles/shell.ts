import type { CSSProperties } from 'react';

import type { AppThemeMode } from '../config/themeMode';
export const PAGE_CONTENT_MAX_WIDTH = 1200;

export const PAGE_SECTION_GAP = 24;

export const PAGE_ROW_GUTTER: [number, number] = [20, 20];

export const pageContentContainerStyle = (themeMode: AppThemeMode): CSSProperties => ({
  width: '100%',
  maxWidth: PAGE_CONTENT_MAX_WIDTH,
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
  padding: '12px 16px',
  borderRadius: 18,
  background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
});

export const pageTitleStyle = (themeMode: AppThemeMode): CSSProperties => ({
  margin: 0,
  marginBottom: 8,
  fontSize: 26,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.25,
  color: themeMode === 'dark' ? '#fff' : '#1f1f1f',
});

export const pageDescriptionStyle = (themeMode: AppThemeMode): CSSProperties => ({
  marginBottom: 0,
  maxWidth: 720,
  fontSize: 15,
  lineHeight: 1.55,
  color: themeMode === 'dark' ? '#fff' : '#1f1f1f',
});

export const sectionBlockTitleStyle = (themeMode: AppThemeMode): CSSProperties => ({
  margin: 0,
  letterSpacing: '-0.02em',
  fontWeight: 600,
  color: themeMode === 'dark' ? '#fff' : '#1f1f1f',
});

export const cardShellStyle = (themeMode: AppThemeMode): CSSProperties => ({
  borderRadius: 18,
  border: themeMode === 'dark' ? '1px solid #303030' : '1px solid #d9d9d9',
  boxShadow:
    themeMode === 'dark'
      ? '0 1px 2px rgba(255, 255, 255, 0.06), 0 8px 24px rgba(255, 255, 255, 0.06)'
      : '0 1px 2px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06)',
  background: themeMode === 'dark' ? '#1f1f1f' : '#fff',
});

export const cardStyle = (themeMode: AppThemeMode): CSSProperties => ({
  borderRadius: '12px',
  width: '100%',
  maxWidth: '100%',
  padding: '12px 16px',
  boxShadow:
    themeMode === 'dark'
      ? '0 1px 2px rgba(255, 255, 255, 0.06), 0 8px 24px rgba(255, 255, 255, 0.06)'
      : '0 1px 2px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06)',
  border: themeMode === 'dark' ? '1px solid #303030' : '1px solid #d9d9d9',
  backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#fff',
});

export const menuStyles = (themeMode: AppThemeMode): CSSProperties => ({
  display: 'flex',
  gap: 40,
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#fff',
});
