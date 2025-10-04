< !doctype html >
  <html lang="en">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Sleep Outside | Checkout</title>
      <link rel="stylesheet" href="../css/style.css" />
    </head>

    <body>
      <!-- Dynamic Header -->
      <div id="header"></div>

      <main class="divider">
        <section class="checkout">
          <h2>Checkout</h2>
          <form id="checkout-form">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required />

            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />

            <label for="address">Address</label>
            <textarea id="address" name="address" required></textarea>

            <label for="payment">Payment Method</label>
            <select id="payment" name="payment" required>
              <option value="">Select...</option>
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
            </select>

            <button type="submit">Place Order</button>
          </form>
        </section>
      </main>

      <!-- Dynamic Footer -->
      <div id="footer"></div>

      <!-- Scripts -->
      <script type="module" src="../js/checkout.js"></script>
      <script type="module" src="../js/main.js"></script>
    </body>

  </html>
