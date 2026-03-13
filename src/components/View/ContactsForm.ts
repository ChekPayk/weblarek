import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";

interface IContactsFormData {
  email: string;
  phone: string;
}

interface IContactsFormActions {
  onSubmit: (data: { email: string; phone: string }) => void;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions: IContactsFormActions) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      this.onInputChange("email", this.emailInput.value);
    });

    this.phoneInput.addEventListener("input", () => {
      this.onInputChange("phone", this.phoneInput.value);
    });

    container.addEventListener("submit", (e) => {
      e.preventDefault();
      actions.onSubmit({
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  protected onInputChange(name: string, value: string): void {
    // Для совместимости с родительским классом
  }
}
