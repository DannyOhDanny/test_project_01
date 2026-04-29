import {
  Button,
  Carousel,
  Col,
  Descriptions,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Typography,
} from 'antd';

import { ProductTable } from '../../../entities/product/ui/ProductTable/ProductTable';
import AddIcon from '../../../shared/assets/add-icon.svg?react';
import { cardStyle } from '../../../shared/styles/shell';
import type { ProductFormFieldsType, ProductTableBlockProps } from '../model/types';

const { Text, Title } = Typography;

const ProductTableBlock: React.FC<ProductTableBlockProps> = ({
  productsTableData,
  openInfoModal,
  closeInfoModal,
  selectedProduct,
  sortedInfo,
  handleTableChange,
  rowSelection,
  paginationConfig,
  infoModalOpen,
  showModal,
  form,
  onFinish,
  onFinishFailed,
  handleReset,
  handleModalClose,
  isProductPopupOpen,
}) => {
  return (
    <>
      <Flex vertical gap={0} style={cardStyle}>
        <Flex justify="space-between" gap={0} wrap="wrap" align="center">
          <Title className="table-title">Товары</Title>
          <Button type="primary" icon={<AddIcon />} className="table-add-btn" onClick={showModal}>
            Добавить товар
          </Button>
        </Flex>
        <Text className="table-text">
          {' '}
          Все позиции: {productsTableData.total > 0 ? productsTableData.total : '0'}
        </Text>
        <ProductTable
          emptyText={productsTableData.emptyText}
          isLoading={productsTableData.loading}
          onOpenInfoModal={openInfoModal}
          data={productsTableData.data}
          sortedInfo={sortedInfo ?? { columnKey: undefined, order: undefined }}
          errorMessage={productsTableData.errorMessage}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          paginationConfig={paginationConfig}
        />
      </Flex>

      <Modal
        title="Карточка товара"
        centered
        open={infoModalOpen}
        onCancel={closeInfoModal}
        footer={null}
      >
        {selectedProduct && (
          <>
            <Carousel
              autoplay
              arrows
              dots
              style={{ width: '300px', height: '300px', margin: '0 auto' }}
            >
              {selectedProduct.images &&
                selectedProduct.images.map((image, key) => {
                  return (
                    <Image
                      src={image}
                      key={key}
                      alt={selectedProduct.title}
                      width={300}
                      height={300}
                    />
                  );
                })}
            </Carousel>
            <Descriptions bordered column={1} layout="horizontal">
              <Descriptions.Item label="Наименование">
                {selectedProduct.title ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Вендор">{selectedProduct.brand ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Цена">{selectedProduct.price ?? '—'} ₽</Descriptions.Item>
              <Descriptions.Item label="Рейтинг">{selectedProduct.rating ?? '—'}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
      <Modal
        centered={true}
        title="Добавить товар"
        closable={true}
        open={isProductPopupOpen}
        onCancel={handleModalClose}
        width={560}
        styles={{ body: { paddingTop: 8 } }}
        footer={null}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Заполните поля ниже. После сохранения позиция появится в общем списке.
        </Text>
        <Form<ProductFormFieldsType>
          layout="vertical"
          form={form}
          name="product-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark="optional"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Наименование"
                aria-label="Наименование"
                name="title"
                rules={[
                  { required: true, message: 'Обязательное поле' },
                  {
                    pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,25}$/,
                    message: 'Буквы, цифры и знаки препинания',
                  },
                ]}
              >
                <Input placeholder="Например, Смартфон X" allowClear tabIndex={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Вендор"
                aria-label="Вендор"
                name="brand"
                rules={[
                  { required: true, message: 'Обязательное поле' },
                  {
                    pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,15}$/,
                    message: 'Буквы, цифры и знаки препинания',
                  },
                ]}
              >
                <Input placeholder="Бренд или производитель" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Категория"
                aria-label="Категория"
                name="category"
                rules={[
                  { required: true, message: 'Обязательное поле' },
                  {
                    pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,15}$/,
                    message: 'Буквы, цифры и знаки препинания',
                  },
                ]}
              >
                <Input placeholder="Категория в каталоге" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Артикул"
                aria-label="Артикул"
                name="sku"
                rules={[
                  { required: true, message: 'Обязательное поле' },
                  {
                    pattern: /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?()\-:;'"«»—]{6,12}$/,
                    message: 'Буквы, цифры и знаки препинания',
                  },
                ]}
              >
                <Input placeholder="Уникальный SKU" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Оценка"
                aria-label="Оценка"
                name="rating"
                rules={[
                  { required: true, message: 'Обязательное поле' },
                  { pattern: /^[1-5]$/, message: 'Введите число от 1 до 5' },
                  {
                    validator: (_, value) =>
                      !value || (Number(value) >= 1 && Number(value) <= 5)
                        ? Promise.resolve()
                        : Promise.reject(new Error('От 1 до 5')),
                  },
                ]}
              >
                <InputNumber
                  stringMode
                  min={1}
                  max={5}
                  step={1}
                  placeholder="От 1 до 5"
                  style={{ width: '100%' }}
                  controls
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Цена"
                aria-label="Цена"
                name="price"
                rules={[
                  { required: true, message: 'Обязательное поле' },
                  { pattern: /^\d+(\.\d{1,2})?$/, message: 'Введите корректную цену' },
                  {
                    validator: (_, value) =>
                      !value || Number(value) > 0
                        ? Promise.resolve()
                        : Promise.reject(new Error('Цена должна быть больше 0')),
                  },
                ]}
              >
                <InputNumber
                  stringMode
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  addonAfter="₽"
                  style={{ width: '100%' }}
                  controls
                />
              </Form.Item>
            </Col>
          </Row>
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={12}
            style={{ marginTop: 8 }}
          >
            <Flex gap={10} wrap="wrap">
              <Button type="default" htmlType="reset" onClick={handleReset} aria-label="Сбросить">
                Сбросить
              </Button>
              <Button type="primary" htmlType="submit" aria-label="Добавить">
                Добавить
              </Button>
            </Flex>
            <Button type="default" onClick={handleModalClose} aria-label="Закрыть">
              Закрыть
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export { ProductTableBlock };
