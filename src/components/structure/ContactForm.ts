import { Form } from '../modal/Form';
import { IContactForm } from '../../types';
import { IEvents } from '../../components/base/events';

export class Contacts extends Form<IContactForm> {
  protected _phoneInput: HTMLInputElement;
  protected _emailInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
    this._emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  };

  set email(value: string) {
    this._emailInput.value = value;
  };
  
}