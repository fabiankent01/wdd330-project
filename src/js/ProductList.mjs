import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images?.PrimaryMedium || ""}" alt="${product.Name}">
        <h3>${product.Brand?.Name || ""}</h3>
        <p>${product.NameWithoutBrand || product.Name}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(queryOrCategory, dataSource, listElement, isSearch = false) {
    this.queryOrCategory = queryOrCategory;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.isSearch = isSearch;
  }

  async init() {
    let list = [];
    if (this.isSearch) {
      // run search query
      list = await this.dataSource.searchProducts(this.queryOrCategory);
      document.querySelector(".title").textContent = `Results for "${this.queryOrCategory}"`;
    } else {
      // run category query
      list = await this.dataSource.getData(this.queryOrCategory);
      document.querySelector(".title").textContent = this.queryOrCategory;
    }

    this.renderList(list);
  }

  renderList(list) {
    if (!list || list.length === 0) {
      this.listElement.innerHTML = "<p>No products found.</p>";
      return;
    }
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
