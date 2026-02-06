import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, MapPin, Handshake, Radio } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-6 animate-fade-in">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Have a question, feedback, or partnership idea? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <Card className="bg-card border-border">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Send Us a Message
                  </h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {/* Direct Contact */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Reach Out Directly
                </h2>
                <div className="space-y-4">
                  <a
                    href="mailto:hello@bellbillviews.com"
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium">hello@bellbillviews.com</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/2348000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="text-foreground font-medium">+234 800 000 0000</p>
                    </div>
                  </a>

                  <a
                    href="tel:+2348000000000"
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-secondary/50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-foreground font-medium">+234 800 000 0000</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-foreground font-medium">Lagos, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Follow Us
                </h3>
                <SocialLinks iconSize="lg" />
              </div>

              {/* Partnership CTA */}
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Handshake className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Partnership & Sponsorship
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Interested in partnering with Bellbill Views? We offer various advertising and sponsorship packages tailored to your brand's needs.
                      </p>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <a href="mailto:partnerships@bellbillviews.com">
                          Discuss Partnership
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Appearance */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Radio className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Be a Guest
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Have a story to share? Want to promote your music or project? Reach out to be featured on one of our shows!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
