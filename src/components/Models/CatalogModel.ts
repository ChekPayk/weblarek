import { Product } from "../../types";
import { IEvents } from "../base/Events";
export class CatalogModel {
  private _items: Product[] = [];
  private _preview: Product | null = null;
  constructor(protected events: IEvents) {}

  setItems(items: Product[]): void {
    this._items = items;
    this.events.emit("catalog:changed");
  }

  getItems(): Product[] {
    return this._items;
  }

  getItem(id: string): Product | undefined {
    return this._items.find((item) => item.id === id);
  }

  setPreview(item: Product): void {
    this._preview = item;
    this.events.emit("preview:changed", item);
  }

  getPreview(): Product | null {
    return this._preview;
  }
}
