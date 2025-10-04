import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Convert form data to JSON object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  
  return convertedJSON;
}

// Package items for checkout
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const itemCount = this.list.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);

    this.itemTotal = this.list.reduce((total, item) => {
      const price = item.FinalPrice || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);

    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    if (subtotalElement) {
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    const itemCountElement = document.querySelector(
      `${this.outputSelector} #item-count`
    );
    if (itemCountElement) {
      itemCountElement.innerText = itemCount;
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const itemCount = this.list.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    if (taxElement) {
      taxElement.innerText = `$${this.tax.toFixed(2)}`;
    }

    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    if (shippingElement) {
      shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    }

    const orderTotalElement = document.querySelector(
      `${this.outputSelector} #order-total`
    );
    if (orderTotalElement) {
      orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    try {
      const formData = formDataToJSON(form);

      const order = {
        orderDate: new Date().toISOString(),
        fname: formData.fname,
        lname: formData.lname,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        cardNumber: formData.cardNumber,
        expiration: formData.expiration,
        code: formData.code,
        items: packageItems(this.list),
        orderTotal: this.orderTotal.toFixed(2),
        shipping: this.shipping,
        tax: this.tax.toFixed(2),
      };

      const services = new ExternalServices();
      const response = await services.checkout(order);

      console.log("Order submitted successfully:", response);
      
      setLocalStorage(this.key, []);
      
      return response;
    } catch (error) {
      console.error("Checkout error:", error);
      
      if (error.name === "servicesError" && error.message) {
        let errorMessages = "";
        
        if (typeof error.message === "object") {
          if (Array.isArray(error.message)) {
            errorMessages = error.message.join("<br>");
          } else if (error.message.message) {
            errorMessages = error.message.message;
          } else {
            errorMessages = JSON.stringify(error.message);
          }
        } else {
          errorMessages = error.message;
        }
        
        alertMessage(errorMessages, true, 0);
      } else {
        alertMessage("There was an error processing your order. Please try again.", true, 0);
      }
      
      throw error;
    }
  }
}