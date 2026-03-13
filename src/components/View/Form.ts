// src/components/View/Form.ts
import { Component } from '../base/Component';

interface IFormData {
    valid: boolean;
    errors: string;
}

export class Form<T> extends Component<IFormData> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this.submitButton = container.querySelector('button[type="submit"]')!;
        this.errorsElement = container.querySelector('.form__errors')!;

        container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            this.onInputChange(target.name, target.value);
        });
    }

    protected onInputChange(name: string, value: string) {
        // Будет переопределен в наследниках
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