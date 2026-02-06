import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Radio, Globe, Headphones, MessageSquare } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-6 animate-fade-in">
              <Radio className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              About <span className="text-gradient">Bellbill Views</span>
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              The Sound of Culture, Voice, and Music
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Our <span className="text-primary">Journey</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Born in the vibrant heart of Nigeria, Bellbill Views emerged from a simple yet powerful vision: to create a digital platform that celebrates African culture, amplifies authentic voices, and delivers music that moves souls.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  What started as a passion project among friends who believed in the power of radio has evolved into a growing digital media platform reaching listeners across Nigeria and the African diaspora worldwide.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we broadcast 24/7, featuring a diverse lineup of shows that range from morning motivation to late-night grooves, from hard-hitting conversations to pure musical bliss. Our team of dedicated hosts brings authenticity, expertise, and infectious energy to every broadcast.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-2xl flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center animate-pulse-glow">
                    <Radio className="w-16 h-16 text-primary" />
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading voice of African culture through digital broadcasting, creating content that informs, entertains, and inspires our diverse audience while providing a platform for emerging talents and authentic stories.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border hover:border-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become Africa's most influential digital radio network, connecting millions of listeners worldwide with the rich tapestry of African music, culture, and contemporary discourse.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Authenticity in every broadcast. Community at our core. Excellence in production. Passion for African culture. Innovation in digital media. Respect for our audience and partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We <span className="text-primary">Do</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              More than just radio—we're a complete digital media experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Live Radio</h3>
              <p className="text-sm text-muted-foreground">
                24/7 live broadcasting with diverse programming
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Talk Shows</h3>
              <p className="text-sm text-muted-foreground">
                Engaging conversations on culture, lifestyle, and current affairs
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Building connections through shared experiences
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-brand-orange/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-brand-orange" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Global Reach</h3>
              <p className="text-sm text-muted-foreground">
                Connecting Africans at home and in the diaspora
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to <span className="text-primary">Tune In</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of listeners who have made Bellbill Views their go-to station for African vibes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Link to="/listen">Listen Live Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-muted">
                <Link to="/contact">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
