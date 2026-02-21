import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, Search, Calendar, Pill, Home, User, Stethoscope, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/search", label: "Disease Search", icon: Search },
  { path: "/appointments", label: "Appointments", icon: Calendar },
  { path: "/medicines", label: "Medicines", icon: Pill },
  { path: "/doctor-visit", label: "Doctor Visit", icon: Stethoscope },
];

interface LayoutProps {
  children: React.ReactNode;
  cartCount?: number;
  onCartClick?: () => void;
}

const Layout = ({ children, cartCount = 0, onCartClick }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-gradient">MedCare</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {cartCount > 0 && (
              <Button variant="outline" size="sm" className="relative" onClick={onCartClick}>
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              </Button>
            )}
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              <User className="h-4 w-4" />
              Guest User
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="border-t bg-card p-4 md:hidden animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container py-8 text-center">
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Medical Disclaimer:</strong> This app is for informational purposes only. Always consult a qualified healthcare professional before taking any medication or treatment.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">© 2026 MedCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
