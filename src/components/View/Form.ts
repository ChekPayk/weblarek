// Component (базовый класс для всего)
// ├── Form (базовый для ВСЕХ форм)
// │   ├── OrderForm (форма оплаты и адреса)
// │   └── ContactsForm (форма email и телефона)
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IFormData {
    valid: boolean;
    errors: string;
}

export class Form<T> extends Component<IFormData> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitButton = container.querySelector('button[type="submit"]')!;
        this.errorsElement = container.querySelector('.form__errors')!;

        container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            this.onInputChange(target.name, target.value);
        });

        container.addEventListener('submit', (e: SubmitEvent) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    protected onInputChange(name: string, value: string): void {
        this.events.emit(`${(this.container as HTMLFormElement).name}.${name}:change`, {
            field: name,
            value
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    render(data?: Partial<T>): HTMLElement {
        const form = super.render(data) as HTMLFormElement;
        form.reset();
        return form;
    }
}