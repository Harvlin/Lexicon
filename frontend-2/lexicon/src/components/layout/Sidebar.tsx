import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  User,
  Star,
  TrendingUp,
  Award,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Library", path: "/library" },
  { icon: Star, label: "Favorites", path: "/favorites" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: Award, label: "Schedule", path: "/schedule" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-card transition-transform duration-300 shadow-none md:shadow-none md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <span className="font-heading font-semibold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link key={item.path} to={item.path} onClick={onClose}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 transition-all",
                      active && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 rounded-lg bg-gradient-primary text-primary-foreground">
            <h3 className="font-heading font-semibold mb-1">
              Unlock Premium
            </h3>
            <p className="text-sm opacity-90 mb-3">
              Get unlimited access to all courses
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
