import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IBasketData {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onSubmit: () => void }) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    if (actions?.onSubmit) {
      this.buttonElement.addEventListener("click", actions.onSubmit);
    }
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.listElement.replaceChildren(...items);
    } else {
      this.listElement.replaceChildren();
      this.listElement.textContent = "Корзина пуста";
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this.buttonElement.disabled = !value;
  }
}
