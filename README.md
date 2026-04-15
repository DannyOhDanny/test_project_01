# Test Project 01

Фронтенд-приложение на базе **React 19 + Vite + TypeScript**, с использованием **Ant Design**, **Zustand** и настроенным пайплайном разработки (ESLint, Prettier, Husky).

---

_GH-pages: [https://dannyohdanny.github.io/test_project_01/]_

## Стек

- React 19 + React Compiler / мемоизация
- TanStack Qiery / кеширование
- Vite / сборка rollup
- TypeScript / строгое типизирование
- Ant Design + antd-style / UI-библиотека копонентов
- Zustand / менеджер состояний
- Axios / HTTP запросы
- React Router / роутинг и маршрутизация
- ESLint + Prettier / линтеры
- Husky + lint-staged / линтеры
- API - dummyjson.com (авторизация, товары)
- Vitest + Testing Library / unit-тестирование

---

_ВАЖНО! Для загрузки данных с использованием <https://dummyjson.com/docs/> нужен VPN._

## Демо функционала

- Авторизация и сохранение сесси по токену JWT (API)
- Список товаров
- Поиск по ID и запросу (API)
- Пагинация и сортировка таблицы, запоминание состояния сортировки (API)
- Выбор строк, показ карточки товара по клику на кнопкy
- Обновление данных
- Добавление товара
- Кастомный UI (antD)
- unit-тесты функций

## Структура проекта FSD

> /src
>
> > - app - Инициализация приложения
> > - entities - Бизнес-сущности
> > - features - Фичи
> > - shared - Общие утилиты, UI, функции
> > - pages - Страницы
> > - widgets - Виджеты

---

### Установка зависимостей

```
npm install
```

### Запуск

```
npm run dev

Порт: http://localhost:3000
```

### Сборка

```
npm run build
npm run preview

Порт: http://localhost:4173

```

### Скрипты

- dev - Запуск dev-сервера

- build - сборка

- preview - Preview билда

- lint - Проверка ESLint

- lint:fix - Автофикс ESLint

- format - Форматирование Prettier

- type-check - Проверка типов TypeScript

- test - Тесты

```

Автор
Test Project 01
@DannyohDanny

```
