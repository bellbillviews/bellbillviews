import { Link } from "react-router-dom";
import { Radio, Headphones, Users, Heart, ChevronRight, Mic2, Loader2, Calendar, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DynamicSocialLinks } from "@/components/DynamicSocialLinks";
import { ShowCard } from "@/components/ShowCard";
import { PresenterCard } from "@/components/PresenterCard";
import { PageAds } from "@/components/ads/PageAds";
import { useShows, usePresenters, useEvents } from "@/hooks/useAdminData";
import { useSiteSettings } from "@/hooks/useSiteData";
import { useLiveOnAir } from "@/hooks/useLiveOnAir";
import { useBroadcastSettings } from "@/hooks/useBroadcastSettings";

export default function HomePage() {
  const { data: shows, isLoading: showsLoading } = useShows();
  const { data: presenters, isLoading: presentersLoading } = usePresenters();
  const { data: events } = useEvents();
  const { data: settings } = useSiteSettings();
  const { data: liveOnAir } = useLiveOnAir();
  const { data: broadcast } = useBroadcastSettings();

  const activeShows = shows?.filter(show => show.is_active) || [];
  const activePresenters = presenters?.filter(p => p.is_active) || [];
  const activeEvents = events?.filter(e => e.is_active) || [];
  const featuredShows = activeShows.slice(0, 3);
  const featuredPresenters = activePresenters.slice(0, 4);

  const getSetting = (key: string) => settings?.find(s => s.setting_key === key)?.setting_value || "";
  const stationName = getSetting("station_name") || "Bellbill Views";
  const stationSlogan = getSetting("station_slogan") || "The Sound of Culture, Voice, and Music";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full animate-fade-in ${broadcast?.broadcastEnabled ? "bg-accent/20 border border-accent/30" : "bg-muted/50 border border-border"}`}>
              <span className={`w-2 h-2 rounded-full ${broadcast?.broadcastEnabled ? "bg-accent animate-pulse" : "bg-muted-foreground/50"}`} />
              <span className={`text-sm font-medium ${broadcast?.broadcastEnabled ? "text-accent" : "text-muted-foreground"}`}>{broadcast?.broadcastEnabled ? "🔴 Live Now" : "Off Air"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {stationName.includes(" ") ? (
                <>
                  {stationName.split(" ")[0]}<span className="text-gradient">{stationName.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <span className="text-gradient">{stationName}</span>
              )}
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {stationSlogan}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full animate-pulse-glow">
                <Link to="/listen">
                  <Headphones className="w-5 h-5 mr-2" />
                  Listen Live
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-muted font-semibold px-8 py-6 text-lg rounded-full">
                <Link to="/shows">
                  View Programs
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <AudioPlayer size="compact" />
            </div>

            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <DynamicSocialLinks iconSize="lg" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Now Playing Section with live presenter info */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {liveOnAir?.presenterImage ? (
                <img src={liveOnAir.presenterImage} alt={liveOnAir.presenterName || ""} className="w-16 h-16 rounded-full object-cover border-2 border-primary/40" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Radio className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">On Air Now</p>
                <h3 className="text-xl font-bold text-foreground">
                  {liveOnAir?.showName || featuredShows[0]?.name || "Live Radio"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {liveOnAir?.presenterName
                    ? `with ${liveOnAir.presenterName}`
                    : featuredShows[0]?.host
                      ? `with ${featuredShows[0].host}`
                      : "24/7 Streaming"}
                </p>
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

      {/* Homepage Ads */}
      <div className="container mx-auto px-4 py-6">
        <PageAds placement="homepage" maxAds={2} />
      </div>

      {/* Featured Shows */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured <span className="text-primary">Shows</span>
              </h2>
              <p className="text-muted-foreground">Discover our most popular programs</p>
            </div>
            <Button asChild variant="outline" className="border-border hover:bg-muted">
              <Link to="/shows">
                View All Shows
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {showsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : featuredShows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredShows.map((show) => (
                <ShowCard key={show.id} show={{
                  id: show.id,
                  name: show.name,
                  host: show.host,
                  description: show.description || "",
                  schedule: show.schedule || "",
                  time: show.time || "",
                  imageUrl: show.image_url || undefined,
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No shows available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Presenters Section */}
      {featuredPresenters.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our <span className="text-primary">Presenters</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The voices behind your favorite shows</p>
            </div>
            {presentersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPresenters.map((presenter) => (
                  <PresenterCard key={presenter.id} presenter={presenter} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Events & Billboard Quick Links */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Events Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Upcoming Events</h3>
                    <p className="text-sm text-muted-foreground">{activeEvents.length} events coming up</p>
                  </div>
                </div>
                {activeEvents.slice(0, 2).map(event => (
                  <div key={event.id} className="mb-2 p-2 bg-card/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    {event.event_date && (
                      <p className="text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                  <Link to="/about">View All Events</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Billboard Card */}
            <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20 hover:border-accent/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Billboard Advertising</h3>
                    <p className="text-sm text-muted-foreground">Reach thousands of listeners</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Promote your brand, music, or business to our engaged audience across Africa and beyond.
                </p>
                <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/billboard">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Explore Billboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">{activeShows.length || "10"}+</div>
              <p className="text-muted-foreground text-sm">Unique Shows</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">50K+</div>
              <p className="text-muted-foreground text-sm">Weekly Listeners</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">{activePresenters.length || "15"}+</div>
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
              Why <span className="text-primary">{stationName.split(" ")[0]}</span>?
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
              Join hands with {stationName} to reach thousands of engaged listeners across Nigeria and beyond.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Link to="/contact">Become a Partner</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-muted">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
