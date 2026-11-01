/**
 * NEXORA — Product Service
 * All DummyJSON API calls are centralized here.
 */

const BASE_URL = 'https://dummyjson.com';
const DEFAULT_LIMIT = 30;

async function request(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Fetch paginated products
 * @param {number} limit
 * @param {number} skip
 */
export async function fetchProducts(limit = DEFAULT_LIMIT, skip = 0) {
  return request(`${BASE_URL}/products?limit=${limit}&skip=${skip}&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images`);
}

/**
 * Fetch a single product by ID
 * @param {string|number} id
 */
export async function fetchProduct(id) {
  return request(`${BASE_URL}/products/${id}`);
}

/**
 * Fetch all categories
 */
export async function fetchCategories() {
  return request(`${BASE_URL}/products/categories`);
}

/**
 * Fetch products filtered by category slug
 * @param {string} slug
 * @param {number} limit
 * @param {number} skip
 */
export async function fetchProductsByCategory(slug, limit = DEFAULT_LIMIT, skip = 0) {
  return request(`${BASE_URL}/products/category/${encodeURIComponent(slug)}?limit=${limit}&skip=${skip}`);
}

/**
 * Search products
 * @param {string} query
 * @param {number} limit
 * @param {number} skip
 */
export async function searchProducts(query, limit = 20, skip = 0) {
  if (!query.trim()) return { products: [], total: 0, limit, skip };
  return request(`${BASE_URL}/products/search?q=${encodeURIComponent(query.trim())}&limit=${limit}&skip=${skip}`);
}

/**
 * Normalize a product to ensure all expected fields exist.
 * @param {object} p - Raw product from API
 */
export function normalizeProduct(p) {
  return {
    id: p.id,
    title: p.title || 'Untitled Product',
    description: p.description || '',
    price: typeof p.price === 'number' ? p.price : 0,
    discountPercentage: typeof p.discountPercentage === 'number' ? p.discountPercentage : 0,
    rating: typeof p.rating === 'number' ? p.rating : null,
    stock: typeof p.stock === 'number' ? p.stock : null,
    brand: p.brand || null,
    category: p.category || 'general',
    thumbnail: p.thumbnail || p.images?.[0] || null,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.thumbnail ? [p.thumbnail] : []),
  };
}

/**
 * Calculate discounted price
 * @param {number} price
 * @param {number} discountPercentage
 */
export function getDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage) return price;
  return price * (1 - discountPercentage / 100);
}

