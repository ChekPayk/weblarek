import { Form } from "./Form";
import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";

interface IOrderFormData {
  payment: TPayment;
  address: string;
}

interface IOrderFormActions {
  onSubmit: (data: { payment: TPayment; address: string }) => void;
}

export class OrderForm extends Form<IOrderFormData> {
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions: IOrderFormActions) {
    super(container);

    this.onlineButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.onlineButton.addEventListener("click", () => {
      this.selectPayment("online");
    });

    this.cashButton.addEventListener("click", () => {
      this.selectPayment("cash");
    });

    this.addressInput.addEventListener("input", () => {
      this.onInputChange("address", this.addressInput.value);
    });

    container.addEventListener("submit", (e) => {
      e.preventDefault();
      actions.onSubmit({
        payment: this.getPayment(),
        address: this.addressInput.value,
      });
    });
  }

  private selectPayment(payment: TPayment): void {
    this.onlineButton.classList.toggle(
      "button_alt-active",
      payment === "online",
    );
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
    this.onInputChange("payment", payment);
  }

  private getPayment(): TPayment {
    if (this.onlineButton.classList.contains("button_alt-active"))
      return "online";
    if (this.cashButton.classList.contains("button_alt-active")) return "cash";
    return "";
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  protected onInputChange(name: string, value: string): void {
    // Для совместимости с родительским классом
  }
}
