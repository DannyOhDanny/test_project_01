/**
 * @file Задачник по методам массивов и объектов в JavaScript.
 * Каждая функция — отдельное упражнение; JSDoc описывает условие и ожидаемый результат.
 * Запуск в консоли: импортируйте нужную функцию и вызовите её, либо выполните файл через `tsx`/`node`.
 *
 * @author Учебные задачи (на основе конспекта «Задачи _ JS»)
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array MDN Array}
 */

// ─── Раздел 1. Базовые методы массива ─────────────────────────────────────────

/**
 * Задача 1. Умножить каждый элемент массива на 3.
 *
 * @task 1
 * @method Array.prototype.map
 * @returns Новый массив `[3, 9, 12]` для входа `[1, 3, 4]`.
 *
 * @example
 * task01MultiplyByThree(); // [3, 9, 12]
 */
export function task01MultiplyByThree(): number[] {
  const arr = [1, 3, 4];
  return arr.map((item) => item * 3);
}

/**
 * Задача 2. Оставить только строки длиннее 5 символов.
 *
 * @task 2
 * @method Array.prototype.filter
 * @returns Для `['str','stri','strin','string']` остаётся массив с одним элементом `'string'`.
 */
export function task02StringsLongerThanFive(): string[] {
  const stringArr = ['str', 'stri', 'strin', 'string'];
  return stringArr.filter((item) => item.length > 5);
}

/**
 * Задача 3. Найти **первый** элемент, больший 10.
 *
 * @task 3
 * @method Array.prototype.find
 * @remarks В конспекте ошибочно стоял `filter` — он вернёт **все** подходящие элементы.
 * @returns Для `[1, 2, 3, 40, 50]` первое найденное — `40`.
 */
export function task03FirstGreaterThanTen(): number | undefined {
  const numberArr = [1, 2, 3, 40, 50];
  return numberArr.find((item) => Number(item) > 10);
}

/**
 * Задача 4. Проверить, есть ли хотя бы одно отрицательное число.
 *
 * @task 4
 * @method Array.prototype.some
 */
export function task04HasNegative(): boolean {
  const negativeNumberArr = [1, -2, 3, 40, 50];
  return negativeNumberArr.some((item) => Number(item) < 0);
}

/**
 * Задача 5. Проверить, что все числа неотрицательные (≥ 0).
 *
 * @task 5
 * @method Array.prototype.every
 */
export function task05AllNonNegative(): boolean {
  const negativeNumberArr = [1, -2, 3, 40, 50];
  return negativeNumberArr.every((item) => Number(item) >= 0);
}

/**
 * Задача 6. Найти сумму элементов числового массива.
 *
 * @task 6
 * @method Array.prototype.reduce
 */
export function task06SumArray(): number {
  const negativeNumberArr = [1, -2, 3, 40, 50];
  return negativeNumberArr.reduce((acc, current) => acc + current, 0);
}

// ─── Раздел 2. Массив объектов `users` ───────────────────────────────────────

/** Общий пример пользователей для задач 7–15 (в данных дважды встречается `id: 3`). */
const usersSample = [
  { id: 1, name: 'Ivan', age: 20 },
  { id: 2, name: 'Anna', age: 17 },
  { id: 3, name: 'Oleg', age: 25 },
  { id: 3, name: 'Misha', age: 25 },
];

/**
 * Задача 7. Получить массив имён.
 *
 * @task 7
 * @method map
 */
export function task07UserNames(): string[] {
  return usersSample.map((item) => item.name);
}

/**
 * Задача 8. Оставить пользователей старше 18 лет.
 *
 * @task 8
 * @method filter
 */
export function task08UsersOlderThan18(): typeof usersSample {
  return usersSample.filter((item) => item.age > 18);
}

/**
 * Задача 9. Найти пользователя с `id === 2`.
 *
 * @task 9
 * @method find
 */
export function task09UserById2(): (typeof usersSample)[number] | undefined {
  return usersSample.find((item) => item.id === 2);
}

/**
 * Задача 10. Получить массив возрастов.
 *
 * @task 10
 * @method map
 */
export function task10UserAges(): number[] {
  return usersSample.map((item) => item.age);
}

/** Запись пользователя с полем `isAdult`. */
export type UserWithAdult = (typeof usersSample)[number] & { isAdult: boolean };

/**
 * Задача 11. Добавить каждому пользователю поле `isAdult` (`age > 18`).
 *
 * @task 11
 * @method map
 */
export function task11UsersWithIsAdult(): UserWithAdult[] {
  return usersSample.map((item) => ({ ...item, isAdult: item.age > 18 }));
}

/**
 * Задача 12. Посчитать сумму возрастов.
 *
 * @task 12
 * @method reduce
 */
export function task12SumOfAges(): number {
  return usersSample.reduce((acc, item) => acc + item.age, 0);
}

/**
 * Задача 13a. Найти максимальный возраст через `reduce`.
 *
 * @task 13
 * @method reduce
 */
export function task13MaxAgeReduce(): number {
  return usersSample.reduce((acc, item) => (acc > item.age ? acc : item.age), 0);
}

/**
 * Задача 13b. Найти максимальный возраст через `Math.max`.
 *
 * @task 13
 */
export function task13MaxAgeMathMax(): number {
  return Math.max(...usersSample.map((item) => item.age));
}

/**
 * Задача 14. Преобразовать массив пользователей в объект по ключу `id`.
 *
 * @task 14
 * @method reduce
 * @remarks При дубликатах `id` последний элемент перезапишет предыдущий.
 */
export function task14UsersById(): Record<number, (typeof usersSample)[number]> {
  return usersSample.reduce(
    (acc, item) => ({ ...acc, [item.id]: item }),
    {} as Record<number, (typeof usersSample)[number]>
  );
}

/** Счётчики «взрослые / дети». */
export type AdultChildCounts = { adult: number; child: number };

/**
 * Задача 15. Подсчитать количество пользователей младше и старше 18 лет.
 *
 * @task 15
 * @method reduce
 */
export function task15CountAdultsAndChildren(): AdultChildCounts {
  return usersSample.reduce(
    (acc, item) => ({
      ...acc,
      [item.age > 18 ? 'adult' : 'child']: (acc[item.age > 18 ? 'adult' : 'child'] ?? 0) + 1,
    }),
    { adult: 0, child: 0 }
  );
}

/**
 * Задача 16. Убрать дубликаты по `id` (оставить первое вхождение).
 *
 * @task 16
 * @method filter + findIndex
 */
export function task16UniqueUsersById(): typeof usersSample {
  return usersSample.filter(
    (item, index, self) => self.findIndex((t) => t.id === item.id) === index
  );
}

// ─── Раздел 3. Заказы `orders` ───────────────────────────────────────────────

const ordersSample = [
  { id: 1, user: 'Ivan', amount: 100 },
  { id: 2, user: 'Anna', amount: 200 },
  { id: 2, user: 'Anna', amount: 400 },
  { id: 3, user: 'Ivan', amount: 300 },
  { id: 3, user: 'Ivan', amount: 300 },
];

/**
 * Задача 17. Сумма заказов по каждому пользователю (`user` → сумма `amount`).
 *
 * @task 17
 * @method reduce
 */
export function task17SumAmountByUser(): Record<string, number> {
  return ordersSample.reduce(
    (acc, item) => ({ ...acc, [item.user]: (acc[item.user] ?? 0) + item.amount }),
    {} as Record<string, number>
  );
}

/**
 * Задача 18. Массив сумм заказов по пользователю (агрегация списками сумм).
 *
 * @task 18
 * @method reduce
 */
export function task18AmountListsByUser(): Record<string, number[]> {
  return ordersSample.reduce(
    (acc, item) => ({
      ...acc,
      [item.user]: [...(acc[item.user] ?? []), item.amount],
    }),
    {} as Record<string, number[]>
  );
}

/** Результаты задач 19–22 строятся от суммы по пользователю (задача 17). */
export type OrdersStats = ReturnType<typeof task17SumAmountByUser>;

/**
 * Задача 19. Отсортировать пользователей по убыванию суммы заказов.
 *
 * @task 19
 * @returns Массив пар `[user, total]` от большего к меньшему.
 */
export function task19SortUsersByTotalDesc(): [string, number][] {
  const ordersAmount = task17SumAmountByUser();
  return Object.entries(ordersAmount).sort((a, b) => b[1] - a[1]);
}

/**
 * Задача 20. Пользователь с максимальной суммой заказов.
 *
 * @task 20
 */
export function task20UserWithMaxTotal(): string {
  const ordersAmount = task17SumAmountByUser();
  return Object.entries(ordersAmount).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Задача 21. Пользователь с минимальной суммой заказов.
 *
 * @task 21
 */
export function task21UserWithMinTotal(): string {
  const ordersAmount = task17SumAmountByUser();
  return Object.entries(ordersAmount).sort((a, b) => a[1] - b[1])[0][0];
}

/**
 * Задача 22. Средняя сумма по пользователям (среднее из итогов по каждому имени).
 *
 * @task 22
 */
export function task22AveragePerUserBucket(): number {
  const ordersAmount = task17SumAmountByUser();
  const values = Object.values(ordersAmount);
  return values.reduce((acc, item) => acc + item, 0) / values.length;
}

/**
 * Задача 23. Сумма всех заказов (по объединённому объекту сумм или напрямую из массива).
 *
 * @task 23
 */
export function task23TotalOrdersSum(): number {
  const ordersAmount = task17SumAmountByUser();
  return Object.values(ordersAmount).reduce((acc, item) => acc + item, 0);
}

// ─── Раздел 4. Объект `stats` ────────────────────────────────────────────────

const statsSample = {
  Ivan: 400,
  Anna: 200,
  Oleg: 100,
};

/**
 * Задача 24. Получить массив пар ключ–значение.
 *
 * @task 24
 * @method Object.entries
 */
export function task24StatsEntries(): [string, number][] {
  return Object.entries(statsSample);
}

/**
 * Задача 25. Найти пользователя с максимальным значением в `stats`.
 *
 * @task 25
 * @returns Кортеж `[имя, значение]`.
 */
export function task25StatsMaxEntry(): [string, number] {
  return Object.entries(statsSample).sort((a, b) => b[1] - a[1])[0];
}

/**
 * Задача 26. Отсортировать записи по убыванию значения.
 *
 * @task 26
 */
export function task26StatsSortedDesc(): [string, number][] {
  return Object.entries(statsSample).sort((a, b) => b[1] - a[1]);
}

/**
 * Задача 27. После сортировки преобразовать обратно в объект (порядок ключей в современных движках сохраняется при создании из отсортированных entries).
 *
 * @task 27
 * @method Object.fromEntries
 */
export function task27StatsSortedObject(): Record<string, number> {
  const statsArr = Object.entries(statsSample).sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(statsArr);
}

// ─── Раздел 5. Активные пользователи ─────────────────────────────────────────

const usersArrSample = [
  { name: 'Ivan', age: 20, isActive: true },
  { name: 'Anna', age: 17, isActive: false },
  { name: 'Oleg', age: 25, isActive: true },
];

/**
 * Задача 28. Имена активных пользователей старше 18 лет (строго `age > 18`).
 *
 * @task 28
 * @method filter + map
 */
export function task28ActiveAdultNames(): string[] {
  return usersArrSample.filter((item) => item.isActive && item.age > 18).map((item) => item.name);
}

/**
 * Задача 29. Средний возраст среди **активных** пользователей старше 18 лет.
 *
 * @task 29
 */
export function task29AverageAgeActiveAdults(): number {
  const adults = usersArrSample.filter((item) => item.isActive && item.age > 18);
  return adults.reduce((acc, current) => acc + current.age, 0) / adults.length;
}

/**
 * Задача 30. Отсортировать активных пользователей старше 18 лет по возрасту (по возрастанию).
 *
 * @task 30
 * @method filter + sort
 * @remarks `sort` мутирует массив — при необходимости сначала копируйте `[...adults].sort(...)`.
 */
export function task30ActiveAdultsSortedByAge(): typeof usersArrSample {
  const adults = usersArrSample.filter((item) => item.isActive && item.age > 18);
  return [...adults].sort((a, b) => a.age - b.age);
}
