// src/components/View/OrderForm.ts
import { Form } from './Form';
import { TPayment } from '../../types';

interface IOrderFormData {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected onlineButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, actions?: { onPaymentChange: (payment: TPayment) => void }) {
        super(container);

        this.onlineButton = container.querySelector('button[name="card"]')!;
        this.cashButton = container.querySelector('button[name="cash"]')!;
        this.addressInput = container.querySelector('input[name="address"]')!;

        this.onlineButton.addEventListener('click', () => {
            this.selectPayment('online');
            actions?.onPaymentChange?.('online');
        });

        this.cashButton.addEventListener('click', () => {
            this.selectPayment('cash');
            actions?.onPaymentChange?.('cash');
        });
    }

    private selectPayment(payment: TPayment) {
        this.onlineButton.classList.toggle('button_alt-active', payment === 'online');
        this.cashButton.classList.toggle('button_alt-active', payment === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    protected onInputChange(name: string, value: string): void {
        if (name === 'address') {
            this.address = value;
        }
    }
}