import { IApi, Product, Order, OrderResult, ApiResponseList  } from '../../types/index';

/**
 * Класс для коммуникации с сервером
 * Использует композицию - принимает объект, реализующий интерфейс IApi
 */
export class AppAPI {
    private _api: IApi;
    constructor(api: IApi) {
        this._api = api;
    }

    async getProductList(): Promise<Product[]> {
        const response = await this._api.get<ApiResponseList<Product>>('/product/');
        return response.items;
    }
    async postOrder(order: Order): Promise<OrderResult> {
        const response = await this._api.post<OrderResult>('/order/', order);
        return response;
    }
}