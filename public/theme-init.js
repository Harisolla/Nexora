/**
 * NEXORA — Anti-FOUC Theme Script
 * Injected into index.html <head> before React loads.
 * Reads localStorage and system preference, applies theme class.
 */
(function () {
  try {
    var saved = localStorage.getItem('nexora-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.classList.add(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  } catch {}
})();

