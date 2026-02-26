import { Product } from "../../types";

export class BasketModel {
  private _items: Product[] = [];

  getItems(): Product[] {
    return this._items;
  }

  addItem(item: Product): void {
    if (!this.hasItem(item.id)) {
      this._items.push(item);
    }
  }

  removeItem(item: Product): void {
    this._items = this._items.filter((i) => i.id !== item.id);
  }

  clear(): void {
    this._items = [];
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
