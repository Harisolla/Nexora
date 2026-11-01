import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollToTop
 * Automatically resets scroll position to (0, 0) on route changes
 * and refreshes GSAP ScrollTrigger calculation geometry so animations
 * trigger reliably without being stuck or displaced.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  // Scroll to top immediately on route change
  useEffect(() => {
    window.scrollTo(0, 0);

    // Refresh ScrollTrigger after DOM renders top of page
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname, search]);

  // Global handler: refresh ScrollTrigger when images load asynchronously
  useEffect(() => {
    let refreshTimer;
    const handleAssetLoad = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener('load', handleAssetLoad);
    window.addEventListener('resize', handleAssetLoad);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('load', handleAssetLoad);
      window.removeEventListener('resize', handleAssetLoad);
    };
  }, []);

  return null;
}

