export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'cash' | "";
export interface Product {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
export interface Buyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
export interface Order extends Buyer {
    total: number;
    items: string[];
}
export interface OrderResult {
    id: string;
    total: number;
}
export interface ApiResponseList<T> {
    total: number;
    items: T[];
}
export interface IProductListResponse {
    total: number;
    items: Product[];
}