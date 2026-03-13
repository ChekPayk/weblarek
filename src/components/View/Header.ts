// src/components/View/Header.ts
import { Component } from '../base/Component';

interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected basketCounter: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.basketCounter = container.querySelector('.header__basket-counter')!;
        this.basketButton = container.querySelector('.header__basket')!;
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }
}