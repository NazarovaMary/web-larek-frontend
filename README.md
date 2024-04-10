#Проектная работа "Веб-ларек"

<h3>Ссылки на проект:</h3>

ссылка проекта на github - https://github.com/NazarovaMary/web-larek-frontend.git

Стек: HTML, SCSS, TS, Webpack

Проект использует событийно-ориентированный подход, который позволяет сервисам отслеживать определенные события и реагировать на них. Для разработки интерфейсов используется модель MVP, которая помогает разделить логику, данные и визуальные представления. Это обеспечивает более легкую разработку интерфейсов и позволяет заранее определить структуру.

Проект собран с использованием Webpack, реализована работа с API.

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- <a href="https://github.com/NazarovaMary/web-larek-frontend/blob/main/src/pages/index.html" target="_blank">src/pages/index.html</a> — HTML-файл главной страницы
- <a href="https://github.com/NazarovaMary/web-larek-frontend/blob/main/src/types/index.ts" target="_blank">src/types/index.ts</a> — файл с типами
- <a href="https://github.com/NazarovaMary/web-larek-frontend/blob/main/src/index.ts" target="_blank">src/index.ts</a> — точка входа приложения
- <a href="https://github.com/NazarovaMary/web-larek-frontend/blob/main/src/scss/styles.scss" target="_blank">src/scss/styles.scss</a> — корневой файл стилей
- <a href="https://github.com/NazarovaMary/web-larek-frontend/blob/main/src/utils/constants.ts" target="_blank">src/utils/constants.ts</a> — файл с константами
- <a href="https://github.com/NazarovaMary/web-larek-frontend/blob/main/src/utils/utils.ts" target="_blank">src/utils/utils.ts</a> — файл с утилитами

<h3><a href="https://www.figma.com/file/50YEgxY8IYDYj7UQu7yChb/Веб-ларёк?type=design&node-id=0-1&mode=design" target="_blank">Макет (перейти по ссылке)</a></h3>

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
<h2>Базовый код</h2>

<h3>:alien: Класс Api</h3>

Представляет собой интерфейс для выполнения HTTP-запросов к серверу. Он содержит методы для отправки и получения данных, а также обработки ответов от сервера. 

`В конструктор входит два аргумента:`
 <p>baseUrl - получает и хранит базовый url;</p>
 <p>options - опции запроса.</p>

```html 
 constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
```


`Методы:`

 <p>protected handleResponse(response: Response): Promise<object> - обработывает ответ сервера;</p>
 <p>get(uri: string) - забирает данные от сервера;</p>
 <p>post(uri: string, data: object, method: ApiPostMethods = 'POST') - отправляет данные на сервер.</p>

<h3>:alien: Класс EventEmitter</h3> 
<p>Является шаблонным компонентом для работы с событийно-ориентированной архитектурой. Он позволяет объектам подписываться на события и реагировать на их наступление.</p>


```html
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
Эти классы могут быть использованы для создания приложений с клиент-серверной архитектурой, где Api отвечает за коммуникацию с сервером, а EventEmitter используется для организации внутренней коммуникации между компонентами приложения.
<hr>

<h2>Интерфейсы</h2>

 *IProductCard* - поля для карточки товара;<br>

 *IOrder* - поля для формы оформления заказа;<br>

 *IContactForm* - поля для формы контактов;<br>

 *IAppState* - интерфейс модели приложения;<br>

 *IOrderSuccess* - экран успеха, отправка данных по заказу;<br>

 *ICard* - описывает саму карточку товара;<br>

 *IPage* - описывает страницу сайта;<br>

 *IOrderContactForm* - экран для ввода адреса и способа оплаты заказа;<br>

 *IOrderFormError* - ошибки при нарушении валидации.
<hr>

<h2>Компоненты модели данных (бизнес-логика)</h2>

<h3>:alien: Класс AppLication -</h3> 

модель данных приложения. Представляет собой хранилище с набором данных для возможности контролировать общую работу приложения. В данном случае устанавливает связь между товарами, корзиной и заказом.

Содержит поля интерфейса IAppState:

```html
 //Хранения карточек, корзины, заказа пользователя

export interface IAppState {
  catalog: IProductCard[],  //массив товаров
  basket: IProductCard[] | null,  //корзина с товарами
  order: IOrder | null,   //информация о заказе
  preview: string | null, //предосмотр товара
  loading: boolean, //загрузка товара, логическое значение
}
```

Методы:

Каталог товаров

*upCatalog* - вывод карточки товара в каталог на странице сайта.<br>

Оформление заказа

*getAccessOrder* - проверка валидности текущего заказа;<br>
*clearOrder* - сброс всех полей заказа;<br>
*setPaymentWay(method: string)* - установка способа оплаты;<br>
*getReturnItems()* - возврат товары из заказа; <br>
*setDeliveryAdress* - установка адреса доставки;<br>
*setContactOrder* - установка контактных данных клиента;<br>
*clearOrder()* - очищение всей информации по заказу; <br>
*setPreview(item: Product)* - предпросмотр карточки товара.<br>

Корзина

*addBasketArticle* - добавление товара в корзину;<br>
*deleteBasketArticle* - удаление товара из корзины;<br>
*clearBasket* - сброс текущего состояния корзины;<br>
*getBasketPrice* - получение полной суммы товаров в корзине;<br>
*updateBasket()* - обновление состояния корзины. 

<hr>

<h2>Компоненты представления</h2>

<h3>:alien: Класс LarekApi -</h3>

отвечает за обмен данными с сервером и его моделей данных (список товаров, получение карточки товара и отправка заказа). <br>

Наследуется от класса Api. Использует интерфейс ILarekAPI:


```html
 //Хранения карточек, корзины, заказа пользователя

interface ILarekAPI {
  getProductList: () => Promise<IProductCard[]>
  getProduct: (id: string) => Promise<IProductCard>
  orderProduct: (order: IOrder) => Promise<IOrderSuccess>
}
```

Методы и поля (поля дублируют названия из html):<br>

counter — элемент счетчика для определения количества товаров в корзине;<br>
catalog — каталог карточек товаров;<br>
wrapper — основной контейнет страницы;<br>
basket — элемент кнопки корзины;<br>
getProduct(id: string) - отправляет запрос на сервер, чтобы получить информацию о товаре по определенному id;<br> 
getProductList() - отправляет запрос на сервер, чтобы получить весь список товаров;<br>
orderProduct(order: IOrder) - отправляет запрос на сервер, чтобы оформить заказ с актуальными данными.

<h3>:alien: Класс Page -</h3>

отвечает за отображение главной страницы сайта, каталога товаров и счетчика корзины. <br>

Наследуется от класса Component. Использует интерфейс IPage(counter: number - количество товаров, catalog: HTMLElement[] - массив карточек HTML-элементов, locked: boolean - состояние блокировки). Конструктор включает в себя DOM-элементы: счетчик, чтобы учитывать количество товаров, каталог товаров, страница, корзина. <br>

Обработчик клика у иконки "корзина", при нажатии срабатывает событие и открывается модальное окно самой корзины. Также реализованы сеттеры для изменения счетчика количества товаров, содержимого каталога и состояния блокировки страницы.<br>

Методы и поля (поля дублируют названия из html):<br>

counter — элемент счетчика для определения количества товаров в корзине;<br>
catalog — каталог карточек товаров;<br>
wrapper — основной контейнет страницы;<br>
basket — элемент кнопки корзины;<br>

<h3>:alien: Класс ProductCard -</h3>

отвечает за вывод информации о товаре на страницу сайта. <br>

Наследуется от класса Component. Использует интерфейс IProductCard. Конструктор включает в себя DOM-элементы: уникальное айди, картинка, категория, заголовок, описание, цена товара. Добавляется обработчик клика по кнопке с помощью интерфейса ICardAction. Также реализованы сеттеры: уникальное айди, картинка, категория, заголовок, описание, цена товара, название кнопки. <br>

Методы и поля (поля дублируют названия из html):<br>

id: string - уникальный айди карточки товара;<br>
image: string - изображение товара;<br>
category: string - категория товара (например, софт-скил на макете);<br>
title: string - наименование товара;<br>
description?: string - описание товара;<br>
price: string | number - цена товара;<br>
set — устанавливает значение у свойства товара;<br>
get — получает значение у свойства товара.

<h3>:alien: Класс Modal -</h3>

отвечает за показ и закрытие модальных окон, а также вывод в них контента. <br>

Наследуется от класса Component. Тут использован интерфейс IModalData. Конструктор включает в себя DOM-элементы: кнопки открытия и закрытия модального окна. При клике закрывается модальное окно (close(): void).<br>

Методы и поля (поля дублируют названия из html):<br>

content — отвечает за контент модального окна;<br>
set content - сеттер для установки передаваемого значения содержимому модального окна;<br>
open (добавляет класс 'modal_active') — показ модального окна;<br>
close (удаляет класс 'modal_active') — закрытие модального окна;<br>
render(data: IModalData) — вызывает родительский метод, открывает модальное окно с передачей данных о контенте.

<h3>:alien: Класс Basket -</h3>
  
отвечает за работу корзины, отображение информации по заказу. <br>

Наследуется от класса Component. Для реализации используется интерфейс IBasketView (items: HTMLElement[]) - массив HTML-элементов, total: number - общая сумма товаров. Конструктор включает в себя DOM-элементы: массив товаров, итоговая стоимость, кнопка "оформить заказ". При нажатии на кнопку "Оформить" происходит отправка события - открытие модального окна с видом оплаты и адресом для доставки заказа. Для данного класса прописаны сеттеры: <br>

set items - если массив товаров пуст, то клиент видит надпись "Корзина пуста", в ином случае заполняется массив товаров; <br>

set total - устанавливает значение общей суммы товаров в корзине.<br>

Методы:<br>

disableButton(value: string) — блокирует/разблокирует кнопку оформления заказа в зависимости от наличия товаров в корзине;<br>
set total(price: number) — выводит общую стоимость товаров в корзине;<br>
set items(items: HTMLElement[]) - принимает список элементов и отображает их в корзине.

<h3>:alien: Класс Form -</h3>

отвечает за работу с формами для оформления заказа пользователем. <br>

Наследуется от класса Component. Использует интерфейс IFormState (valid: boolean - состояние валидации, errors: string[] - ошибки). Конструктор включает в себя DOM-элементы: кнопки для подтверждения отправки формы.<br>

Также в конструкторе реализовано 2 слушателя для контейнеров (addEventListener). Первый необходим для генерации события на изменение полей формы при изменении в поле ввода символов, второй для генерации события отправки формы при нажатии на кнопку отправки.<br>

Методы и поля (поля дублируют названия из html):<br>

onInputChange — обрабатывает изменение данных в полях форм;<br>
set valid — блокирует/разблокирует кнопку отправки формы в зависимости от валидности введенных данных;<br>
set errors — выводит сообщение об ошибке;<br>
submit - кнопки для подтверждения отправки формы;<br>
setText - установить текстовое содержимое;<br>
render — рендерит форму с передачей данных об ошибках, если это необходимо.<br>

<h3>:alien: Класс Order -</h3>

отвечает за работу формы заказа, где указываются способ оплаты и адрес доставки. <br>

Наследуется от класса Form. Использует интерфейс IOrder (address: string - адрес, payment: string - оплата). Конструктор включает в себя DOM-элементы: кнопка с реализованым слушателем - paymentContainer.addEventListener('click', (e: MouseEvent)). Также есть сеттеры, отвечающий за выбор адреса доставки и установки активности класса для кнопки выбора способа оплаты - setToggleClass.<br>

Методы и поля:<br>

address - отвечает за поле с адресом доставки;<br>
payment - отвечает за поле с вариантом оплаты;<br>
set address(value: string) - отвечает за выбор адреса доставки;<br>
addressInput - принимает адрес в поле.<br>

<h3>:alien: Класс ContactForm -</h3>

отвечает за работу формы заказа, где указываются контактные данные клиента (номер телефона и email). <br>

Наследуется от класса Form. Использует интерфейс IContactForm (телефон, email - строковые значения). Реализован контейнер (container: HTMLFormElement) - форма и событие. <br>
 
Сеттеры для изменения значения полей ввода телефон и email:<br>

set phone(value: string) - устанавливает номер телефона клиента;<br>
set email(value: string) - устанавливает email клиента.<br>

<h3>:alien: Класс Success -</h3>

отвечает за вывод страницы успеха (успешное оформление заказа). <br>

Наследуется от класса Component. Использует интерфейс IOrderSuccess (ID купленных товаров, полная сумма списания). Конструктор включает в себя DOM-элементы: HTML элемент для отображения компонента и actions - объект с действиями, которые предлагается выполнить пользователю после успешной операции. Для кнопки реализован слушатель, чтобы при клике на нее сработала функция (связка с интерфейсом - ISuccessActions), переданная при создании экземпляра данного класса. Сеттер set total отвечает за установку значения стоимости совершенной покупки.<br>

Методы и поля (поля дублируют названия из html):<br>

address - отвечает за поле с адресом доставки;<br>
payment - отвечает за поле с вариантом оплаты;<br>
setToggleClassPayment(className: string) - устанавливает активный класс для выбора способа оплаты;<br>
set address(value: string) - устанавливает значение в поле адреса доставки.<br>

Все взаимодействия между слоями данных и отображения прописаны в файле index.ts, находящийся в корне проекта.

<h2>Взаимодействие классов между собой</h2>

<img align="right" width="145" src="https://github.com/NazarovaMary/web-larek-frontend/assets/145542673/d60759cd-3a9b-4557-806d-4b57ac30cdd3" />

Класс Api получает данные с сервера. После класс LarekApi собирает из полученных данных массив карточек и отправляет его в класс Page. Карточки товаров формируются в классе ProductCard. В классе Modal формируются модальные окна приложения. При клике на кнопку "в корзину", с помощью метода класса LarekApi, товар добавляется в корзину. При клике на кнопку "Оформить" пользователю открывается модальное окно с помощью класса Form. Данные из формы Form отправляются в класс LarekApi. При успешном ответе валидации данных формы с помощью класса Api, заказ отправляется на сервер. В противном случае мы получим сообщение об ошибке. При положительном ответе от сервера, пользователю станет доступна страница успеха с подтверждением заказа и отображением цены списания.