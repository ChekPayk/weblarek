import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts.email:change", {
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts.phone:change", {
        value: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
