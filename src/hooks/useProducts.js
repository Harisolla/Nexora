/**
 * NEXORA — useProducts Hook
 * Fetches and manages product listing state.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
  normalizeProduct
} from '../services/productService';

const PAGE_SIZE = 12;

export function useProducts({ category = '', query = '', sortBy = 'default' } = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const seenIds = useRef(new Set());
  const abortRef = useRef(null);

  const doFetch = useCallback(async (newSkip, replace) => {
    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let data;
      if (query) {
        data = await searchProducts(query, PAGE_SIZE, newSkip);
      } else if (category) {
        data = await fetchProductsByCategory(category, PAGE_SIZE, newSkip);
      } else {
        data = await fetchProducts(PAGE_SIZE, newSkip);
      }

      if (controller.signal.aborted) return;

      const normalized = (data.products || [])
        .map(normalizeProduct)
        .filter(p => {
          if (seenIds.current.has(p.id)) return false;
          seenIds.current.add(p.id);
          return true;
        });

      setProducts(prev => replace ? normalized : [...prev, ...normalized]);
      setTotal(data.total || 0);
      setHasMore(newSkip + PAGE_SIZE < (data.total || 0));
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to load products');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [category, query]);

  // Reset and refetch when filters change
  useEffect(() => {
    seenIds.current = new Set();
    setProducts([]);
    setSkip(0);
    setLoading(true);
    setError(null);
    doFetch(0, true);
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [doFetch]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    doFetch(nextSkip, false);
  }, [loadingMore, hasMore, skip, doFetch]);

  // Client-side sort (on visible items)
  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
    return 0;
  });

  return { products: sorted, total, loading, loadingMore, error, hasMore, loadMore };
}

