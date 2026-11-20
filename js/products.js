/* Product menu, search and category filtering. */
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

let allProducts = [];
let activeCategory = "All Product";
let activeQuery = "";
let productSwiper;

const productsWrapper = document.getElementById("products-wrapper");
const filterButtons = [...document.querySelectorAll(".filters [data-filter]")];
filterButtons[0]?.classList.add("active");
const searchInputs = [
  document.getElementById("product-search"),
  document.getElementById("product-search-mobile"),
].filter(Boolean);

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
      character
    ]
  );

const renderProducts = () => {
  const visibleProducts = allProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "All Product" || product.category === activeCategory;
    const query = activeQuery.trim().toLocaleLowerCase();
    const matchesQuery =
      !query ||
      `${product.title} ${product.category}`.toLocaleLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (!productsWrapper) return;
  productsWrapper.innerHTML = visibleProducts.length
    ? visibleProducts
        .map(
          (product) => `
            <article class="swiper-slide product-slide">
              <div class="card d-flex">
                <div class="image"><img src="${escapeHtml(product.url)}" alt="${escapeHtml(product.title)}" loading="lazy" /></div>
                <div class="rating" aria-label="Rated ${escapeHtml(product.rating || 4.8)} out of 5">
                  <span aria-hidden="true"><i class="bx bxs-star"></i></span>
                  <span aria-hidden="true"><i class="bx bxs-star"></i></span>
                  <span aria-hidden="true"><i class="bx bxs-star"></i></span>
                  <span aria-hidden="true"><i class="bx bxs-star"></i></span>
                  <span aria-hidden="true"><i class="bx bxs-star-half"></i></span>
                  <small>${escapeHtml(product.rating || "4.8")}</small>
                </div>
                <h4>${escapeHtml(product.title)}</h4>
                <div class="price"><span>Price</span><span class="color">${currency.format(Number(product.price))}</span></div>
                <button class="button btn add-to-cart" type="button" data-product-id="${escapeHtml(product.id)}">Add to cart <i class="bx bx-plus" aria-hidden="true"></i></button>
              </div>
            </article>
          `
        )
        .join("")
    : '<div class="menu-empty"><i class="bx bx-search-alt" aria-hidden="true"></i><strong>No dishes found</strong><span>Try a different search or category.</span></div>';

  if (productSwiper) {
    productSwiper.update();
    productSwiper.slideTo(0, 0);
  }
};

const loadProducts = async () => {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) throw new Error(`Menu request failed (${response.status})`);
    const data = await response.json();
    allProducts = Array.isArray(data.products) ? data.products : [];
    window.CraveCart?.setProducts(allProducts);
    renderProducts();
  } catch (error) {
    if (productsWrapper) {
      productsWrapper.innerHTML =
        '<div class="menu-empty"><strong>Menu unavailable</strong><span>Please refresh to try again.</span></div>';
    }
    console.error("Could not load the menu:", error);
  }
};

if (window.Swiper) {
  productSwiper = new Swiper(".mySwiper", {
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: { el: ".custom-pagination", clickable: true },
    breakpoints: {
      567: { slidesPerView: 2 },
      996: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
  });
});

searchInputs.forEach((input) => {
  input.addEventListener("input", () => {
    activeQuery = input.value;
    searchInputs.forEach((other) => {
      if (other !== input) other.value = input.value;
    });
    renderProducts();
  });
});

document.querySelectorAll(".search-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("recipes")?.scrollIntoView({ behavior: "smooth" });
  });
});

productsWrapper?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  const product = allProducts.find(
    (item) => String(item.id) === button.dataset.productId
  );
  if (product) window.CraveCart?.add(product);
});

loadProducts();
