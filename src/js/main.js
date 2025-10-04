// js/main.js
import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
//import { updateProductCards } from "./product-listing.js";
// import { renderDiscounts } from "./discounts.js"; // optional module for homepage discounts

//  Load header and footer dynamically
// Includes a callback to update cart count
async function initHeaderFooter() {
  // This will populate <div id="header"></div> and <div id="footer"></div>
  await loadHeaderFooter();
}

//  Render homepage products
function initProducts() {
  if (typeof updateProductCards === "function") {
    updateProductCards(); // dynamically render product cards
  }
}

//  Render homepage discounts (optional)
function initDiscounts() {
  if (typeof renderDiscounts === "function") {
    renderDiscounts(); // dynamically render discounts
  }
}

// Initialize the page
async function init() {
  await initHeaderFooter();
  initProducts();
  initDiscounts();
}

// Run initialization after DOM content loaded
document.addEventListener("DOMContentLoaded", init);
