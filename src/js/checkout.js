// js/checkout.js
import { loadHeaderFooter, getLocalStorage, setLocalStorage } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Optional: Load cart data for checkout summary
const cartItems = getLocalStorage("so-cart") || [];
const cartList = document.querySelector(".checkout-list"); // make sure your HTML has this

if (cartList && cartItems.length > 0) {
    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - qty: ${item.quantity} - $${item.price}`;
        cartList.appendChild(li);
    });
} else if (cartList) {
    cartList.innerHTML = "<li>Your cart is empty.</li>";
}
