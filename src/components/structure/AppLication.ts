import { IAppState, IProductCard, IOrder, FormError, IContactForm, PaymentMethods } from '../../types';
import { Model } from '../base/model';

export type CatalogChangeEvent = {
  catalog: IProductCard[];
}

//export class Product extends Model<IProductCard> //implements IProductCard 
//{
//  id: string;
 // description: string;
 // image: string;
 // title: string;
 // category: string;
 // price: number;
//}

export class AppLication extends Model<IAppState> {
  catalog: IProductCard[];
  basket: IProductCard[] = [];
  order: IOrder = {
    payment: "card",
    items: [],
    total: 0,
    email: "",
    phone: "",
    address: ""
  }
  preview: string | null;
  formErrors: FormError = {};

  updateBasket() {
    this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
  }

  clearBasket() {
    this.basket = [];
    this.updateBasket();
  }

  clearOrder() {
    this.order = {
      payment: "card",
      items: [],
      total: 0,
      email: "",
      phone: "",
      address: ""
    }
  }

  upCatalog(items: IProductCard[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: IProductCard) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  getReturnItems(): IProductCard[] {
		return this.basket;
	}

  getAccessOrder(item: IProductCard): boolean {
    return this.basket.includes(item);
  }

  addBasketArticle(item: IProductCard) {
    if(this.basket.indexOf(item) < 0) {
      this.basket.push(item)
      this.updateBasket();
    }
  }

  getTotal(){
    return  this.basket.reduce((summ, IProductItem)=> 
      summ+IProductItem.price,0);
}

  deleteBasketArticle(id: string) {
    this.basket = this.basket.filter((it) => it.id != id)
    this.emitChanges('basket:changed');
  }

  getBasketPrice(): number {
    return this.order.items.reduce((total, item) => total + this.catalog.find(it => it.id === item).price, 0)
  }

  setPaymentWay(method: string) {
    this.order.payment = method as PaymentMethods;
    this.validateDelivery();
  }

  setDeliveryAdress(value: string) {
    this.order.address = value;
    this.validateDelivery();
  };

  setContactOrder(field: keyof IContactForm, value: string) {
    this.order[field] = value;
    this.validateContact();
  }

  validateDelivery() {
    const errors: typeof this.formErrors = {};
    if(!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты'
		}
    if(!this.order.address) {
      errors.address = 'Необходимо указать адрес'
    }
    this.formErrors = errors;
    this.events.emit('deliveryFormError:change', this.formErrors)
    return Object.keys(errors).length === 0
  }

  validateContact() {
    const errors: typeof this.formErrors = {};
    if(!this.order.email) {
      errors.email = 'Необходимо указать email'
    }
    if(!this.order.phone) {
      errors.phone = 'Необходимо указать телефон'
    }
    this.formErrors = errors;
    this.events.emit('contactFormError:change', this.formErrors)
    return Object.keys(errors).length === 0
  }
}