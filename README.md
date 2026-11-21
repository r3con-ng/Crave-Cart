# CraveCart

**Good food, right on time.** CraveCart is a responsive food ordering storefront built with vanilla web technologies. Browse a sample menu, find dishes by name or category, and put together an order in a clean, mobile-friendly interface.

## Features

- Search the menu and filter dishes by category.
- View product images, ratings, and sample prices in Indian rupees (INR).
- Add items to a cart, adjust quantities, remove products, and view the subtotal.
- Keep cart contents between visits with browser `localStorage`.
- Use the responsive navigation and order flow on desktop or mobile.

## Getting started

CraveCart is a static site and does not require a package manager or build step. Serve the project directory over HTTP so the browser can load the menu data:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Built with

- HTML, CSS, Sass, and vanilla JavaScript
- JSON product and testimonial data
- [Swiper](https://swiperjs.com/) for the menu carousel
- [Boxicons](https://boxicons.com/) for interface icons
- Google Fonts for typography

Swiper, Boxicons, and Google Fonts are loaded from their public CDNs.

## Project structure

```text
.
├── css/       Compiled stylesheets
├── data/      Product and testimonial data
├── images/    Food, profile, and interface artwork
├── js/        Menu, cart, navigation, and testimonial interactions
├── scss/      Sass stylesheet source
└── index.html Storefront page
```

## Menu data

Edit [`data/products.json`](data/products.json) to change the dishes shown in the storefront. Each product includes an ID, title, price in INR, image path, category, and rating. Product images are stored in `images/`.

## Demo behavior

Sign-in and checkout demonstrate the interface only. They do not create accounts, submit orders, or process payments. Cart data stays in the current browser and is not sent to a server. Menu prices are sample values.
