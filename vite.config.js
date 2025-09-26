import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/wdd330-project/", // required for GitHub Pages
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        product_listing: resolve(__dirname, "src/product_listing/index.html"), // new page
      },
    },
  },
});
