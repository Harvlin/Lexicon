import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Global header above sidebar and content */}
      <div className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 [padding-top:env(safe-area-inset-top)]">
        <div className="relative w-full h-16 grid grid-cols-3 items-center">
          {/* Left: brand + mobile menu */}
          <div className="pl-3 sm:pl-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/home" className="flex items-center">
              <img
                src="/nav-kanan-3.png"
                alt="Lexigrain"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
          </div>
          {/* Center: search */}
          <div className="relative w-full max-w-xl justify-self-center px-3 sm:px-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lessons, topics, or tags..."
              aria-label="Search lessons"
              enterKeyHint="search"
              className="pl-10 rounded-xl shadow-soft focus-visible:ring-2 h-10 sm:h-11"
            />
          </div>
          {/* Right spacer to keep center true */}
          <div className="pr-3 sm:pr-4" />
        </div>
      </div>

      <div className="flex w-full">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 md:ml-64 transition-all duration-300">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
