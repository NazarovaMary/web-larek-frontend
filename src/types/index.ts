export type PaymentMethods = 'card' | 'cash' | '';
export type CategoryType = 'софт-скилл' | 'хард-скилл' | 'другое' | 'кнопка' | 'доп';

//Поля товара в карточке, поля по порядку

export interface IProductCard {
  id: string, // уникальный айди карточки товара
  image: string,  // изображение товара
  category: string,  // категория товара (например, софт-скил на макете)
  title: string,   // наименование товара
  description?: string, // описание товара
  price: number | null,  // цена товара
}

//Описывает саму карточку товара

export interface ICard {
  id: string;  // уникальный айди карточки товара
  title: string;  // наименование товара
  category: string;  // категория товара (например, софт-скил на макете)
  description?: string;  // описание товара
  image: string;  // изображение товара
  price: number | null;  // цена товара
  selected: boolean;  // был ли товар добавлен в корзину
  button: string;  // кнопка корзины
}

//Описывает страницу сайта

export interface IPage {
  counter: number;  //счётчик товаров в корзине
  store: HTMLElement[];  // массив товаров
  locked: boolean;  // блокировка действий на сайте для пользователя при открытом модальном окне
}

//Экран для ввода телефона и email

export interface IContactForm {
  email: string;  //почта покупателя
  phone: string;  //телефон покупателя
}

//Экран для ввода адреса и способа оплаты заказа

export interface IOrderContactForm {
  payment: PaymentMethods,  //способы оплаты заказа
  address: string,  //адрес доставки
}

//Хранения карточек, корзины, заказа пользователя

export interface IAppState {
  catalog: IProductCard[],  //массив товаров
  basket: IProductCard[] | null,  //корзина с товарами
  order: IOrder | null,   //информация о заказе
  preview: string | null, //предосмотр товара
  loading: boolean, //загрузка товара, логическое значение
}

//Экран успеха 

export interface IOrderSuccess {
  id: string[];   //ID купленных товаров
  total: number;  //полная сумма
}

//Объединение полей оформления заказа 

export interface IOrder extends IOrderFormError {
  items: string[],  //позиции
  total: number;  //сумма заказа
  payment: PaymentMethods;  //оплата
}

//Интерфейс форм, связываем ошибки валидации с формой контактов (телефон и email) и формы для ввода телефона и адреса доставки

export interface IOrderFormError extends IContactForm, IOrderContactForm {}

//Ошибки валидации

export type FormError = Partial<Record<keyof IOrder, string>>