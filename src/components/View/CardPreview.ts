import { Card } from "./Card";
import { Product } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

interface ICardPreviewData {
  title: string;
  price: number | null;
  category: string;
  image: string;
  description: string;
  inBasket: boolean;
}

type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = Pick<
  Product,
  "category" | "image" | "description"
> & {
  inBasket?: boolean;
};

export class CardPreview extends Card<TCardPreview> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onAction: () => void }) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (actions?.onAction) {
      this.buttonElement.addEventListener("click", (e) => {
        e.stopPropagation();
        actions.onAction?.();
      });
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inBasket(value: boolean) {
    this.buttonElement.textContent = value ? "Удалить из корзины" : "Купить";

    if (this.price === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
    }
  }

  set price(value: number | null) {
    super.price = value;

    if (value === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
    } else {
      this.buttonElement.disabled = false;
    }
  }
}
