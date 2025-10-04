// Wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
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
  const res = await fetch(path);
  if (!res.ok) {
    console.error(`Failed to load template: ${path}`, res.status);
    return "";
  }
  return await res.text();
}

// Load header and footer partials into #main-header and #main-footer
export async function loadHeaderFooter() {
  const header = document.getElementById("main-header");
  const footer = document.getElementById("main-footer");

  if (header) {
    // adjust relative path if needed
    const headerTemplate = await loadTemplate("../partials/header.html");
    renderWithTemplate(headerTemplate, header);
  }

  if (footer) {
    // adjust relative path if needed
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


export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span class="alert-close">×</span>`;
  
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }
  
  if (scroll) {
    window.scrollTo(0, 0);
  }
  
  const closeBtn = alert.querySelector(".alert-close");
  closeBtn.addEventListener("click", () => {
    alert.remove();
  });
  
  if (duration > 0) {
    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, duration);
  }
  
  return alert;
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => alert.remove());
}