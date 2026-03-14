import "./scss/styles.scss";

// Модели
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

// Компоненты представления
import { Header } from "./components/View/Header";
import { Gallery } from "./components/View/Gallery";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { CardBasket } from "./components/View/CardBasket";
import { Basket } from "./components/View/Basket";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { Modal } from "./components/View/Modal";
import { Success } from "./components/View/SuccessForm";

// API и утилиты
import { AppAPI } from "./components/Models/AppAPI";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { API_URL, CDN_URL } from "./utils/constants";
import { Product, Order } from "./types/index";

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

// Брокер событий
const events = new EventEmitter();

// API
const baseApi = new Api(API_URL);
const api = new AppAPI(baseApi);

// Модели данных
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// Элементы DOM
const headerElement = ensureElement<HTMLElement>(".header");
const galleryElement = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// Компоненты представления (создаем однократно)
const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events, {
  onSubmit: () => events.emit("order:start"),
});
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
  onClick: () => modal.close(),
});

// Переменная для отслеживания текущей открытой формы
let currentForm: "order" | "contacts" | null = null;

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

// Каталог изменился - перерисовываем галерею
events.on("catalog:changed", () => {
  const items = catalogModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });

    return card.render({
      ...item,
      image: CDN_URL + item.image,
    });
  });

  gallery.render({ catalog: items });
});

// Корзина изменилась - обновляем счетчик и содержимое корзины
events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  // Обновляем содержимое корзины
  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onDelete: () => events.emit("basket:remove", item),
    });

    return card.render({
      ...item,
      index: index + 1,
    });
  });

  basket.render({
    items,
    total: basketModel.getTotal(),
    valid: basketModel.getCount() > 0,
  });
});

// Удаление товара из корзины
events.on("basket:remove", (item: Product) => {
  basketModel.removeItem(item);
});

// Выбрана карточка товара
events.on("card:select", (item: Product) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onAction: () => events.emit("card:action", item),
  });

  modal.render({
    content: card.render({
      ...item,
      image: CDN_URL + item.image,
      inBasket: basketModel.hasItem(item.id),
    }),
  });
});

// Действие с карточкой (купить/удалить)
events.on("card:action", (item: Product) => {
  if (basketModel.hasItem(item.id)) {
    basketModel.removeItem(item);
  } else if (item.price !== null) {
    basketModel.addItem(item);
  }
  modal.close();
});

// Открытие корзины
events.on("basket:open", () => {
  currentForm = null;
  modal.render({
    content: basket.render(),
  });
});

// Изменение полей формы заказа
events.on("order.payment:change", (data: { value: "online" | "cash" }) => {
  buyerModel.setPayment(data.value);
});

events.on("order.address:change", (data: { value: string }) => {
  buyerModel.setAddress(data.value);
});

// Изменение полей формы контактов
events.on("contacts.email:change", (data: { value: string }) => {
  buyerModel.setEmail(data.value);
});

events.on("contacts.phone:change", (data: { value: string }) => {
  buyerModel.setPhone(data.value);
});

// Валидация при изменении данных покупателя
events.on("buyer:changed", () => {
  const errors = buyerModel.validate();

  // Обновляем валидацию в зависимости от текущей открытой формы
  if (currentForm === "order") {
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = [errors.payment, errors.address]
      .filter(Boolean)
      .join(", ");
  }

  if (currentForm === "contacts") {
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = [errors.email, errors.phone]
      .filter(Boolean)
      .join(", ");
  }
});

// Начало оформления заказа (первый шаг)
events.on("order:start", () => {
  currentForm = "order";

  // Сбрасываем ошибки при открытии формы
  const errors = buyerModel.validate();
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(", ");

  modal.render({
    content: orderForm.render({
      payment: buyerModel.getData().payment || "",
      address: buyerModel.getData().address || "",
    }),
  });
});

// Переход к форме контактов (после успешной валидации первого шага)
events.on("order:submit", () => {
  currentForm = "contacts";

  // Сбрасываем ошибки при открытии формы
  const errors = buyerModel.validate();
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join(", ");

  modal.render({
    content: contactsForm.render({
      email: buyerModel.getData().email || "",
      phone: buyerModel.getData().phone || "",
    }),
  });
});

// Завершение заказа
events.on("contacts:submit", () => {
  const order: Order = {
    ...buyerModel.getData(),
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotal(),
  };

  api
    .postOrder(order)
    .then((result) => {
      basketModel.clear();
      buyerModel.clearData();

      currentForm = null;
      success.render({ total: result.total });
      modal.render({
        content: success.render(),
      });
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
    });
});

// Закрытие модального окна
events.on("modal:close", () => {
  currentForm = null;
  modal.close();
});

// ============================================
// ЗАГРУЗКА ДАННЫХ
// ============================================

api
  .getProductList()
  .then((data) => {
    catalogModel.setItems(data);
  })
  .catch((err) => console.error("Ошибка загрузки каталога:", err));
