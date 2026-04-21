import type { CSSProperties } from 'react';

/** Единая максимальная ширина контентной колонки приложения. */
export const PAGE_CONTENT_MAX_WIDTH = 1200;

/** Отступы между крупными блоками на странице (карточки, секции). */
export const PAGE_SECTION_GAP = 24;

/** `gutter` для `Row` на основных страницах. */
export const PAGE_ROW_GUTTER: [number, number] = [20, 20];

/** Центрируемая колонка: ширина и выравнивание (горизонтальные поля задаёт `Content` в лейауте). */
export const pageContentContainerStyle: CSSProperties = {
  width: '100%',
  maxWidth: PAGE_CONTENT_MAX_WIDTH,
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
};

/** Заголовок страницы (уровень 2). */
export const pageTitleStyle: CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: 26,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.25,
};

/** Подзаголовок под заголовком страницы. */
export const pageDescriptionStyle: CSSProperties = {
  marginBottom: 0,
  maxWidth: 720,
  fontSize: 15,
  lineHeight: 1.55,
};

/** Заголовок секции внутри карточки (уровень 4). */
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
