import React, { useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';

import { pageContentContainerStyle } from '../../../../shared/styles/shell';
import { userApi } from '../../model/api/userApi';
import { useUserStore } from '../../model/userStore';
const { Title, Text } = Typography;
import type { UserInfoProps } from './model/types';
import type { EditProfileFormValues } from './model/types';
import { EDIT_PROFILE_KEYS } from './utils/profileConfig';

/**
 * Поверяет, равны ли два поля профиля.
 * @param initial  - начальное значение поля.
 * @param current - текущее значение поля.
 * @returns True, если поля равны, false в противном случае.
 */
function isProfileFieldEqual(initial: unknown, current: unknown): boolean {
  if (Object.is(initial, current)) return true;
  const empty = (emptyValue: unknown | null | undefined): boolean =>
    emptyValue === undefined || emptyValue === null || emptyValue === '';
  if (empty(initial) && empty(current)) return true;
  if (typeof initial === 'number' || typeof current === 'number') {
    return Number(initial) === Number(current);
  }
  return String(initial).trim().toLowerCase() === String(current).trim().toLowerCase();
}

/**
 * Возвращает измененные  поля профиля.
 * @param initial - начальные значения полей профиля.
 * @param current - текущие значения полей профиля.
 * @returns Измененные поля профиля.
 */
function getChangedProfileFields(
  initial: EditProfileFormValues,
  current: EditProfileFormValues
): Partial<EditProfileFormValues> {
  return EDIT_PROFILE_KEYS.reduce<Partial<EditProfileFormValues>>((acc, key) => {
    if (!isProfileFieldEqual(initial[key], current[key])) {
      return { ...acc, [key]: current[key] };
    }
    return acc;
  }, {});
}

const UserInfo: React.FC<UserInfoProps> = ({ user, isLoading, error }) => {
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [editProfileForm] = Form.useForm();
  const editProfileInitialRef = useRef<EditProfileFormValues | null>(null);

  if (isLoading) {
    return (
      <Card
        loading
        variant="borderless"
        style={{ borderRadius: 16, ...pageContentContainerStyle }}
      />
    );
  }

  const handleEditProfileOpen = () => {
    if (!user) return;
    const initial: EditProfileFormValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
    };
    editProfileForm.setFieldsValue(initial);
    editProfileInitialRef.current = initial;
    setOpenEditProfileModal(true);
  };
  const handleEditProfileClose = () => {
    editProfileForm.resetFields();
    editProfileInitialRef.current = null;
    setOpenEditProfileModal(false);
  };
  const handleEditProfileSubmit = async (values: EditProfileFormValues, id: string) => {
    const initial = editProfileInitialRef.current;
    if (!initial) {
      handleEditProfileClose();
      return;
    }
    const patch = getChangedProfileFields(initial, values);
    if (Object.keys(patch).length === 0) {
      message.info('Нет изменений для сохранения');
      return;
    }
    handleEditProfileClose();
    try {
      const res = await userApi.patchUser(id, patch);
      useUserStore.getState().setUser(res.data);
      message.success('Профиль успешно обновлен');
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Не удалось обновить профиль');
    }
  };

  if (error) {
    return (
      <Alert
        type="error"
        showIcon={true}
        title="Не удалось загрузить профиль"
        description={error}
        style={pageContentContainerStyle}
      />
    );
  }

  if (!user) {
    return (
      <Card variant="borderless" style={{ borderRadius: 16, ...pageContentContainerStyle }}>
        <Empty description="Профиль недоступен. Повторите авторизацию." />
      </Card>
    );
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Пользователь',
      span: 'filled',
      children: `${user.firstName} ${user.lastName}`,
    },
    {
      key: '2',
      label: 'Тел.',
      span: 'filled',

      children: user.phone ?? '—',
    },
    {
      key: '3',
      label: 'Эл.почта',
      span: 'filled',

      children: user.email,
    },
    {
      key: '4',
      label: 'Пол',
      span: 3,

      children: user.gender === 'male' ? 'Муж' : user.gender === 'female' ? 'Жен.' : '—',
    },
    {
      key: '5',
      span: 3,

      label: 'Возраст',
      children: typeof user.age === 'number' ? `${user.age} лет` : '—',
    },
  ];

  const profileHeader = (
    <>
      <Flex
        justify="space-between"
        align="center"
        gap={16}
        style={{
          padding: 24,
          borderRadius: 16,
          background:
            'linear-gradient(135deg, color-mix(in oklab, #242EDB 12%, white) 0%, #ffffff 55%, color-mix(in oklab, #797fea 12%, white) 100%)',
          border: '1px solid #f0f0f0',
        }}
        wrap
      >
        <Space size={16} align="center" style={{ minWidth: 280 }}>
          <Avatar
            size={88}
            src={user.image}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#242EDB', flexShrink: 0 }}
          />

          <Flex vertical gap={4}>
            <Title level={2} style={{ margin: 0, lineHeight: 1.1 }}>
              {user.firstName} {user.lastName}
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              @{user.username}
            </Text>
            <Space size={8} wrap>
              <Tag color="geekblue">Пользователь</Tag>
              {user.gender ? (
                <Tag color={user.gender === 'male' ? 'blue' : 'pink'}>
                  {user.gender === 'male'
                    ? 'Муж.'
                    : user.gender === 'female'
                      ? 'Жен.'
                      : user.gender}
                </Tag>
              ) : null}
            </Space>
          </Flex>
        </Space>

        <Space wrap>
          <Button type="default" aria-label="Редактировать профиль" onClick={handleEditProfileOpen}>
            Редактировать
          </Button>
          <Button type="primary" aria-label="Настройки" disabled>
            Настройки
          </Button>
        </Space>
      </Flex>
      <Modal
        centered
        title="Редактировать профиль"
        okText="Сохранить"
        cancelText="Отменить"
        open={openEditProfileModal}
        onCancel={handleEditProfileClose}
        onOk={() =>
          editProfileForm.validateFields().then((values) => {
            handleEditProfileSubmit(values as EditProfileFormValues, user.id.toString());
          })
        }
      >
        <Form
          form={editProfileForm}
          layout="vertical"
          onFinish={(submitted: EditProfileFormValues) => {
            handleEditProfileSubmit(submitted, String(user.id));
          }}
        >
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите имя',
                pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{1,15}$/,
              },
            ]}
          >
            <Input placeholder="Имя" />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите фамилию',
                pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,15}$/,
              },
            ]}
          >
            <Input placeholder="Фамилия" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите email',
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите телефон',
                pattern: /^\+?[1-9]\d{0,2}[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{4}$/,
              },
            ]}
          >
            <Input placeholder="Телефон" />
          </Form.Item>
          <Form.Item label="Пол" name="gender" rules={[{ message: 'Пожалуйста, выберите пол' }]}>
            <Select
              placeholder="Пол"
              options={[
                { label: 'Муж', value: 'male' },
                { label: 'Жен.', value: 'female' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Возраст"
            name="age"
            rules={[
              {
                message: 'Пожалуйста, введите возраст',
                pattern: /^[0-9]{1,3}$/,
                min: 18,
                max: 100,
              },
            ]}
          >
            <Input placeholder="Возраст" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  return (
    <Flex vertical gap={16} style={pageContentContainerStyle}>
      {profileHeader}

      <Card
        variant="borderless"
        style={{ borderRadius: 16, padding: '20px', border: '1px solid #f0f0f0' }}
      >
        <Tabs
          items={[
            {
              key: 'profile',
              label: 'Профиль',
              children: (
                <Descriptions
                  title="Основные данные"
                  items={items}
                  column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                  bordered
                  size="middle"
                />
              ),
            },
            {
              key: 'contacts',
              label: 'Контакты',
              children: (
                <Descriptions
                  title="Контактная информация"
                  bordered
                  size="middle"
                  column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                  items={[
                    {
                      key: 'email',
                      label: 'Эл.почта',
                      children: user.email || '—',
                    },
                    {
                      key: 'phone',
                      label: 'Телефон',
                      children: user.phone ?? '—',
                    },
                    {
                      key: 'address',
                      label: 'Адрес',
                      children: user.address?.city ?? '—',
                    },
                  ]}
                />
              ),
            },
            {
              key: 'security',
              label: 'Безопасность',
              children: (
                <Alert
                  type="info"
                  showIcon
                  message="Раздел в разработке"
                  description="Здесь обычно находятся смена пароля, активные сессии и 2FA."
                />
              ),
            },
          ]}
        />
      </Card>
    </Flex>
  );
};

export { UserInfo };
