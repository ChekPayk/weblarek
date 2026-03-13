import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IGalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    protected galleryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = ensureElement<HTMLElement>('.gallery', this.container);
    }

    set catalog(items: HTMLElement[]) {
        this.galleryElement.replaceChildren(...items);
    }
}