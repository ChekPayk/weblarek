// Card (базовый для ВСЕХ карточек товара)
//     ├── CardCatalog (карточка в каталоге)
//     ├── CardPreview (карточка в модальном окне)
//     └── CardBasket (карточка в корзине)
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
interface ICardBaseData {
    title: string;
    price: number | null;
}

export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected _id: string = '';

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.titleElement = container.querySelector('.card__title')!;
        this.priceElement = container.querySelector('.card__price')!;
    }

    set id(value: string) {
        this._id = value;
        this.container.dataset.id = value;
    }

    get id(): string {
        return this._id;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
}