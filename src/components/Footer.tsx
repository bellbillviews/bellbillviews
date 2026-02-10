import { Link } from "react-router-dom";
import { Radio, Mail, Phone, MapPin } from "lucide-react";
import { DynamicSocialLinks } from "./DynamicSocialLinks";
import { useSiteSettings } from "@/hooks/useSiteData";
import { useShows } from "@/hooks/useAdminData";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: shows } = useShows();

  const getSetting = (key: string) => settings?.find(s => s.setting_key === key)?.setting_value || "";
  const stationName = getSetting("station_name") || "Bellbill Views";
  const stationSlogan = getSetting("station_slogan") || "The Sound of Culture, Voice, and Music";
  const contactEmail = getSetting("contact_email") || "hello@bellbillviews.com";
  const contactPhone = getSetting("contact_phone") || "+234 800 000 0000";
  const logoUrl = getSetting("logo_url");
  const footerLogoUrl = getSetting("footer_logo_url") || logoUrl;

  const activeShows = shows?.filter(s => s.is_active)?.slice(0, 4) || [];

  return (
    <footer className="relative bg-card/50 backdrop-blur-xl border-t border-border/30">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              {footerLogoUrl ? (
                <img src={footerLogoUrl} alt={stationName} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/15 backdrop-blur-lg border border-primary/20 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-primary" />
                </div>
              )}
              <span className="text-xl font-bold text-foreground">
                {stationName.includes(" ") ? (
                  <>{stationName.split(" ")[0]}<span className="text-primary">{stationName.split(" ").slice(1).join(" ")}</span></>
                ) : (
                  <span className="text-primary">{stationName}</span>
                )}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {stationSlogan}. Nigeria's premier digital radio station bringing you the best in entertainment, conversation, and African vibes.
            </p>
            <DynamicSocialLinks />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/listen", label: "Listen Live" },
                { to: "/shows", label: "Our Shows" },
                { to: "/events", label: "Events" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/billboard", label: "Advertise" },
                { to: "/faq", label: "FAQ" },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Programs</h3>
            <ul className="space-y-2">
              {activeShows.length > 0 ? (
                activeShows.map(show => (
                  <li key={show.id}><span className="text-muted-foreground text-sm">{show.name}</span></li>
                ))
              ) : (
                <>
                  <li><span className="text-muted-foreground text-sm">Morning Show</span></li>
                  <li><span className="text-muted-foreground text-sm">Afternoon Drive</span></li>
                  <li><span className="text-muted-foreground text-sm">Evening Vibes</span></li>
                  <li><span className="text-muted-foreground text-sm">Weekend Special</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors">{contactEmail}</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{contactPhone}</a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} {stationName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}