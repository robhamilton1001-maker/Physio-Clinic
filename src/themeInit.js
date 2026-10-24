'use strict';
(function() {
  try {
    const saved = localStorage.getItem('theme') || localStorage.getItem('clinic:theme');
    const isDark = saved !== null ? saved === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {
    // ignore
  }
})();
