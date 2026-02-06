import { Link } from "react-router-dom";
import { Radio, Headphones, Users, Heart, ChevronRight, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SocialLinks } from "@/components/SocialLinks";
import { ShowCard } from "@/components/ShowCard";
import { shows } from "@/data/shows";

export default function HomePage() {
  const featuredShows = shows.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full animate-fade-in">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium text-accent">Live Now</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Bellbill<span className="text-gradient">Views</span>
            </h1>

            {/* Slogan */}
            <p className="text-xl sm:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              The Sound of Culture, Voice, and Music
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full animate-pulse-glow"
              >
                <Link to="/listen">
                  <Headphones className="w-5 h-5 mr-2" />
                  Listen Live
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:bg-muted font-semibold px-8 py-6 text-lg rounded-full"
              >
                <Link to="/shows">
                  View Programs
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Audio Player Widget */}
            <div className="max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <AudioPlayer size="compact" />
            </div>

            {/* Social Links */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <SocialLinks iconSize="lg" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Now Playing Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Radio className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  On Air Now
                </p>
                <h3 className="text-xl font-bold text-foreground">Morning Rise with DJ Bello</h3>
                <p className="text-sm text-muted-foreground">6:00 AM - 10:00 AM WAT</p>
              </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Link to="/listen">
                <Headphones className="w-4 h-4 mr-2" />
                Tune In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Shows */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured <span className="text-primary">Shows</span>
              </h2>
              <p className="text-muted-foreground">
                Discover our most popular programs
              </p>
            </div>
            <Button asChild variant="outline" className="border-border hover:bg-muted">
              <Link to="/shows">
                View All Shows
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-brand">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground text-sm">Live Broadcasting</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">10+</div>
              <p className="text-muted-foreground text-sm">Unique Shows</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">50K+</div>
              <p className="text-muted-foreground text-sm">Weekly Listeners</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-orange mb-2">15+</div>
              <p className="text-muted-foreground text-sm">Expert Hosts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Listen Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why <span className="text-primary">Bellbill Views</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're more than just a radio station. We're a cultural movement connecting Africa to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <Mic2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Authentic Voices</h3>
                <p className="text-muted-foreground text-sm">
                  Real conversations with real people. Unfiltered, unscripted, and unapologetically African.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-secondary/50 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition-colors">
                  <Users className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Community First</h3>
                <p className="text-muted-foreground text-sm">
                  Built by the community, for the community. Your voice matters here.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-accent/50 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/30 transition-colors">
                  <Heart className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Culture & Music</h3>
                <p className="text-muted-foreground text-sm">
                  From Afrobeats to highlife, from Amapiano to jùjú. We celebrate African music in all its forms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Partner With <span className="text-primary">Us</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join hands with Bellbill Views to reach thousands of engaged listeners across Nigeria and beyond. Whether you're a brand, artist, or organization, we have partnership opportunities tailored for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Link to="/contact">
                  Become a Partner
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-muted">
                <Link to="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
