import { useEffect, useState, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'lexigrain:theme';

function getSystemPref(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    let saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
    if (!saved) {
      const legacy = localStorage.getItem('lexicon:theme') as 'light' | 'dark' | null;
      if (legacy) {
        try { localStorage.setItem(STORAGE_KEY, legacy); } catch {}
        saved = legacy;
      }
    }
    return saved || getSystemPref();
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  return { theme, setTheme, toggle };
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`relative inline-flex items-center justify-center h-9 w-9 rounded-md border bg-card/60 backdrop-blur text-foreground shadow-soft transition hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}`}
    >
      <Sun className={`h-5 w-5 absolute transition-all ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
      <Moon className={`h-5 w-5 absolute transition-all ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
