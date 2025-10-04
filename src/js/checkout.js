import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer
loadHeaderFooter();

// Initialize checkout process
const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

// Add event listener for zip code to calculate totals
document.getElementById("zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

// Handle form submission
document
  .getElementById("checkout-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");

    // Hide previous messages
    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    try {
      // Submit the order
      const response = await checkout.checkout(form);

      // Show success message
      successMessage.textContent =
        "Order placed successfully! Order ID: " + (response.orderId || "N/A");
      successMessage.style.display = "block";

      // Reset form
      form.reset();

      // Redirect to confirmation page after 2 seconds (you can create this page)
      setTimeout(() => {
        window.location.href = "/cart/index.html";
      }, 2000);
    } catch (error) {
      // Show error message
      errorMessage.textContent =
        "There was an error processing your order. Please try again. " +
        error.message;
      errorMessage.style.display = "block";

      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = "Place Order";
    }
  });

// Update cart count in header
setTimeout(() => {
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  const sup = document.getElementById("cart-count");
  if (sup) {
    sup.textContent = cart.length;
  }
}, 500);