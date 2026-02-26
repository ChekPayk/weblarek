import { Product } from "../../types";

export class CatalogModel {
  private _items: Product[] = [];
  private _preview: Product | null = null;

  setItems(items: Product[]): void {
    this._items = items;
  }

  getItems(): Product[] {
    return this._items;
  }

  getItem(id: string): Product | undefined {
    return this._items.find((item) => item.id === id);
  }

  setPreview(item: Product): void {
    this._preview = item;
  }

  getPreview(): Product | null {
    return this._preview;
  }
}
