import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, Headphones } from "lucide-react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={stationName}
                className="w-10 h-10 rounded-full object-cover border border-primary/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/15 backdrop-blur-lg border border-primary/20 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                <Radio className="w-5 h-5 text-primary" />
              </div>
            )}
            <span className="text-xl font-bold text-foreground">
              {stationName.includes(" ") ? (
                <>
                  {stationName.split(" ")[0]}<span className="text-primary">{stationName.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <span className="text-primary">{stationName}</span>
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
                    ? "text-primary bg-primary/10 backdrop-blur-lg border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/30 hover:backdrop-blur-lg"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button asChild className="bg-primary/90 hover:bg-primary text-primary-foreground font-semibold rounded-xl backdrop-blur-lg shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
              <Link to="/listen">
                <Headphones className="w-4 h-4 mr-2" />
                Listen Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground rounded-xl bg-card/20 backdrop-blur-lg border border-border/20"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/80 backdrop-blur-2xl border-b border-border/30 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  location.pathname === link.path
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/30"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-full mt-4 bg-primary/90 hover:bg-primary text-primary-foreground font-semibold rounded-xl">
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