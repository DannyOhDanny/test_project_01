import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import type { ThemeConfig } from 'antd';
import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import { useUserStore } from '../../../entities/user/model/userStore';
import { ErrorBoundary } from '../../../shared/ui/ErrorBoundary/ErrorBoundary';
import { ProtectedRoute } from '../../../shared/ui/ProtectedRoute/ProtectedRoute';
import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import { AppLayout } from '../../../widgets/Layout/AppLayout/AppLayout';

const LoginPageLazy = lazy(() =>
  import('../../../pages/auth/LoginPage/ui/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const ProfilePageLazy = lazy(() =>
  import('../../../pages/profile/ProfilePage/ui/ProfilePage').then((m) => ({
    default: m.ProfilePage,
  }))
);
const TablePageLazy = lazy(() =>
  import('../../../pages/table/TablePage').then((m) => ({ default: m.TablePage }))
);
const StatisticsPageLazy = lazy(() =>
  import('../../../pages/stats/StatisticsPage').then((m) => ({ default: m.StatisticsPage }))
);
const CalcPageLazy = lazy(() =>
  import('../../../pages/calc/CalcPage').then((m) => ({ default: m.CalcPage }))
);
const NotFoundPageLazy = lazy(() =>
  import('../../../pages/not-found/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const ReactQueryDevtoolsLazy = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools }))
);
const QueryProvider = lazy(() =>
  import('../../../app/provider/QueryProvider').then((m) => ({ default: m.QueryProvider }))
);
const StoreProvider = lazy(() =>
  import('../../../app/provider/StoreProvider').then((m) => ({ default: m.StoreProvider }))
);
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const lightAppTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    fontFamily: 'Inter Variable, sans-serif',
    fontSize: 16,
    fontSizeHeading1: 32,
    fontSizeHeading2: 28,
    fontSizeHeading3: 24,
    fontSizeHeading5: 20,
    fontWeightStrong: 600,
    paddingSM: 12,
    lineWidth: 1,
    controlInteractiveSize: 24,
    colorPrimary: '#4a5cff',
    colorBorder: '#d9d9d9',
    colorBgContainer: '#fff',
  },
  components: {
    Input: {
      fontFamily: `'Inter Variable', sans-serif`,
      borderRadius: 12,
      fontSize: 18,
      colorBgContainer: '#ffffff',
      activeBg: '#ffffff',
      colorText: '#1f1f1f',
      colorBorder: '#d9d9d9',
      hoverBorderColor: '#4a5cff',
      activeBorderColor: '#4a5cff',
    },
    Checkbox: {
      size: 24,
      colorPrimary: '#242EDB',
      colorBorder: '#EDEDED',
      colorPrimaryBorder: '#242EDB',
      colorPrimaryHover: '#242EDB',
    },
    Form: {
      labelFontSize: 18,
      verticalLabelPadding: '0 0 6px',
    },
    Button: {
      boxShadow: 'none',
      primaryShadow: 'none',
      borderRadius: 12,
      algorithm: true,
      colorPrimary: '#4a5cff',
      colorPrimaryHover: '#5a6cff',
      colorPrimaryActive: '#3f4fff',
      margin: 0,
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
    Divider: {
      textPaddingInline: '10px',
    },
    Table: {
      headerBorderRadius: 12,
    },
    Pagination: {
      itemActiveBg: '#797fea',
      itemActiveColor: '#fff',
      itemActiveColorHover: '#fff',
    },
  },
};

const darkAppTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: 'Inter Variable, sans-serif',
    fontSize: 16,
    fontSizeHeading1: 32,
    fontSizeHeading2: 28,
    fontSizeHeading3: 24,
    fontSizeHeading5: 20,
    fontWeightStrong: 600,
    paddingSM: 12,
    lineWidth: 1,
    controlInteractiveSize: 24,
    colorPrimary: '#6b7cff',
    colorPrimaryHover: '#8898ff',
    colorPrimaryActive: '#5568e6',
    colorBorder: '#424242',
    colorBorderSecondary: '#303030',
    colorBgLayout: '#0a0a0a',
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorText: 'rgba(255, 255, 255, 0.88)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
    colorSplit: '#303030',
  },
  components: {
    Input: {
      fontFamily: `'Inter Variable', sans-serif`,
      borderRadius: 12,
      fontSize: 18,
      colorBgContainer: '#1f1f1f',
      activeBg: '#262626',
      hoverBg: '#262626',
      colorText: 'rgb(255, 255, 255)',
      colorBorder: '#424242',
      hoverBorderColor: '#6b7cff',
      activeBorderColor: '#6b7cff',
    },
    Checkbox: {
      size: 24,
      colorPrimary: '#6b7cff',
      colorBorder: '#424242',
      colorPrimaryBorder: '#6b7cff',
      colorPrimaryHover: '#8898ff',
    },
    Form: {
      labelFontSize: 18,
      verticalLabelPadding: '0 0 6px',
      labelColor: 'rgba(255, 255, 255, 0.88)',
    },
    Button: {
      boxShadow: 'none',
      primaryShadow: 'none',
      borderRadius: 12,
      algorithm: true,
      colorPrimary: '#6b7cff',
      colorPrimaryHover: '#8898ff',
      colorPrimaryActive: '#5568e6',
      margin: 0,
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
    Divider: {
      textPaddingInline: '10px',
      colorSplit: '#303030',
    },
    Table: {
      headerBorderRadius: 12,
      colorBgContainer: '#141414',
      headerBg: '#1f1f1f',
      headerColor: 'rgb(255, 255, 255)',
      rowHoverBg: '#262626',
      borderColor: '#303030',
    },
    Pagination: {
      itemActiveBg: '#6b7cff',
      itemActiveColor: '#fff',
      itemActiveColorHover: '#fff',
      colorBgContainer: '#1f1f1f',
      colorPrimary: '#6b7cff',
    },
  },
};

const ThemedApp = () => {
  const themeMode = useUserStore((state) => state.themeMode);
  const appTheme: ThemeConfig = themeMode === 'dark' ? darkAppTheme : lightAppTheme;
  return (
    <Suspense fallback={<Spinner />}>
      <ConfigProvider locale={ruRU} theme={appTheme}>
        <QueryProvider>
          {import.meta.env.DEV ? <ReactQueryDevtoolsLazy initialIsOpen={false} /> : null}
          <StoreProvider>
            <BrowserRouter basename={routerBasename}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/login" element={<LoginPageLazy themeMode={themeMode} />} />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <AppLayout themeMode={themeMode}>
                          <ProfilePageLazy themeMode={themeMode} />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/table"
                    element={
                      <ProtectedRoute>
                        <AppLayout themeMode={themeMode}>
                          <TablePageLazy themeMode={themeMode} />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stats"
                    element={
                      <ProtectedRoute>
                        <AppLayout themeMode={themeMode}>
                          <StatisticsPageLazy themeMode={themeMode} />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calc"
                    element={
                      <ProtectedRoute>
                        <AppLayout themeMode={themeMode}>
                          <CalcPageLazy themeMode={themeMode} />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <AppLayout themeMode={themeMode}>
                          <Navigate to="/table" replace />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPageLazy />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </StoreProvider>
        </QueryProvider>
      </ConfigProvider>
    </Suspense>
  );
};
export { ThemedApp };
