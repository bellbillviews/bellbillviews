import { Link } from "react-router-dom";
import { Radio, Mail, Phone, MapPin, Sparkles } from "lucide-react";
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
    <footer className="relative overflow-hidden">
      {/* Top glow bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-80 h-40 bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-60 h-32 bg-brand-cyan/6 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-1/4 w-40 h-20 bg-brand-pink/5 rounded-full blur-[60px]" />
      </div>
      
      <div className="container mx-auto px-4 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              {footerLogoUrl ? (
                <img src={footerLogoUrl} alt={stationName} className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
              ) : (
                <div className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center">
                  <Radio className="w-5 h-5 text-primary" />
                </div>
              )}
              <span className="text-xl font-bold">
                {stationName.includes(" ") ? (
                  <><span className="text-foreground">{stationName.split(" ")[0]}</span><span className="text-gradient">{" " + stationName.split(" ").slice(1).join(" ")}</span></>
                ) : (
                  <span className="text-gradient">{stationName}</span>
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
            <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
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
                  <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors text-sm hover:pl-1 duration-300">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-cyan" />
              Programs
            </h3>
            <ul className="space-y-2.5">
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
            <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-pink" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors">{contactEmail}</a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-brand-cyan" />
                </div>
                <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{contactPhone}</a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <div className="w-8 h-8 rounded-lg liquid-glass flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-brand-pink" />
                </div>
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
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
