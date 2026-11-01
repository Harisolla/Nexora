# NEXORA — Objects for What's Next

A minimal luxury e-commerce experience crafted with **React 19**, **Vite**, **Tailwind CSS v4**, **GSAP**, and **Framer Motion**. Designed with an editorial aesthetic inspired by contemporary industrial design, warm tactile materials, and Scandinavian architectural minimalism.

---

## 🌟 Key Highlights

- **Editorial Studio Aesthetic**: Built on the *Oat Milk & Burnt Sienna* design system with warm taupe undertones, glassmorphic floating elements, and custom typography (`Space Grotesk` & `Manrope`).
- **Cinematic Motion & Animations**: GSAP 3 with ScrollTrigger reveals, dynamic hero timeline animations, and Framer Motion layout transitions—with full `prefers-reduced-motion` accessibility support.
- **Spotlight Search Overlay**: Keyboard-first modal search (`↑`, `↓`, `Enter`, `Esc`) with debounced querying, instant previews, and direct product routing.
- **Client-Side Authentication**: Complete Login and Signup flow with live password strength indicator, 1-click demo credential autofill, and persistent session state.
- **Dual Shopping Flow**: Instant flyout slide-in Cart Drawer for rapid bag access alongside dedicated `/cart` and `/checkout` pages with order simulation.
- **App-Style Mobile Navigation**: Tactile off-canvas drawer designed like modern retail apps, featuring quick search, 2×2 visual category grid, utility dock, and user profile card.
- **Global Theme Engine**: Floating action button (FAB) toggle between Oat Milk (Light) and Deep Espresso (Dark) with zero Flash of Unstyled Content (Anti-FOUC).
- **Responsive Architecture**: Engineered for seamless ergonomics across all viewports—from 360px compact mobile screens to ultra-wide desktop displays.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) | Component architecture, Fast Refresh & modern bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables | CSS-first token system, smooth theme switching |
| **Animation** | [GSAP](https://gsap.com/) (ScrollTrigger) & [Framer Motion](https://motion.dev/) | Studio-grade choreography & page transitions |
| **Routing** | [React Router v7](https://reactrouter.com/) | Declarative client-side routing & deep-linking |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent vector iconography |
| **API** | [DummyJSON Products API](https://dummyjson.com/) | Dynamic catalog, search, categories, and inventory data |
| **State** | React Context + Web Storage | Persistent auth, bag, wishlist, and theme preferences |

---

## 📁 Project Structure

```
nexora/
├── public/                 # Static assets, SVG branding, anti-FOUC theme bootstrapper
├── src/
│   ├── components/
│   │   ├── animations/     # Page transitions & GSAP scroll reveal wrappers
│   │   ├── cart/           # Instant flyout cart drawer & item cards
│   │   ├── home/           # Hero, curated collections, product stories, categories, newsletter
│   │   ├── layout/         # Dynamic navbar, app-style mobile menu, footer, floating theme FAB
│   │   ├── products/       # Product cards, gallery, skeleton loaders, sorting controls
│   │   ├── search/         # Keyboard-driven search spotlight modal
│   │   ├── ui/             # Buttons, icons, animated toast notifications, empty states
│   │   └── wishlist/       # Quick wishlist toggle button
│   ├── context/            # AuthContext, CartContext, WishlistContext, ThemeContext
│   ├── hooks/              # useProducts, useDebounce, useReducedMotion
│   ├── pages/              # Home, Shop, Collections, Details, Cart, Checkout, Auth, 404
│   ├── services/           # DummyJSON API communication layer
│   ├── utils/              # Currency formatting and helpers
│   ├── App.jsx             # Route definitions & global providers
│   ├── index.css           # Design tokens, themes, typography, and utility classes
│   └── main.jsx            # Application entry point
├── vercel.json             # Vercel deployment SPA rewrite configuration
└── vite.config.js          # Vite build tooling and Tailwind CSS plugin setup
```

---

## 🧭 Routes & Pages

| Route | View | Description |
|---|---|---|
| `/` | `HomePage` | Cinematic editorial showcase, interactive hero, category cards, and newsletter |
| `/shop` | `ShopPage` | Filterable catalogue with category pills, price sorting, search, and pagination |
| `/collections` | `CollectionsPage` | Curated archival collections and seasonal design drops |
| `/product/:id` | `ProductDetailsPage` | High-res gallery preview, specifications, stock indicator, and related objects |
| `/cart` | `CartPage` | Dedicated bag review, quantity controls, promo discounts, and order summary |
| `/checkout` | `CheckoutPage` | Streamlined checkout simulation with contact, shipping, and validation |
| `/wishlist` | `WishlistPage` | Saved objects gallery with one-click "Move to Bag" functionality |
| `/login` | `LoginPage` | User sign-in with 1-click demo credentials autofill |
| `/signup` | `SignupPage` | Account registration with real-time password security analysis |
| `/*` | `NotFoundPage` | Custom 404 error screen with safe return navigation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Harisolla/Nexora.git
   cd Nexora
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Production Verification

```bash
# Type check & lint
npm run lint

# Compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment

This project includes a pre-configured `vercel.json` file with Single Page Application (SPA) routing rewrites.

To deploy on [Vercel](https://vercel.com/):
1. Import the repository into your Vercel Dashboard.
2. Ensure the Framework Preset is set to **Vite**.
3. Deploy directly without any additional environment variable configuration.

---

## 📄 License

MIT © [Nexora](https://github.com/Harisolla/Nexora)
