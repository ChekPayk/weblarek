import { Form } from './Form';
import { IEvents } from '../base/Events';

interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailInput = container.querySelector('input[name="email"]')!;
        this.phoneInput = container.querySelector('input[name="phone"]')!;

        this.emailInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('contacts:email-change', { email: target.value });
        });

        this.phoneInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('contacts:phone-change', { phone: target.value });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}