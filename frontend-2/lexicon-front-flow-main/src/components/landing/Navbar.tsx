import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'AI', href: '#ai' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingNavbar() {
  const [scrolled,setScrolled] = useState(false);
  useEffect(()=>{
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  },[]);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'backdrop-blur bg-background/70 border-b shadow-sm' : 'bg-transparent'} supports-[backdrop-filter]:bg-background/40`}>      
      <div className="container mx-auto px-4 h-16 flex items-center gap-6">
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold group-hover:scale-105 transition">L</div>
          <span className="font-heading font-semibold text-lg">Lexigrain</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <a key={item.href} href={item.href} className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
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
