import { Card } from './Card';
import { IEvents } from '../base/Events';

interface ICardBasketData {
    title: string;
    price: number | null;
    index: number;
}

export class CardBasket extends Card<ICardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.indexElement = container.querySelector('.basket__item-index')!;
        this.deleteButton = container.querySelector('.basket__item-delete')!;

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: this.id });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}