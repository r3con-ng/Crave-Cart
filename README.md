# CraveCart

A responsive food ordering storefront prototype. The original page structure and visual style remain, with updated CraveCart branding and working client-side shopping interactions.

## Run locally

Serve this folder with any static HTTP server so the product JSON can be loaded with `fetch`. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Prototype features

- Search the menu and filter by category.
- Add products to the cart, change quantities, remove items, and keep the cart on this device.
- Preview checkout and submit a demo sign-in form.
- Prices and totals display in INR.

Sign-in and checkout are UI previews only. The site does not create accounts, send orders, or collect payment details. Product data is in `data/products.json`.
