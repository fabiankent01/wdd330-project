import { loadHeaderFooter, removeAllAlerts, alertMessage } from "./utils.mjs";

document
  .getElementById("checkout-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    
    removeAllAlerts();

    const form = e.target;
    
    // Check form validity
    const isValid = form.checkValidity();
    form.reportValidity();
    
    if (!isValid) {
      return; // Stop if form is invalid
    }

    // ... rest of submission code ...
  });