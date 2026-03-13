import { Form } from './Form';
import { TPayment } from '../../types';
import { IEvents } from '../base/Events';


interface IOrderFormData {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected onlineButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.onlineButton = container.querySelector('button[name="card"]')!;
        this.cashButton = container.querySelector('button[name="cash"]')!;
        this.addressInput = container.querySelector('input[name="address"]')!;

        this.onlineButton.addEventListener('click', () => {
            this.selectPayment('online');
            this.events.emit('order:payment-change', { payment: 'online' });
        });

        this.cashButton.addEventListener('click', () => {
            this.selectPayment('cash');
            this.events.emit('order:payment-change', { payment: 'cash' });
        });

        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('order:address-change', { address: target.value });
        });
    }

    private selectPayment(payment: TPayment): void {
        this.onlineButton.classList.toggle('button_alt-active', payment === 'online');
        this.cashButton.classList.toggle('button_alt-active', payment === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}