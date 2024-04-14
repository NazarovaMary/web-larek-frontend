import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import  { Modal } from './components/modal/Modal';

import { AppLication, CatalogChangeEvent } from './components/structure/AppLication';
import { Basket } from './components/structure/Basket';
import { BasketItem, Card } from './components/structure/ProductCard';
import { Contacts } from './components/structure/ContactForm';
import { LarekAPI } from './components/LarekApi';
import { Order } from './components/structure/Order';
import { Page } from './components/structure/Page';
import { Success } from './components/structure/Success';

import { IContactForm, IOrderContactForm, IProductCard } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const appLication = new AppLication({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new Order(cloneTemplate(deliveryTemplate), events)
const contact = new Contacts(cloneTemplate(contactTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appLication.catalog.map(item => {
    const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category
    })
  })
  page.counter = appLication.getReturnItems().length
});

events.on('card:select', (item: IProductCard) => {
  appLication.setPreview(item);
});

events.on('preview:changed', (item: IProductCard) => {
  if(item) {
    api
      .getProduct(item.id)
      .then((res: IProductCard) => {
        item.id = res.id;
        item.category = res.category;
        item.title = res.title;
        item.description = res.description;
        item.image = res.image;
        item.price = res.price;
        const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
          onClick: () => {
            if(appLication.getAccessOrder(item)) {
              appLication.deleteBasketArticle(item.id);
              modal.close();
            } else {
              events.emit('product:add', item);
            }
          }
        });
        const buttonTitle: string = appLication.getAccessOrder(item) ? 'Убрать из корзины' : 'Купить';
        card.buttonTitle = buttonTitle;
        console.log('Button title:', buttonTitle);
        modal.render({
          content: card.render({
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            category: item.category,
            button: buttonTitle,
          })
        });
      });
    }
});

events.on('basket:open', () => {
  modal.render({
    content: basket.render({})
  })
});

events.on('basket:changed', () => {
  page.counter = appLication.getReturnItems().length
  let total = 0
  basket.items = appLication.getReturnItems().map((item, index) => {
    const card = new BasketItem(cloneTemplate(cardBasketTemplate), index, {
        onClick: () => {
          appLication.deleteBasketArticle(item.id)
          basket.total = appLication.getBasketPrice();
          basket.total = appLication.getTotal()
        },
    });
    total = total + item.price;
    return card.render({
      title: item.title,
      price: item.price,
    })
  })
  basket.total = total; 
  appLication.order.total = total;
});

events.on('counter:changed', () => {
  page.counter = appLication.getReturnItems().length
});

events.on('product:add', (item: IProductCard) => {
  appLication.addBasketArticle(item);
  modal.close();
});

events.on('product:delete', (item: IProductCard) => {
  appLication.deleteBasketArticle(item.id)
});

events.on('order:open', () => {
  appLication.setPaymentWay('');
  delivery.setToggleClass('');
  modal.render({
    content: delivery.render({
      payment: '',
      address: '',
      valid: false,
      errors: [],
    })
  })
  appLication.order.items = appLication.basket.map((item) => item.id);
});

events.on('order.payment:change', (data: { target: string }) => {
	appLication.setPaymentWay(data.target);
});

events.on('order.address:change', (data: { value: string }) => {
	appLication.setDeliveryAdress(data.value);
});

events.on('deliveryFormError:change', (errors: Partial<IOrderContactForm>) => {
  const { payment, address } = errors;
  delivery.valid = !payment && !address
  delivery.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

events.on('order:submit', () => {
  modal.render({
    content: contact.render({
      phone: '',
      email: '',
      valid: false,
      errors: [],
    })
  })
});

events.on(/^contacts\..*:change/, (data: {field: keyof IContactForm, value: string}) => {
  appLication.setContactOrder(data.field, data.value)
});

events.on('contactFormError:change', (errors: Partial<IContactForm>) => {
  const { email, phone } = errors
  contact.valid = !email && !phone
  contact.errors = Object.values({ phone, email }).filter(i => !!i).join('; ')
});

events.on('contacts:submit', () => {
  api.orderProduct(appLication.order)
    .then((result) => {
      appLication.clearBasket() 
      appLication.clearOrder() 
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close()
        }
      })
      modal.render({
        content: success.render({
          total: result.total,
        })
      })
    })
    .catch(err => {
      console.error(err);
    });
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false; 
});

api.getProductList()
    .then(appLication.upCatalog.bind(appLication))
    .catch(err => {
      console.log(err);
    });