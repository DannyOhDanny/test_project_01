import { StrictMode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import { LoginPage } from '../pages/auth/LoginPage/ui/LoginPage';
import { ProfilePage } from '../pages/profile/ProfilePage/ui/ProfilePage';
import { TablePage } from '../pages/table/TablePage';
import { ProtectedRoute } from '../shared/ui/ProtectedRoute/ProtectedRoute';
import { AppLayout } from '../widgets/Layout/AppLayout/AppLayout';

import { StoreProvider } from './provider/StoreProvider';

import './App.css';

export function App() {
  return (
    <StrictMode>
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
        <StoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/table"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TablePage />
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
          </BrowserRouter>
        </StoreProvider>
      </ConfigProvider>
    </StrictMode>
  );
}

export default App;
