import { lazy, StrictMode, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import { ErrorBoundary } from '../shared/ui/ErrorBoundary/ErrorBoundary';
import { ProtectedRoute } from '../shared/ui/ProtectedRoute/ProtectedRoute';
import { Spinner } from '../shared/ui/Spinner/Spinner';
import { AppLayout } from '../widgets/Layout/AppLayout/AppLayout';

import { QueryProvider } from './provider/QueryProvider';
import { StoreProvider } from './provider/StoreProvider';

import './App.css';

const LoginPageLazy = lazy(() =>
  import('../pages/auth/LoginPage/ui/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const ProfilePageLazy = lazy(() =>
  import('../pages/profile/ProfilePage/ui/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const TablePageLazy = lazy(() =>
  import('../pages/table/TablePage').then((m) => ({ default: m.TablePage }))
);
const StatisticsPageLazy = lazy(() =>
  import('../pages/stats/StatisticsPage').then((m) => ({ default: m.StatisticsPage }))
);

export function App() {
  return (
    <StrictMode>
      <Suspense fallback={<Spinner />}>
        <ConfigProvider
          locale={ruRU}
          theme={{
            token: {
              fontFamily: 'Inter Variable, sans-serif',
              fontSize: 16,
              fontSizeHeading1: 32,
              fontSizeHeading2: 28,
              fontSizeHeading3: 24,
              fontSizeHeading5: 20,
              fontWeightStrong: 600,
              paddingSM: 12,
              lineWidth: 2,
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
          }}
        >
          <QueryProvider>
            <ReactQueryDevtools initialIsOpen={false} />

            <StoreProvider>
              <BrowserRouter>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/login" element={<LoginPageLazy />} />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <ProfilePageLazy />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/table"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <TablePageLazy />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/stats"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <StatisticsPageLazy />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <Navigate to="/profile" replace />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
            </StoreProvider>
          </QueryProvider>
        </ConfigProvider>
      </Suspense>
    </StrictMode>
  );
}

export default App;
