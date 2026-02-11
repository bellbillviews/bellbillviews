import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteData";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Listen Live", path: "/listen" },
  { name: "Shows", path: "/shows" },
  { name: "Events", path: "/events" },
  { name: "Billboard", path: "/billboard" },
  { name: "Contact", path: "/contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  
  const getSetting = (key: string) => settings?.find(s => s.setting_key === key)?.setting_value || "";
  const logoUrl = getSetting("logo_url");
  const stationName = getSetting("station_name") || "Bellbill Views";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {logoUrl ? (
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/30 blur-md group-hover:bg-primary/50 transition-all" />
                <img 
                  src={logoUrl} 
                  alt={stationName}
                  className="relative w-10 h-10 rounded-full object-cover border-2 border-primary/40"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/30 blur-md" />
                <div className="relative w-10 h-10 rounded-full liquid-glass flex items-center justify-center">
                  <Radio className="w-5 h-5 text-primary" />
                </div>
              </div>
            )}
            <span className="text-xl font-bold">
              {stationName.includes(" ") ? (
                <>
                  <span className="text-foreground">{stationName.split(" ")[0]}</span>
                  <span className="text-gradient">{" " + stationName.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <span className="text-gradient">{stationName}</span>
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  location.pathname === link.path
                    ? "text-primary liquid-glass glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-primary relative overflow-hidden group">
              <Link to="/listen">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Headphones className="w-4 h-4 mr-2" />
                Listen Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground rounded-xl liquid-glass"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden liquid-glass-strong animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  location.pathname === link.path
                    ? "text-primary liquid-glass"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-primary">
              <Link to="/listen" onClick={() => setIsOpen(false)}>
                <Headphones className="w-4 h-4 mr-2" />
                Listen Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
