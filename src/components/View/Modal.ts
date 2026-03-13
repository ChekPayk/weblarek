// src/components/View/Modal.ts
import { Component } from '../base/Component';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClose: () => void }) {
        super(container);

        this.closeButton = container.querySelector('.modal__close')!;
        this.contentElement = container.querySelector('.modal__content')!;

        this.closeButton.addEventListener('click', () => {
            this.close();
            actions?.onClose?.();
        });

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.close();
                actions?.onClose?.();
            }
        });

        this.contentElement.addEventListener('click', (e) => e.stopPropagation());
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = document.createElement('div');
    }
}