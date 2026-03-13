import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

interface ICardCatalogData {
    title: string;
    price: number | null;
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalogData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.categoryElement = container.querySelector('.card__category')!;
        this.imageElement = container.querySelector('.card__image')!;

        container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.id });
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.className = `card__category ${categoryClass}`;
    }

    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = this.title;
    }
}