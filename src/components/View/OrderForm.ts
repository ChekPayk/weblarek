import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IOrderFormData {
  payment: "online" | "cash" | "";
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

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
      this.events.emit("order.payment:change", { value: "online" });
    });

    this.cashButton.addEventListener("click", () => {
      this.selectPayment("cash");
      this.events.emit("order.payment:change", { value: "cash" });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order.address:change", {
        value: this.addressInput.value,
      });
    });
  }

  private selectPayment(payment: "online" | "cash"): void {
    this.onlineButton.classList.toggle(
      "button_alt-active",
      payment === "online",
    );
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
