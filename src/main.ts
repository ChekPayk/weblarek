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

// Компоненты представления
const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalContainer, events);

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

// Корзина изменилась - обновляем счетчик
events.on("basket:changed", () => {
  header.counter = basketModel.getCount();
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
  const basket = new Basket(cloneTemplate(basketTemplate), {
    onSubmit: () => events.emit("order:start"),
  });

  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onDelete: () => basketModel.removeItem(item),
    });

    return card.render({
      ...item,
      index: index + 1,
    });
  });

  modal.render({
    content: basket.render({
      items,
      total: basketModel.getTotal(),
      valid: basketModel.getCount() > 0,
    }),
  });
});

// Начало оформления заказа (первый шаг - способ оплаты и адрес)
events.on("order:start", () => {
  const orderForm = new OrderForm(cloneTemplate(orderTemplate), {
    onSubmit: (data: { payment: "online" | "cash"; address: string }) => {
      buyerModel.setPayment(data.payment);
      buyerModel.setAddress(data.address);
      events.emit("contacts:start");
    },
  });

  // Функция валидации формы заказа
  const validateOrderForm = () => {
    const payment = orderForm.getPayment();
    const address = orderForm.getAddress();

    const errors: string[] = [];

    const form = orderForm.render() as HTMLFormElement;
    const onlineBtn = form.querySelector('button[name="card"]');
    const cashBtn = form.querySelector('button[name="cash"]');

    const isPaymentSelected =
      onlineBtn?.classList.contains("button_alt-active") ||
      cashBtn?.classList.contains("button_alt-active");

    if (!isPaymentSelected) {
      errors.push("Выберите способ оплаты");
    }

    if (!address.trim()) {
      errors.push("Введите адрес доставки");
    }

    const isValid = errors.length === 0;
    orderForm.valid = isValid;
    orderForm.errors = errors.join(", ");
  };

  // Добавляем обработчики для валидации
  setTimeout(() => {
    const form = orderForm.render() as HTMLFormElement;
    const onlineBtn = form.querySelector('button[name="card"]');
    const cashBtn = form.querySelector('button[name="cash"]');
    const addressInput = form.querySelector('input[name="address"]');
    onlineBtn?.addEventListener("click", validateOrderForm);
    cashBtn?.addEventListener("click", validateOrderForm);
    addressInput?.addEventListener("input", validateOrderForm);

    // Первоначальная валидация
    validateOrderForm();
  }, 0);

  modal.render({
    content: orderForm.render({
      payment: "" as "online" | "cash" | "",
      address: "",
    }),
  });
});

// Форма контактов (второй шаг - email и телефон)
events.on("contacts:start", () => {
  const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), {
    onSubmit: (data: { email: string; phone: string }) => {
      buyerModel.setEmail(data.email);
      buyerModel.setPhone(data.phone);
      events.emit("order:complete");
    },
  });

  // Функция валидации формы контактов
  const validateContactsForm = () => {
    const email = contactsForm.getEmail();
    const phone = contactsForm.getPhone();

    const errors: string[] = [];

    if (!email.trim()) {
      errors.push("Введите email");
    } else if (!email.includes("@") || !email.includes(".")) {
      errors.push("Введите корректный email");
    }

    if (!phone.trim()) {
      errors.push("Введите телефон");
    } else if (phone.replace(/\D/g, "").length < 10) {
      errors.push("Введите корректный телефон");
    }

    const isValid = errors.length === 0;
    contactsForm.valid = isValid;
    contactsForm.errors = errors.join(", ");
  };

  // Добавляем обработчики для валидации
  setTimeout(() => {
    const form = contactsForm.render() as HTMLFormElement;
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');

    emailInput?.addEventListener("input", validateContactsForm);
    phoneInput?.addEventListener("input", validateContactsForm);

    // Первоначальная валидация
    validateContactsForm();
  }, 0);

  modal.render({
    content: contactsForm.render({
      email: "",
      phone: "",
    }),
  });
});

// Завершение заказа
events.on("order:complete", () => {
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

      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => modal.close(),
      });

      modal.render({
        content: success.render({ total: result.total }),
      });
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
    });
});

// Закрытие модального окна
events.on("modal:close", () => {
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
