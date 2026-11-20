/* Navigation, demo forms, and persistent shopping cart. */
const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const hamburger = document.querySelector(".hamburger");
const closeMenu = document.querySelector(".nav-list .close");
const menu = document.querySelector(".nav-list");
const cartPanel = document.getElementById("cart-panel");
const cartBackdrop = document.getElementById("cart-backdrop");
const checkoutBackdrop = document.getElementById("checkout-backdrop");
const toast = document.getElementById("site-toast");
const cartItemsNode = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartSummary = document.getElementById("cart-summary");
const cartCountNodes = [...document.querySelectorAll(".cart-icon span")];
const cartButtons = [...document.querySelectorAll(".cart-icon")];
let savedCart = [];
let toastTimer;

try {
  const parsedCart = JSON.parse(localStorage.getItem("cravecart-cart") || "[]");
  savedCart = Array.isArray(parsedCart)
    ? parsedCart.filter(
        (item) => Number.isFinite(Number(item.id)) && Number(item.quantity) > 0
      ).map((item) => ({ id: Number(item.id), quantity: Math.floor(Number(item.quantity)) }))
    : [];
} catch {
  savedCart = [];
}

hamburger?.addEventListener("click", () => {
  menu?.classList.add("show");
  hamburger.setAttribute("aria-expanded", "true");
});

const hideMenu = () => {
  menu?.classList.remove("show");
  hamburger?.setAttribute("aria-expanded", "false");
};
closeMenu?.addEventListener("click", hideMenu);
menu?.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", hideMenu)
);

const signInModal = document.querySelector("header .wrapper");
document.querySelectorAll(".signin").forEach((trigger) =>
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    signInModal?.classList.add("active");
    signInModal?.querySelector("input")?.focus();
  })
);
document.querySelector(".close-form")?.addEventListener("click", () => {
  signInModal?.classList.remove("active");
});
signInModal?.addEventListener("click", (event) => {
  if (event.target === signInModal) signInModal.classList.remove("active");
});

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
};

const persistCart = () => {
  try {
    localStorage.setItem("cravecart-cart", JSON.stringify(savedCart));
  } catch {
    showToast("Cart storage is unavailable in this browser.");
  }
};

const renderCart = () => {
  const products = window.CraveCartProducts || [];
  const populatedCart = savedCart
    .map((entry) => ({
      ...entry,
      product: products.find((product) => String(product.id) === String(entry.id)),
    }))
    .filter((entry) => entry.product);
  savedCart = populatedCart.map(({ id, quantity }) => ({ id, quantity }));
  const count = savedCart.reduce((total, item) => total + item.quantity, 0);
  cartCountNodes.forEach((node) => (node.textContent = String(count)));
  cartButtons.forEach((button) => {
    button.setAttribute(
      "aria-label",
      `Open shopping cart, ${count} ${count === 1 ? "item" : "items"}`
    );
  });
  const isEmpty = populatedCart.length === 0;
  cartEmpty.hidden = !isEmpty;
  cartSummary.hidden = isEmpty;
  cartItemsNode.innerHTML = populatedCart
    .map(
      ({ product, quantity }) => `
        <article class="cart-item">
          <div class="cart-item-image"><img src="${product.url}" alt="" /></div>
          <div class="cart-item-details">
            <h3>${product.title}</h3>
            <strong>${money.format(Number(product.price) * quantity)}</strong>
            <div class="quantity-control" aria-label="Quantity for ${product.title}">
              <button type="button" data-cart-action="decrease" data-id="${product.id}" aria-label="Decrease ${product.title} quantity">−</button>
              <span aria-live="polite">${quantity}</span>
              <button type="button" data-cart-action="increase" data-id="${product.id}" aria-label="Increase ${product.title} quantity">+</button>
              <button type="button" class="remove-item" data-cart-action="remove" data-id="${product.id}">Remove</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
  const subtotal = populatedCart.reduce(
    (total, { product, quantity }) => total + Number(product.price) * quantity,
    0
  );
  document.getElementById("cart-subtotal").textContent = money.format(subtotal);
  persistCart();
};

const setCartOpen = (isOpen) => {
  cartPanel.classList.toggle("open", isOpen);
  cartPanel.setAttribute("aria-hidden", String(!isOpen));
  cartPanel.toggleAttribute("inert", !isOpen);
  cartBackdrop.hidden = !isOpen;
  document.body.classList.toggle("overlay-open", isOpen);
  cartButtons.forEach((button) => button.setAttribute("aria-expanded", String(isOpen)));
  if (isOpen) cartPanel.querySelector("[data-close-cart]")?.focus();
};

cartButtons.forEach((button) =>
  button.addEventListener("click", () => setCartOpen(true))
);
document.querySelectorAll("[data-close-cart]").forEach((button) =>
  button.addEventListener("click", () => {
    setCartOpen(false);
    if (button.matches(".cart-empty .btn")) {
      document.getElementById("recipes")?.scrollIntoView({ behavior: "smooth" });
    }
  })
);
cartBackdrop?.addEventListener("click", () => setCartOpen(false));

const adjustCart = (id, action) => {
  const current = savedCart.find((item) => String(item.id) === String(id));
  if (!current) return;
  if (action === "remove" || (action === "decrease" && current.quantity <= 1)) {
    savedCart = savedCart.filter((item) => String(item.id) !== String(id));
  } else {
    current.quantity += action === "increase" ? 1 : -1;
  }
  renderCart();
};
cartItemsNode?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");
  if (button) adjustCart(button.dataset.id, button.dataset.cartAction);
});

const openCheckout = () => {
  if (!savedCart.length) return;
  setCartOpen(false);
  checkoutBackdrop.hidden = false;
  document.body.classList.add("overlay-open");
  document.getElementById("checkout-name")?.focus();
};
document.getElementById("checkout-start")?.addEventListener("click", openCheckout);
document.querySelectorAll("[data-close-checkout]").forEach((button) =>
  button.addEventListener("click", () => {
    checkoutBackdrop.hidden = true;
    document.body.classList.remove("overlay-open");
  })
);
checkoutBackdrop?.addEventListener("click", (event) => {
  if (event.target === checkoutBackdrop) {
    checkoutBackdrop.hidden = true;
    document.body.classList.remove("overlay-open");
  }
});

document.getElementById("signin-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  signInModal.classList.remove("active");
  event.currentTarget.reset();
  showToast("Demo sign in complete. No account was created.");
});

document.getElementById("checkout-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("order-confirmation").hidden = false;
  event.currentTarget.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!checkoutBackdrop.hidden) {
    checkoutBackdrop.hidden = true;
    document.body.classList.remove("overlay-open");
  } else if (cartPanel.classList.contains("open")) {
    setCartOpen(false);
  } else {
    signInModal?.classList.remove("active");
    hideMenu();
  }
});

window.CraveCart = {
  setProducts(products) {
    window.CraveCartProducts = products;
    renderCart();
  },
  add(product) {
    const item = savedCart.find((entry) => String(entry.id) === String(product.id));
    if (item) item.quantity += 1;
    else savedCart.push({ id: product.id, quantity: 1 });
    window.CraveCartProducts = window.CraveCartProducts || [];
    if (!window.CraveCartProducts.some((entry) => String(entry.id) === String(product.id))) {
      window.CraveCartProducts.push(product);
    }
    renderCart();
    showToast(`${product.title} added to your cart.`);
  },
};

document.getElementById("copyright-year").textContent = new Date().getFullYear();
const initialCount = savedCart.reduce((total, item) => total + item.quantity, 0);
cartCountNodes.forEach((node) => (node.textContent = String(initialCount)));
