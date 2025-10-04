export function loadHeader() {
  const headerDiv = document.getElementById("header");
  if (!headerDiv) return;

  headerDiv.innerHTML = `
    <header class="divider">
      <div class="logo">
        <img src="/images/noun_Tent_2517.svg" alt="tent image for logo" />
        <a href="/index.html"> Sleep<span class="highlight">Outside</span></a>
      </div>

      <div class="cart">
        <a href="/cart/index.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <!-- SVG paths for cart icon -->
            <path d="M18.9 32.6c1.1 2.4 2.5 3.3 5.4 3.3 1.6 0 3.6-0.3 5.9-0.6 ..."/>
          </svg>
        </a>
      </div>
    </header>
  `;
}

// automatically call it so header loads when the script is included
loadHeader();
