import { Link } from "react-router-dom";
import { Radio, Mail, Phone, MapPin } from "lucide-react";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Bellbill<span className="text-primary">Views</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Sound of Culture, Voice, and Music. Nigeria's premier digital radio station bringing you the best in entertainment, conversation, and African vibes.
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listen" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Listen Live
                </Link>
              </li>
              <li>
                <Link to="/shows" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Our Shows
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm">Morning Show</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Afternoon Drive</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Evening Vibes</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Weekend Special</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:hello@bellbillviews.com" className="hover:text-primary transition-colors">
                  hello@bellbillviews.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+2348000000000" className="hover:text-primary transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Bellbill Views. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
