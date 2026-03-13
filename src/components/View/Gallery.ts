// src/components/View/Gallery.ts
import { Component } from '../base/Component';

interface IGalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    protected galleryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = container;
    }

    set catalog(items: HTMLElement[]) {
        this.galleryElement.replaceChildren(...items);
    }
}