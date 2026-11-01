# NEXORA — Objects for what's next.

A premium, animated e-commerce frontend built with React 19, Vite, Tailwind CSS v4, GSAP, and Framer Motion.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Animations | GSAP 3 + ScrollTrigger, Framer Motion 14 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Data | [DummyJSON Products API](https://dummyjson.com/docs/products) |
| State | React Context API + localStorage |
| Fonts | Manrope, Space Grotesk (Google Fonts) |

---

## 🎨 Design System — Oat Milk × Burnt Sienna

### Light Mode
| Token | Color | Hex |
|---|---|---|
| Background | Oat Milk | `#F5F0E7` |
| Surface | Natural Linen | `#E2D2BC` |
| Primary Text | Deep Cocoa | `#352720` |
| Secondary Text | Warm Taupe | `#766354` |
| Accent | Burnt Sienna | `#A95032` |
| Accent 2 | Camel | `#C49A76` |
| Border | Soft Sand | `#D7C4AE` |
| Elevated | Warm Porcelain | `#FAF7F1` |

### Dark Mode
| Token | Color | Hex |
|---|---|---|
| Background | Deep Espresso | `#251B16` |
| Surface | Dark Cocoa | `#352720` |
| Primary Text | Oat Milk | `#F5F0E7` |
| Secondary Text | Warm Sand | `#C9B8A7` |
| Accent | Lightened Sienna | `#D47B53` |
| Border | Dark Walnut | `#4B382D` |

---

## 📁 Project Structure

```
src/
  components/
    animations/     # GSAP + Framer Motion wrappers (AnimatedSection, PageTransition)
    cart/           # CartDrawer
    home/           # HeroSection, FeaturedCollection, ProductStory, CategoriesSection, TrendingSection, NewsletterSection
    layout/         # Navbar, Footer, MobileMenu, ThemeToggle, ScrollToTop
    products/       # ProductCard, ProductSkeleton, ProductGallery, ProductGrid, ProductSort
    search/         # SearchOverlay
    ui/             # Button, IconButton, Toast, EmptyState
    wishlist/       # WishlistButton
  context/          # AuthContext, CartContext, ThemeContext, WishlistContext
  hooks/            # useDebounce, useProducts, useReducedMotion
  pages/
    HomePage.jsx
    ShopPage.jsx
    CollectionsPage.jsx
    ProductDetailsPage.jsx
    WishlistPage.jsx
    CartPage.jsx
    CheckoutPage.jsx
    LoginPage.jsx
    SignupPage.jsx
    NotFoundPage.jsx
  services/
    productService.js
  utils/
    formatPrice.js
```

---

## 🔗 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Cinematic hero, featured items, category showcase, and editorial sections |
| `/shop` | ShopPage | Full catalogue with debounced search, category filter, sort, and pagination |
| `/collections` | CollectionsPage | Curated archival collections & design edits |
| `/product/:id` | ProductDetailsPage | Image gallery with thumbnails, ratings, stock status, and add to bag |
| `/wishlist` | WishlistPage | Saved items, 1-click cart transfer, and localStorage persistence |
| `/cart` | CartPage | Dedicated bag overview, order summary, and promo codes |
| `/checkout` | CheckoutPage | Guided multi-step demonstration checkout |
| `/login` | LoginPage | Authentication with 1-click demo autofill |
| `/signup` | SignupPage | Registration with live password strength meter |
| `/*` | NotFoundPage | 404 fallback with return navigation |

---

## ✨ Features

- **Cinematic Hero** — GSAP timeline animation with smooth entrance.
- **Product Catalogue** — Real API-powered grid, category filtering, price sorting, and dynamic pagination.
- **Search Overlay** — Spotlight-style debounced search with keyboard navigation (`↑`, `↓`, `↵`, `ESC`).
- **Global Theme Toggle** — Floating FAB with light/dark mode persistence and zero FOUC.
- **Client-Side Auth** — Login and Signup with localStorage persistence and 1-click demo autofill.
- **Cart & Wishlist** — Dual drawer & dedicated page workflows with live badge counters.
- **App-Style Mobile Navigation** — Tactile category exploration, search pill, and bottom profile bar.
- **Responsive & Accessible** — Full tablet/mobile ergonomics, ARIA roles, and reduced motion support.

---

## 📦 API

All product data is sourced from [DummyJSON](https://dummyjson.com/docs/products):

```
GET https://dummyjson.com/products?limit=12&skip=0
GET https://dummyjson.com/products/:id
GET https://dummyjson.com/products/categories
GET https://dummyjson.com/products/category/:slug
GET https://dummyjson.com/products/search?q=:query
```

---

Built with intention using React 19 + Vite.
