import { Component } from '../../components/base/component';
import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface ICardAction {
  onClick: (event: MouseEvent) => void;
}

export class Card<T> extends Component<ICard> {
  protected _image?: HTMLImageElement;
  protected _buttonModal?: HTMLButtonElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _description?: HTMLElement;
  protected _category?: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, action?: ICardAction) {
    super(container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._description = container.querySelector('.card__description');
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = ensureElement<HTMLImageElement>('.card__image',	container);
    this._button = container.querySelector('.card__button');
    this._category = ensureElement<HTMLElement>('.card__category', container);

    if (action?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", action.onClick);
      } else {
        container.addEventListener("click", action.onClick);
      }
    }
  }

  priceNull(value: number | null) {
    if (!value) {
      if(this._button) {
        this._button.disabled = true;
      }
    }
  }

  private categoryTeg: Record<string, string> = {
    "софт-скил": "_soft",
    "хард-скил": "_hard",
    кнопка: "_button",
    дополнительное: "_additional",
    другое: "_other"
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || "";
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || "";
  }

  set buttonTitle(value: string) {
    if(this._button) {
      this.setText(this._button, value);
    }
  }

  set image(value: string) {
    if ( this._image instanceof HTMLImageElement) {
      this._image.src = value;
      this._image.alt = this._title.textContent;
    }
  }

  set price(value: number | null) {
    this.setText(this._price, (value) ? `${value.toString()} синапсов` : 'Бесценно');
    this.priceNull(value);
    }

  get price(): number {
    return Number(this._price.textContent || '');
  }

  set category(value: string) {
    this.setText(this._category, value);
    const category = this._category.classList[0];
    this._category.className = '';
    this._category.classList.add(`${category}`);
    this._category.classList.add(`${category}${this.categoryTeg[value]}`)
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description.replaceWith(...value.map(str => {
        const descTemplate = this._description.cloneNode() as HTMLElement;
        this.setText(descTemplate, str);
        return descTemplate;
      }))
    } else {
      this.setText(this._description, value);
    }
  }
}

export interface IBasketItem {
  title: string;
  price: number;
}

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  set index(value: number) {
    this.setText(this._index, value)
  }

  set title(value: string) {
    this.setText(this._title, value)
  }

  set price(value: number) {
    this.setText(this._price, value);
  }

  constructor(container: HTMLElement, index: number, action?: ICardAction) {
    super(container);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this.setText(this._index, index + 1);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = container.querySelector('.card__button');
    if(action?.onClick) {
      if(this._button) {
        this._button.addEventListener('click', (action.onClick));
      }
    }
  }
}