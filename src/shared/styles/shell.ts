import type { CSSProperties } from 'react';

export const PAGE_CONTENT_MAX_WIDTH = 1200;

export const PAGE_SECTION_GAP = 24;

export const PAGE_ROW_GUTTER: [number, number] = [20, 20];

export const pageContentContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: PAGE_CONTENT_MAX_WIDTH,
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
};

export const pageTitleStyle: CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: 26,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.25,
};

export const pageDescriptionStyle: CSSProperties = {
  marginBottom: 0,
  maxWidth: 720,
  fontSize: 15,
  lineHeight: 1.55,
};

export const sectionBlockTitleStyle: CSSProperties = {
  margin: 0,
  letterSpacing: '-0.02em',
  fontWeight: 600,
};

export const cardShellStyle: CSSProperties = {
  borderRadius: 18,
  border: '1px solid rgba(5, 5, 5, 0.08)',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06)',
  background: '#ffffff',
};

export const cardStyle: CSSProperties = {
  borderRadius: '12px',
  width: '100%',
  maxWidth: '100%',
  backgroundColor: '#fff',
  padding: '12px 16px',
};

export const menuStyles: CSSProperties = {
  display: 'flex',
  gap: 40,
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#fff',
  boxShadow: 'inset 0 -2px 0 0  #f3f3f3',
};
