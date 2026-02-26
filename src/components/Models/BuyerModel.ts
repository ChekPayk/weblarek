import { Buyer, TPayment, ValidationErrors } from "../../types";

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  setPayment(value: TPayment): void {
    this._payment = value;
  }

  setAddress(value: string): void {
    this._address = value;
  }

  setEmail(value: string): void {
    this._email = value;
  }

  setPhone(value: string): void {
    this._phone = value;
  }

  getData(): Buyer {
    return {
      payment: this._payment!,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clearData(): void {
    this._payment = null;
    this._address = "";
    this._email = "";
    this._phone = "";
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this._payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this._address.trim()) {
      errors.address = "Укажите адрес";
    }
    if (!this._email.trim()) {
      errors.email = "Укажите email";
    }
    if (!this._phone.trim()) {
      errors.phone = "Укажите телефон";
    }
    return errors;
  }
}
