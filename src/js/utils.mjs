// Wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) return;
  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  element.addEventListener("click", callback);
}

// Render a single template into a parent element, with optional callback
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Load an HTML template from a path asynchronously
export async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      console.error(`Failed to load template: ${path}`, res.status);
      return "";
    }
    return await res.text();
  } catch (err) {
    console.error(`Error fetching template: ${path}`, err);
    return "";
  }
}

// Load header and footer partials into #main-header and #main-footer
// Also updates cart count automatically
export async function loadHeaderFooter() {
  const header = document.getElementById("main-header");
  const footer = document.getElementById("main-footer");

  // Load header
  if (header) {
    // Adjust relative path based on current page location
    const headerTemplate = await loadTemplate("../partials/header.html");
    renderWithTemplate(headerTemplate, header);

    // Update cart count
    const cartCountSpan = header.querySelector("#cart-count");
    const cartItems = getLocalStorage("so-cart") || [];
    if (cartCountSpan) cartCountSpan.textContent = cartItems.length;
  }

  // Load footer
  if (footer) {
    const footerTemplate = await loadTemplate("../partials/footer.html");
    renderWithTemplate(footerTemplate, footer);
  }
}

// Get a parameter value from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Render a list of items with a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
