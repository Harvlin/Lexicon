import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_SECTIONS = [
  { id: "features", label: "Features" },
  { id: "faqs", label: "FAQs" },
  { id: "testimonials", label: "Testimonials" },
];

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Basic scroll tracking for active section + scrolled state
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const order = NAV_SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        if (!el) return { id: s.id, dist: Infinity };
        return { id: s.id, dist: Math.abs(el.getBoundingClientRect().top - 100) };
      }).sort((a,b) => a.dist - b.dist);
      if (order[0].dist < 400) setActive(order[0].id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth scroll (simpler implementation)
  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 58; // offset for nav
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    smoothScroll(id);
  };

  return (
  <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'bg-background/80 backdrop-blur border-b shadow-sm' : 'bg-background/40 backdrop-blur-sm'} border-border`}>
    <div className="max-w-7xl mx-auto px-4 flex h-16 items-center gap-6">
        {/* Brand */}
        <Link to="/home" className="flex items-center">
          <img src="/nav-kanan-3.png" alt="Lexigrain" className="h-10 sm:h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_SECTIONS.map(s => {
            const is = active === s.id;
            return (
              <button
                key={s.id}
                onClick={(e) => handleClick(e, s.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${is ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-current={is ? 'page' : undefined}
              >
                {s.label}
                {is && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>

        {/* Auth Buttons + Theme */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link to="/auth/signin"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/auth/signup"><Button size="sm" className="bg-accent hover:bg-accent-hover text-accent-foreground">Get Started</Button></Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(o => !o)} aria-label="Toggle navigation">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile panel */}
      <div className={`md:hidden overflow-hidden transition-[max-height] duration-400 ${open ? 'max-h-80' : 'max-h-0'}`}>
        <div className="px-4 pb-4 space-y-2 border-t border-border bg-background/85 backdrop-blur">
          {NAV_SECTIONS.map(s => {
            const is = active === s.id;
            return (
              <button
                key={s.id}
                onClick={(e) => handleClick(e, s.id)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${is ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground/90'}`}
              >
                {s.label}
              </button>
            );
          })}
          <div className="flex gap-2 pt-2 items-center">
            <Link to="/auth/signin" className="flex-1"><Button variant="outline" className="w-full">Sign in</Button></Link>
            <Link to="/auth/signup" className="flex-1"><Button className="w-full bg-accent hover:bg-accent-hover text-accent-foreground">Get Started</Button></Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MarketingNavbar;
