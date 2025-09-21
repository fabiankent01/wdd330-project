import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./alert.js";

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

productList.init();

const alert = new Alert("./json/alerts.json");
alert.init();
