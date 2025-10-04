import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const searchQuery = getParam("search");

const dataSource = new ProductData();
const element = document.querySelector(".product-list");
let listing;

if (searchQuery) {
    // If a search query is provided, use search mode
    listing = new ProductList(searchQuery, dataSource, element, true);
} else if (category) {
    // If category is provided, use category mode
    listing = new ProductList(category, dataSource, element, false);
} else {
    // fallback: load all products or default category
    listing = new ProductList("tents", dataSource, element, false);
}

listing.init();
