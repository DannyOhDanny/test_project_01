import React from 'react';
import { Form, Alert, Input, Button, Checkbox, Typography, Image, Flex, Card, Divider } from 'antd';
import { LoginFormValues } from '../../model/types';
import { useAuthStore } from '../../../../../entities/user/model/authStore';
import logo from '../../../../../shared/assets/logo.svg';
import './LoginForm.css';
import LockIcon from '../../../../../shared/assets/lock-icon.svg?react';
import UserIcon from '../../../../../shared/assets/user-icon.svg?react';
import EyeOffIcon from '../../../../../shared/assets/eye-off-icon.svg?react';
import EyeOpenIcon from '../../../../../shared/assets/eye-on-icon.svg?react';
import ClearIcon from '../../../../../shared/assets/close-icon.svg?react';

import { Link } from 'react-router';

interface LoginFormProps {
  onSuccess?: () => void;
}
const { Text, Title } = Typography;

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const { login, isLoading, error } = useAuthStore();
  const onFinish = async (values: LoginFormValues) => {
    try {
      await login(
        { username: values.new_user_name, password: values.new_user_password },
        values.remember
      );
      onSuccess?.();
    } catch {}
  };

  return (
    <Flex vertical align="center" justify="center">
      <Flex vertical align="center" className="form-content" justify="center">
        <Card className="form-card" classNames={{ body: 'form-card-body' }}>
          <Image alt="logo" src={logo} className="form-image" preview={false} />
          <Title className="form-title">Добро пожаловать</Title>
          <Text className="form-secondary-text">Пожалуйста, авторизируйтесь.</Text>
          <Form
            form={form}
            name="Почта"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            initialValues={{ remember: false }}
            className="form"
          >
            <Form.Item
              label="Почта"
              name="new_user_name"
              className="form-item"
              rules={[
                { required: true, message: 'Введите почту' },
                { min: 6, message: 'Минимум 6 символов' },
                { max: 20, message: 'Максимум 20 символов' },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: 'Латинские буквы, цифры и нижнее подчеркивание',
                },
              ]}
            >
              <Input
                prefix={<UserIcon />}
                placeholder="Введите логин"
                size="large"
                allowClear={{ clearIcon: <ClearIcon /> }}
                autoComplete="off"
                classNames={{
                  root: 'form-input',
                }}
              />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="new_user_password"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 6, message: 'Минимум 6 символов' },
              ]}
            >
              <Input.Password
                prefix={<LockIcon />}
                placeholder="Введите пароль"
                size="large"
                autoComplete="new-password"
                iconRender={(visible) => (visible ? <EyeOpenIcon /> : <EyeOffIcon />)}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className="check-box">
              <Checkbox
                classNames={{
                  icon: 'form-checkbox',
                  label: 'form-label',
                }}
              >
                Запомнить данные
              </Checkbox>
            </Form.Item>
            {error && (
              <Form.Item>
                <Alert title={error} type="error" showIcon />
              </Form.Item>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              className="form-button"
            >
              Войти
            </Button>
            <Divider plain className="form-divider" style={{ borderTopWidth: 1 }}>
              или
            </Divider>
            <div className="form-bottom-wrapper">
              <Text className="form-bottom-text">
                Нет аккаунта?{' '}
                <Link to="#" target="_self">
                  <Button
                    variant="link"
                    type="link"
                    classNames={{
                      root: 'form-link-root',
                      content: 'form-link',
                    }}
                  >
                    Создать
                  </Button>
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </Flex>

      <Alert
        style={{ marginTop: 16, fontSize: 14, width: '50%' }}
        title="Данные для входа:"
        description={
          <div style={{ whiteSpace: 'pre-line' }}>
            Логин: "emilys"
            <br />
            Пароль: "emilyspass"
          </div>
        }
        type="info"
        showIcon
      />
    </Flex>
  );
};
