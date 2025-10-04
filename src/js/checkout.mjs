import { getLocalStorage, setLocalStorage } from "./utils.mjs";
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
    // Calculate total and item count
    const itemCount = this.list.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);

    this.itemTotal = this.list.reduce((total, item) => {
      const price = item.FinalPrice || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);

    // Display subtotal
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    if (subtotalElement) {
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    // Display item count
    const itemCountElement = document.querySelector(
      `${this.outputSelector} #item-count`
    );
    if (itemCountElement) {
      itemCountElement.innerText = itemCount;
    }
  }

  calculateOrderTotal() {
    // Calculate tax (6% of subtotal)
    this.tax = this.itemTotal * 0.06;

    // Calculate shipping ($10 for first item + $2 for each additional)
    const itemCount = this.list.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    // Calculate order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // Display the totals
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // Display tax
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    if (taxElement) {
      taxElement.innerText = `$${this.tax.toFixed(2)}`;
    }

    // Display shipping
    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    if (shippingElement) {
      shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    }

    // Display order total
    const orderTotalElement = document.querySelector(
      `${this.outputSelector} #order-total`
    );
    if (orderTotalElement) {
      orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  async checkout(form) {
    try {
      // Convert form data to JSON
      const formData = formDataToJSON(form);

      // Create order object with required format
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

      // Send order to server
      const services = new ExternalServices();
      const response = await services.checkout(order);

      console.log("Order submitted successfully:", response);
      
      // Clear cart after successful checkout
      setLocalStorage(this.key, []);
      
      return response;
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  }
}