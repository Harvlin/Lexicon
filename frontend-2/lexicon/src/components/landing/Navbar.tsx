import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingNavbar() {
  const [scrolled,setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(()=>{
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  },[]);
  
  // Smooth scroll to hash target with fixed-header offset
  const smoothScroll = (hash: string) => {
    if (!hash.startsWith('#')) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = headerRef.current?.offsetHeight ?? 64;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', `#${id}`);
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothScroll(href);
    }
  };
  return (
    <header ref={headerRef} className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'backdrop-blur bg-background/70 border-b shadow-sm' : 'bg-transparent'} supports-[backdrop-filter]:bg-background/40`}>
  <div className="container mx-auto px-4 h-16 flex items-center gap-6">
        <Link to="/home" className="flex items-center">
          <img src="/nav-kanan-3.png" alt="Lexigrain" className="h-10 sm:h-12 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <a key={item.href} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
              <span>{item.label}</span>
              <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
            </a>
          ))}
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/auth/signin"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/auth/signup"><Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow hover:shadow-md">Get Started</Button></Link>
        </div>
      </div>
    </header>
  );
}
