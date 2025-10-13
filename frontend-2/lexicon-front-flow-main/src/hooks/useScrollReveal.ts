import { useEffect } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
}

// Adds 'is-visible' class to elements with data-reveal when they intersect viewport.
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -5% 0px' }: Options = {}) {
  useEffect(() => {
    if (typeof window === 'undefined' || 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Immediately show elements if reduced motion
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.classList.add('is-visible');
          io.unobserve(target);
        }
      });
    }, { threshold, rootMargin });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [threshold, rootMargin]);
}

export default useScrollReveal;
