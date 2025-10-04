// js/footer.js
export function loadFooter() {
    const footerDiv = document.getElementById("footer");
    if (!footerDiv) return;

    footerDiv.innerHTML = `
    <footer class="divider">
      &copy;2025 ⛺ SleepOutside ⛺ WDD 330 ⛺ BYU-Idaho for BYU-Pathway
      Worldwide Online
    </footer>
  `;
}

// Automatically render the footer when this script loads
loadFooter();
