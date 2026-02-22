import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X, Search, Calendar, Pill, Home, User, Stethoscope, ShoppingCart, LogOut, Bot, Video, Activity, AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import NotificationCenter from "./NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/health-dashboard", label: "Health Vitals", icon: Activity },
  { path: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { path: "/teleconsultation", label: "Teleconsult", icon: Video },
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const handleSOS = () => {
    toast.error("Emergency SOS Activated!", {
      description: "Emergency services and your primary contact have been notified of your location.",
      duration: 10000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient shadow-lg shadow-primary/20">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-heading font-bold text-gradient tracking-tight">MedCare</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* SOS Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="hidden sm:flex gap-2 animate-pulse font-bold rounded-full px-4">
                  <AlertCircle className="h-4 w-4" /> SOS
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Emergency SOS?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately notify emergency services and your emergency contacts with your current GPS location.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSOS} className="bg-destructive text-destructive-foreground">
                    Confirm SOS
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <NotificationCenter />
            
            {cartCount > 0 && (
              <Button variant="outline" size="icon" className="relative rounded-full" onClick={onCartClick}>
                <ShoppingCart className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background">
                  {cartCount}
                </span>
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 rounded-full border-primary/20 hover:bg-primary/5">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="max-w-[100px] truncate font-semibold text-sm">{user.displayName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" className="rounded-full px-6 hero-gradient border-none" onClick={() => navigate("/auth")}>
                Login
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="border-t bg-card p-6 xl:hidden animate-fade-in shadow-2xl">
            <div className="mb-6 flex justify-center">
               <Button variant="destructive" className="w-full gap-2 py-6 text-lg font-bold rounded-2xl shadow-lg shadow-destructive/20" onClick={handleSOS}>
                  <AlertCircle className="h-6 w-6" /> EMERGENCY SOS
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-bold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="min-h-[calc(100vh-80px)]">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-card mt-24">
        <div className="container py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg hero-gradient">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-gradient">MedCare</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ⚠️ <strong>Medical Disclaimer:</strong> This app is for informational purposes only. Always consult a qualified healthcare professional before taking any medication or treatment.
          </p>
          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 MedCare. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;