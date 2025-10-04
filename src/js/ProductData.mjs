// Utility function to convert a fetch response to JSON
async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status}`);
  }
}

// Base URL from Vite environment variable
const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  // Fetch data for a given category
  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result || [];
    } catch (err) {
      console.error("Error loading product data:", err);
      return [];
    }
  }

  // Fetch a single product by ID
  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result || data;
    } catch (err) {
      console.error(`Error fetching product with ID ${id}:`, err);
      return null;
    }
  }

  // Fetch products by search query
  async searchProducts(query) {
    try {
      const response = await fetch(
        `${baseURL}products/search?q=${encodeURIComponent(query)}`
      );
      const data = await convertToJson(response);
      return data.Result || [];
    } catch (err) {
      console.error(`Error searching products with query "${query}":`, err);
      return [];
    }
  }
}
