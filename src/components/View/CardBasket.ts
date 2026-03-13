import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

interface ICardBasketData {
    title: string;
    price: number | null;
    index: number;
}

export type TCardBasket = {
    index: number;
};

export class CardBasket extends Card<TCardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onDelete: () => void }) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this.deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                actions.onDelete?.();
            });
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}