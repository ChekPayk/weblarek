import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";

interface ICardPreviewData {
  title: string;
  price: number | null;
  category: string;
  image: string;
  description: string;
  inBasket: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.categoryElement = container.querySelector(".card__category")!;
    this.imageElement = container.querySelector(".card__image")!;
    this.descriptionElement = container.querySelector(".card__text")!;
    this.buttonElement = container.querySelector(".card__button")!;

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("card:action", { id: this.id });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const categoryClass =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this.categoryElement.className = `card__category ${categoryClass}`;
  }

  set image(value: string) {
    this.imageElement.src = value;
    this.imageElement.alt = this.title;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inBasket(value: boolean) {
    this.buttonElement.textContent = value ? "Удалить из корзины" : "Купить";

    if (this.price === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
    } else {
      this.buttonElement.disabled = false;
    }
  }
}
