import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected basketCounter: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        
        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }
}