import { Component } from '../base/Component';

interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this.descriptionElement = container.querySelector('.order-success__description')!;
        this.closeButton = container.querySelector('.order-success__close')!;

        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}