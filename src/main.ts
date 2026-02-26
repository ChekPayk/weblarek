import "./scss/styles.scss";

import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { apiProducts } from "./utils/data";
import { AppAPI } from "./components/Models/AppAPI";
import { Api } from "./components/base/Api";
import { Product } from "./types/index";

const catalog = new CatalogModel();
console.log("1. Создан пустой каталог");

catalog.setItems(apiProducts.items);
console.log("2. Данные сохранены в каталог");
console.log("3. Все товары в каталоге:", catalog.getItems());

const firstProductId = apiProducts.items[0].id;
const product = catalog.getItem(firstProductId);
console.log(`4. Товар с id ${firstProductId}:`, product);

catalog.setPreview(apiProducts.items[1]);
console.log("5. Товар для предпросмотра:", catalog.getPreview());

const nonExistentProduct = catalog.getItem("non-existent-id");
console.log("6. Поиск несуществующего товара:", nonExistentProduct);

// Корзина
const basket = new BasketModel();
console.log("1. Создана пустая корзина");
console.log("   Товаров в корзине:", basket.getCount());

const product1 = apiProducts.items[0]; // +1 час в сутках (750)
const product2 = apiProducts.items[1]; // HEX-леденец (1450)
const product3 = apiProducts.items[2]; // Мамка-таймер (price: null)

console.log("\n2. Добавляем товары:");
basket.addItem(product1);
console.log("   Добавлен:", product1.title);
console.log("   Товаров в корзине:", basket.getCount());

basket.addItem(product2);
console.log("   Добавлен:", product2.title);
console.log("   Товаров в корзине:", basket.getCount());

basket.addItem(product3);
console.log("   Попытка добавить товар с price null:", product3.title);
console.log("   Товаров в корзине:", basket.getCount()); // Не должен добавиться

console.log("\n3. Проверка наличия товаров:");
console.log(`   ${product1.title} в корзине:`, basket.hasItem(product1.id));
console.log(`   ${product3.title} в корзине:`, basket.hasItem(product3.id));

console.log("\n4. Все товары в корзине:", basket.getItems());

console.log("\n5. Удаляем товар:", product1.title);
basket.removeItem(product1);
console.log("   Товаров в корзине:", basket.getCount());

// Очищаем корзину
console.log("\n6. Очищаем корзину");
basket.clear();
console.log("   Товаров в корзине:", basket.getCount());

// Покупатель
const buyer = new BuyerModel();
console.log("1. Создана модель покупателя");

console.log("\n2. Валидация пустых данных:");
console.log("   Ошибки:", buyer.validate());

console.log("\n3. Заполняем данные по частям:");
buyer.setPayment("online");
console.log("   Установлен способ оплаты: online");
console.log("   Текущие ошибки:", buyer.validate());

buyer.setAddress("г. Санкт-Петербург, ул. Восстания, д. 1");
console.log("   Установлен адрес");
console.log("   Текущие ошибки:", buyer.validate());

buyer.setEmail("test@example.com");
console.log("   Установлен email");
console.log("   Текущие ошибки:", buyer.validate());

buyer.setPhone("+71234567890");
console.log("   Установлен телефон");
console.log("   Текущие ошибки:", buyer.validate());

console.log("\n4. Все данные покупателя:", buyer.getData());
console.log("\n6. Очищаем данные покупателя");
buyer.clearData();
console.log("   После очистки:", buyer.getData());
console.log("   Валидация после очистки:", buyer.validate());

// Тестирование API
const baseApi = new Api("http://localhost:3000/api/weblarek");
const appApi = new AppAPI(baseApi);

console.log("Выполняем запрос к серверу...");
appApi
  .getProductList()
  .then((products: Product[]) => {
    console.log("Данные получены от сервера");

    catalog.setItems(products);
    console.log("Каталог товаров (с сервера):", catalog.getItems());
    console.log("Количество товаров:", catalog.getItems().length);
    console.log("Первый товар:", catalog.getItems()[0]);
  })
  .catch((error: Error) => {
    console.error("Ошибка при запросе к серверу:", error.message);
  });
