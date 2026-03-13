// Component (базовый класс для всего)
// ├── Form (базовый для ВСЕХ форм)
// │   ├── OrderForm (форма оплаты и адреса)
// │   └── ContactsForm (форма email и телефона)
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IFormData {
  valid: boolean;
  errors: string;
}

export class Form<T> extends Component<IFormData> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    container: HTMLFormElement,
    actions?: { onSubmit: (data: T) => void },
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.onInputChange(target.name, target.value);
    });

    container.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      actions?.onSubmit?.(this.getData());
    });
  }

  protected onInputChange(name: string, value: string): void {
    // Будет переопределено в наследниках
  }

  protected getData(): T {
    return {} as T; // Переопределяется в наследниках
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  render(data?: Partial<T>): HTMLElement {
    return super.render(data);
  }
}
