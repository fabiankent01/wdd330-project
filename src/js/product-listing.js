import ProductData from "./ProductData.mjs";

// Utility functions
export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

export function createDiscountBadge(percent) {
  const badge = document.createElement("span");
  badge.className = "discount-indicator";
  badge.textContent = `-${percent}% OFF`;
  return badge;
}

// Determine category from URL
function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") || "tents";
}

function getCategoryTitle(category) {
  switch (category) {
    case "tents":
      return "Tents";
    case "backpacks":
      return "Backpacks";
    case "sleeping-bags":
      return "Sleeping Bags";
    case "hammocks":
      return "Hammocks";
    default:
      return "Products";
  }
}

// Choose correct image for listing
function getImage(product) {
  if (product.Images && product.Images.PrimaryMedium) return product.Images.PrimaryMedium;
  if (product.Images && product.Images.PrimaryLarge) return product.Images.PrimaryLarge;
  if (product.Image) return product.Image;
  return "";
}

// Render products dynamically
function renderProductList(products, category) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach((product) => {
    const image = getImage(product);
    const brand = (product.Brand && product.Brand.Name) || product.Brand || "";
    const name = product.NameWithoutBrand || product.Name || "";
    const price = product.FinalPrice || product.ListPrice || product.SuggestedRetailPrice || 0;
    const oldPrice = product.SuggestedRetailPrice || product.ListPrice || 0;

    let discountHTML = "";
    let priceHTML = `<span class='new-price'>${formatPrice(price)}</span>`;

    if (oldPrice > price) {
      const percent = Math.round(((oldPrice - price) / oldPrice) * 100);
      discountHTML = `<span class="discount">-${percent}% OFF</span>`;
      priceHTML = `<span class='old-price'>${formatPrice(oldPrice)}</span> <span class='new-price'>${formatPrice(price)}</span>`;
    }

    const id = product.Id;
    const li = document.createElement("li");
    li.className = "product-card";
    li.innerHTML = `
      ${discountHTML}
      <a href="../product_pages/index.html?id=${id}&category=${category}">
        <img src="${image}" alt="${name}" />
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">${priceHTML}</p>
      </a>
    `;
    list.appendChild(li);
  });
}

// Load products from API
async function loadProductsForCategory() {
  const category = getCategoryFromUrl();
  document.getElementById("category-title").textContent = getCategoryTitle(category);

  const dataSource = new ProductData();
  const products = await dataSource.getData(category);

  renderProductList(products, category);
}

// Initialize
if (document.getElementById("product-list")) {
  loadProductsForCategory();
}
