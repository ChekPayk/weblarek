// src/components/View/ContactsForm.ts
import { Form } from './Form';

interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this.emailInput = container.querySelector('input[name="email"]')!;
        this.phoneInput = container.querySelector('input[name="phone"]')!;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    protected onInputChange(name: string, value: string): void {
        if (name === 'email') {
            this.email = value;
        } else if (name === 'phone') {
            this.phone = value;
        }
    }
}