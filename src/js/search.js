import { renderListWithTemplate } from "./utils.mjs";
import ProductListing from "./ProductList.mjs";

document.getElementById("search-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = document.getElementById("search-input").value.trim();
        if (!query) return;

        // Navigate to product list page with search param
        window.location.href = `/product-list.html?search=${encodeURIComponent(query)}`;
    });
