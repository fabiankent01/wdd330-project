import ProductData from "./ProductData.mjs";

// Utility functions
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function getImage(product) {
  if (product.Images && product.Images.PrimaryLarge) return product.Images.PrimaryLarge;
  if (product.Images && product.Images.PrimaryMedium) return product.Images.PrimaryMedium;
  if (product.Image) return product.Image;
  return "";
}

// Render product detail
function renderProductDetail(product) {
  const main = document.querySelector("main.divider");
  if (!main) return;

  main.innerHTML = "";

  if (!product) {
    main.innerHTML = '<section class="product-detail"><h2>Product not found</h2></section>';
    return;
  }

  const image = getImage(product);
  const brand = (product.Brand && product.Brand.Name) || product.Brand || "";
  const name = product.NameWithoutBrand || product.Name || "";
  const price = product.FinalPrice || product.ListPrice || product.SuggestedRetailPrice || 0;
  const oldPrice = product.SuggestedRetailPrice || product.ListPrice || 0;
  const color = (product.Colors && product.Colors[0] && product.Colors[0].ColorName) || "";

  let discountHTML = "";
  let priceHTML = `<span class='new-price'>${formatPrice(price)}</span>`;
  if (oldPrice > price) {
    const percent = Math.round(((oldPrice - price) / oldPrice) * 100);
    discountHTML = `<span class='discount-indicator'>-${percent}% OFF</span>`;
    priceHTML = `<span class='old-price'>${formatPrice(oldPrice)}</span> <span class='new-price'>${formatPrice(price)}</span>`;
  }

  main.innerHTML = `
    <section class="product-detail">
      <h3>${brand}</h3>
      <h2 class="divider">${name}</h2>
      <img class="divider" src="${image}" alt="${name}" />
      <p class="product-card__price">${discountHTML} ${priceHTML}</p>
      <p class="product__color">${color}</p>
      <p class="product__description">${product.DescriptionHtmlSimple || ""}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    </section>
  `;

  // Add to cart functionality
  document.getElementById("addToCart").addEventListener("click", (e) => {
    const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart.push(product);
    localStorage.setItem("so-cart", JSON.stringify(cart));

    const messageDiv = document.createElement("div");
    messageDiv.textContent = "Successfully added to cart!";
    messageDiv.style.color = "green";
    messageDiv.style.marginTop = "10px";
    e.target.parentElement.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);

    const sup = document.getElementById("cart-count");
    if (sup) sup.textContent = cart.length;

    const cartLink = document.querySelector(".cart-link");
    if (cartLink) cartLink.classList.toggle("saved");
  });
}

// Load product detail from API
async function loadProductDetail() {
  const id = getQueryParam("id");
  if (!id) return;

  const dataSource = new ProductData();
  try {
    const product = await dataSource.findProductById(id);
    renderProductDetail(product);
  } catch (err) {
    console.error("Error loading product:", err);
    const main = document.querySelector("main.divider");
    if (main) main.innerHTML = '<p>There was an error loading the product.</p>';
  }
}

// Initialize when DOM is ready
if (document.querySelector("main.divider")) {
  loadProductDetail();
}
