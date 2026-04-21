import { useEffect } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Segmented,
  Select,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

import { CategoryNameMapRu } from '../../../../shared/lib/categoryConfig';

import type { BalanceFormValues, BalanceModalProps } from './model/types';

const { Text } = Typography;

const BalanceModal = ({
  onCancel,
  onSubmit,
  initialValues,
  draftOperationId,
  open,
}: BalanceModalProps) => {
  const [balanceForm] = Form.useForm<BalanceFormValues>();
  const type = Form.useWatch('type', balanceForm) ?? initialValues?.type ?? 'income';

  const selectOptions = Object.entries(CategoryNameMapRu).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  useEffect(() => {
    if (initialValues) {
      balanceForm.setFieldsValue({
        ...initialValues,
        category: initialValues.category,
      });
    } else {
      // Новая операция: сначала сбрасываем форму, затем выставляем дефолты.
      // Нельзя делать `setFieldsValue({ id })` и сразу `resetFields()` — id сотрётся.
      balanceForm.resetFields();
      balanceForm.setFieldsValue({
        id: draftOperationId,
        type: 'income',
        amount: 0,
        notes: '',
        date: new Date().toISOString(),
      });
    }
  }, [balanceForm, draftOperationId, initialValues]);

  const handleCancel = () => {
    balanceForm.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      centered
      width={680}
      title={<span style={{ fontWeight: 650, letterSpacing: '-0.02em' }}>Операция</span>}
      forceRender
      footer={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Изменения применятся сразу в таблице.
          </Text>
          <Space>
            <Button onClick={() => balanceForm.resetFields()}>Сбросить</Button>
            <Button onClick={handleCancel}>Закрыть</Button>
            <Button type="primary" onClick={() => balanceForm.submit()}>
              Сохранить
            </Button>
          </Space>
        </Space>
      }
      onCancel={handleCancel}
    >
      <Form
        name="balanceForm"
        onFinish={onSubmit}
        form={balanceForm}
        layout="vertical"
        style={{ marginTop: 8 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item name="type" label="Тип операции">
              <Segmented
                onChange={(value) => {
                  if (initialValues) return;
                  balanceForm.setFieldValue('type', value);
                }}
                block
                disabled={!!initialValues}
                options={[
                  { value: 'income', label: 'Доход' },
                  { value: 'expenses', label: 'Расход' },
                ]}
                value={type}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="category" label="Категория">
              <Select
                options={selectOptions}
                showSearch
                placeholder="Выберите категорию"
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="date"
              label="Дата"
              getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
              getValueFromEvent={(value) => (value ? value.toISOString() : '')}
            >
              <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="amount" label="Сумма">
              <Input type="number" placeholder="Например, 1500" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="notes" label="Примечание">
              <Input placeholder="Короткий комментарий к операции" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export { BalanceModal };
