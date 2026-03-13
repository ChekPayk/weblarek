// src/components/View/Card.ts
import { Component } from '../base/Component';
import { Product } from '../../types';
import { categoryMap } from '../../utils/constants';

interface ICardData extends Product {
    inBasket?: boolean;
}

export class Card extends Component<ICardData> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected descriptionElement?: HTMLElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this.titleElement = container.querySelector('.card__title')!;
        this.priceElement = container.querySelector('.card__price')!;
        this.categoryElement = container.querySelector('.card__category') ?? undefined;
        this.imageElement = container.querySelector('.card__image') ?? undefined;
        this.descriptionElement = container.querySelector('.card__text') ?? undefined;
        this.buttonElement = container.querySelector('.card__button') ?? undefined;

        if (actions?.onClick) {
            if (this.buttonElement) {
                this.buttonElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    actions.onClick?.();
                });
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
            if (this.buttonElement) {
                this.buttonElement.disabled = true;
                this.buttonElement.textContent = 'Недоступно';
            }
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this.categoryElement.className = `card__category ${categoryClass}`;
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
            this.imageElement.alt = this.title || 'товар';
        }
    }

    set description(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
    }

    set inBasket(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
        }
    }
}