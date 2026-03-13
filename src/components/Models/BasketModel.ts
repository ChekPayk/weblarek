import { Product } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  private _items: Product[] = [];
  constructor(protected events: IEvents) {}

  getItems(): Product[] {
    return this._items;
  }

  addItem(item: Product): void {
    if (!this.hasItem(item.id)) {
      this._items.push(item);
      this.events.emit("basket:changed");
    }
  }

  removeItem(item: Product): void {
    this._items = this._items.filter((i) => i.id !== item.id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this._items = [];
    this.events.emit("basket:changed");
  }

  getTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
