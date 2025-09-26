import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import { addToCart } from "./cart.js";

// Grab the product id from the URL (?id=...)
const productId = getParam("id"); // changed from "product" to "id" to match product-listing links

// Create an instance of ProductData (no category needed for single product fetch)
const dataSource = new ProductData();

// Function to render product details
function renderProductDetails(product) {
  const container = document.querySelector("#product-details");

  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  // Get main image
  const imageUrl =
    (product.Images && product.Images.PrimaryLarge) ||
    (product.Images && product.Images.PrimaryMedium) ||
    product.Image ||
    "";

  // Determine price display
  const price = product.FinalPrice || product.ListPrice || product.SuggestedRetailPrice || 0;
  const oldPrice = product.SuggestedRetailPrice || product.ListPrice || 0;
  let priceHTML = `<span class="new-price">$${price.toFixed(2)}</span>`;
  if (oldPrice > price) {
    const percent = Math.round(((oldPrice - price) / oldPrice) * 100);
    priceHTML = `<span class="old-price">$${oldPrice.toFixed(2)}</span> <span class="new-price">$${price.toFixed(2)}</span> <span class="discount">-${percent}% OFF</span>`;
  }

  container.innerHTML = `
    <div class="product-detail-card">
      <img src="${imageUrl}" alt="${product.Name}" class="product-detail-image" />
      <h2>${product.Name}</h2>
      <p class="product-description">${product.Description || "No description available."}</p>
      <p class="product-price"><strong>Price:</strong> ${priceHTML}</p>
      <button id="addToCart">Add to Cart</button>
    </div>
  `;

  document.querySelector("#addToCart").addEventListener("click", () => {
    addToCart(productId);
  });
}

// Initialize
async function init() {
  try {
    const product = await dataSource.findProductById(productId);
    renderProductDetails(product);
  } catch (err) {
    console.error("Error loading product:", err);
    document.querySelector("#product-details").innerHTML =
      "<p>There was an error loading the product.</p>";
  }
}

document.addEventListener("DOMContentLoaded", init);
