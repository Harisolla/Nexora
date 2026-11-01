# NEXORA — Objects for What's Next

> A minimal luxury e-commerce frontend built for the modern web — editorial in spirit, performant by design.

Crafted with **React 19**, **Vite 8**, **Tailwind CSS v4**, **GSAP 3**, and **Framer Motion 14**. The design language draws from Scandinavian architectural minimalism and warm tactile materiality, expressed through the *Oat Milk & Burnt Sienna* palette.

---

## ✨ Feature Overview

### 🎬 Motion & Visual Design
- **Cinematic Hero** — GSAP timeline entrance with auto-rotating editorial product showcase (4.5s interval), glassmorphic floating metadata pills, parallax scroll, and a live scroll indicator.
- **GSAP ScrollTrigger Reveals** — Section-level stagger animations on `FeaturedCollection`, `CategoriesSection`, `ProductStory`, `TrendingSection`, and `NewsletterSection`.
- **Framer Motion Page Transitions** — Smooth `AnimatePresence`-driven fade/slide between all routes, with lazy-loaded pages for fast TTI.
- **Animated Toast Notifications** — Spring-physics stack (max 3) with success, error, and info variants — auto-dismisses after 3.5s.
- **Reduced Motion Support** — All GSAP and Framer Motion animations respect `prefers-reduced-motion` via `useReducedMotion` hook.

### 🔍 Search
- **Spotlight Search Overlay** — Full-screen modal with debounced live querying (400ms), animated skeleton loading rows, and popular category shortcuts when idle.
- **Keyboard Navigation** — `↑` / `↓` to move between results, `Enter` to navigate, `Esc` to dismiss. Full focus trap with `aria-live` announcements.

### 🛍 Shopping & Commerce
- **Product Catalogue (`/shop`)** — Debounced search, category discipline pills (8 curated), slide-out luxury filter drawer (category, price range, rating), active filter tags, sort controls, and paginated "Load More" flow using `useProducts` hook with AbortController-based request cancellation.
- **Product Details (`/product/:id`)** — Multi-image gallery with thumbnail strip, fractional star ratings, stock indicator, quantity stepper (capped at 99), related products grid, and breadcrumb navigation.
- **Instant Cart Drawer** — Spring-physics slide-in panel from the right, full quantity controls (increment, decrement, remove), subtotal, and direct checkout CTA — without leaving the current page.
- **Dedicated Cart Page (`/cart`)** — Full cart review with free shipping progress bar (threshold: \$150), promo code input (try `NEXORA10`), tax calculation (8%), item-level edit, and order summary.
- **Checkout Simulation (`/checkout`)** — Contact, shipping address, and payment form with field validation. Demo mode — no real payment gateway. Clears cart and shows confirmation on submit.

### ❤️ Wishlist
- **Wishlist (`/wishlist`)** — Saves items via `WishlistContext` with localStorage persistence. One-click "Add All to Cart" transfers every saved item. Responsive 2-column grid on mobile.
- **Wishlist Heart Button** — Appears on every `ProductCard` and on the `ProductDetailsPage` with animated scale feedback.

### 🔐 Authentication
- **Login (`/login`)** — Email + password validation, 1-click demo credential autofill (`alexandra.vance@nexora.luxury` / `ArchivalPass2026!`), show/hide password toggle, and session persistence via `localStorage`.
- **Signup (`/signup`)** — Name, email, password, confirm password fields with live password strength meter (Weak / Good / Strong), and terms agreement toggle.
- Both pages redirect to `/shop` after authentication. If already signed in, the Login page shows a session card with sign-out option.

### 🗺 Navigation
- **Navbar** — Fixed header with transparent-to-blurred-glass scroll transition (threshold: 15px). Responsive height: `64px` desktop → `60px` tablet → `58px` mobile. Shows live cart and wishlist badge counts. Auth-aware user icon (routes to profile or login).
- **App-Style Mobile Drawer** — Framer Motion spring slide-in from the right. Contains: quick search shortcut → `SearchOverlay`, 2×2 visual category cards (Furniture, Watches, Fragrances, Home), 3-column utility dock (Bag, Wishlist, Checkout), and an account profile card with sign-out.
- **Collections (`/collections`)** — Thematic editorial lookbook with 6 curated capsule collections (Architectural Living, Nocturne Fragrances, Horology, and more), live product image previews from the API, GSAP stagger entrance, and discipline filter tabs.
- **Global Floating Theme FAB** — Fixed `bottom-right` circular button, toggling Light (Oat Milk) ↔ Dark (Deep Espresso) with animated sun/moon icon rotation, backdrop blur, and `data-theme` attribute flipped on `<html>`. Anti-FOUC theme bootstrapper runs before React via `public/theme-init.js`.

---

## 🛠 Tech Stack

| Layer | Library / Tool | Version |
|---|---|---|
| Framework | React | `^19.3.1` |
| Build Tool | Vite | `^8.3.4` |
| Styling | Tailwind CSS (CSS-first, no config file) | `^4.3.3` |
| Animation | GSAP + ScrollTrigger + `@gsap/react` | `^3.15.0` / `^2.1.2` |
| Animation | Framer Motion | `^14.6.0` |
| Routing | React Router DOM | `^7.18.4` |
| Icons | Lucide React | `^1.61.0` |
| Data API | [DummyJSON](https://dummyjson.com/docs/products) | — |
| State | React Context API + `useReducer` | built-in |
| Persistence | `localStorage` | browser built-in |
| Fonts | Space Grotesk, Manrope | Google Fonts |

---

## 📁 Project Structure

```
nexora/
├── public/
│   ├── favicon.svg            # SVG brand mark
│   └── theme-init.js          # Anti-FOUC theme bootstrapper (runs before React)
├── src/
│   ├── components/
│   │   ├── animations/
│   │   │   ├── AnimatedSection.jsx   # GSAP ScrollTrigger scroll-reveal wrapper
│   │   │   └── PageTransition.jsx    # Framer Motion page fade/slide wrapper
│   │   ├── cart/
│   │   │   └── CartDrawer.jsx        # Spring slide-in cart overlay with quantity controls
│   │   ├── home/
│   │   │   ├── HeroSection.jsx       # Cinematic hero with GSAP timeline, auto-carousel
│   │   │   ├── FeaturedCollection.jsx # 4-product curated spotlight with stagger animation
│   │   │   ├── ProductStory.jsx      # Asymmetric editorial monograph with clip-path reveal
│   │   │   ├── CategoriesSection.jsx # API-powered category grid (2-col mobile, 4-col desktop)
│   │   │   ├── TrendingSection.jsx   # Trending product grid
│   │   │   └── NewsletterSection.jsx # Invitation form with promo code copy on success
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Scroll-aware fixed header with auth/cart/search
│   │   │   ├── MobileMenu.jsx        # App-style spring drawer with category cards & dock
│   │   │   ├── Footer.jsx            # 3-column minimal footer with back-to-top
│   │   │   ├── ThemeToggle.jsx       # Floating FAB or inline sun/moon theme button
│   │   │   └── ScrollToTop.jsx       # Scroll restoration on route change
│   │   ├── products/
│   │   │   ├── ProductCard.jsx       # Card with rating stars, discount badge, wishlist heart
│   │   │   ├── ProductGallery.jsx    # Thumbnail strip + main image viewer
│   │   │   ├── ProductGrid.jsx       # Responsive auto-fill product grid
│   │   │   ├── ProductSkeleton.jsx   # Shimmer loading skeleton card
│   │   │   └── ProductSort.jsx       # Sort dropdown component
│   │   ├── search/
│   │   │   └── SearchOverlay.jsx     # Full-screen search modal with keyboard navigation
│   │   ├── ui/
│   │   │   ├── Button.jsx            # Polymorphic button (variant/size/loading/as-Link)
│   │   │   ├── IconButton.jsx        # Icon button with optional badge overlay
│   │   │   ├── Toast.jsx             # Animated toast stack + ToastProvider + useToast hook
│   │   │   ├── EmptyState.jsx        # Reusable empty state (icon + title + CTA)
│   │   │   └── index.js              # Barrel export
│   │   └── wishlist/
│   │       └── WishlistButton.jsx    # Animated heart toggle button
│   ├── context/
│   │   ├── AuthContext.jsx           # Login, signup, logout; localStorage session persistence
│   │   ├── CartContext.jsx           # Cart reducer (add/remove/update/clear); localStorage
│   │   ├── WishlistContext.jsx       # Wishlist toggle/add/remove; localStorage
│   │   ├── ThemeContext.jsx          # Light/dark toggle; system preference detection
│   │   └── index.js                 # Barrel export
│   ├── hooks/
│   │   ├── useProducts.js            # Paginated, filterable, searchable product fetcher
│   │   ├── useDebounce.js            # 400ms value debounce for search
│   │   ├── useReducedMotion.js       # Reads prefers-reduced-motion media query
│   │   └── index.js                 # Barrel export
│   ├── pages/
│   │   ├── HomePage.jsx              # All homepage sections composed
│   │   ├── ShopPage.jsx              # Catalogue with filters, search, sort, pagination
│   │   ├── CollectionsPage.jsx       # Editorial capsule lookbook with GSAP animations
│   │   ├── ProductDetailsPage.jsx    # Gallery, specs, add-to-bag, related products
│   │   ├── WishlistPage.jsx          # Saved items grid with batch cart transfer
│   │   ├── CartPage.jsx              # Full bag review, promo codes, order summary
│   │   ├── CheckoutPage.jsx          # Multi-section demo checkout form
│   │   ├── LoginPage.jsx             # Auth with demo autofill + remember me
│   │   ├── SignupPage.jsx            # Registration with password strength meter
│   │   └── NotFoundPage.jsx          # Custom 404 page
│   ├── services/
│   │   └── productService.js         # All DummyJSON API calls + normalizeProduct
│   ├── utils/
│   │   ├── formatPrice.js            # USD currency formatter
│   │   └── index.js                 # Barrel export
│   ├── App.jsx                       # Route definitions, global providers, lazy loading
│   ├── App.css                       # Minimal reset overrides
│   ├── index.css                     # Design tokens, themes, typography, utility classes
│   └── main.jsx                      # React DOM entry point
├── vercel.json                        # SPA rewrite: all routes → /index.html
├── vite.config.js                     # Vite config with @tailwindcss/vite plugin
├── eslint.config.js                   # ESLint flat config
└── package.json
```

---

## 🧭 Routes & Pages

| Route | Page | Description |
|---|---|---|
| `/` | `HomePage` | Full editorial homepage — Hero, Featured, Story, Categories, Trending, Newsletter |
| `/shop` | `ShopPage` | Searchable, filterable, sortable product catalogue with pagination |
| `/collections` | `CollectionsPage` | 6 editorial capsule collections with GSAP stagger and live API images |
| `/product/:id` | `ProductDetailsPage` | Gallery, specs, ratings, stock badge, quantity selector, related products |
| `/cart` | `CartPage` | Bag review, promo codes, shipping progress, tax calculation, order summary |
| `/checkout` | `CheckoutPage` | Demo checkout with contact + shipping form, validation, and order confirmation |
| `/wishlist` | `WishlistPage` | Saved items with one-click "Add All to Cart" and individual product links |
| `/login` | `LoginPage` | Email/password sign-in with 1-click demo autofill |
| `/signup` | `SignupPage` | New account registration with live password strength indicator |
| `/*` | `NotFoundPage` | Custom 404 with navigation links |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher

### Local Development

```bash
# Clone the repository
git clone https://github.com/Harisolla/Nexora.git
cd Nexora

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173
```

### Production Build

```bash
# Lint the codebase
npm run lint

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## ☁️ Deployment (Vercel)

A `vercel.json` is included with a catch-all SPA rewrite so all client-side routes resolve correctly:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Steps to deploy:**
1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Framework Preset: **Vite** (auto-detected).
3. No environment variables required — data comes from the public DummyJSON API.
4. Click **Deploy**.

---

## 🔑 Demo Login Credentials

The login page has a **1-click autofill** button, or use manually:

| Field | Value |
|---|---|
| Email | `alexandra.vance@nexora.luxury` |
| Password | `ArchivalPass2026!` |

> Authentication is client-side only — no real backend or database is connected.

---

## 📄 License

MIT © [Nexora](https://github.com/Harisolla/Nexora)
