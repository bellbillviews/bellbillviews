import { Link } from "react-router-dom";
import { Radio, Headphones, Users, Heart, ChevronRight, Mic2, Loader2, Calendar, Megaphone, Sparkles, Waves, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-primary/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-brand-pink/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-secondary/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Live badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full animate-fade-in liquid-glass ${broadcast?.broadcastEnabled ? "glow-primary" : ""}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${broadcast?.broadcastEnabled ? "bg-destructive animate-pulse" : "bg-muted-foreground/50"}`} />
              <span className={`text-sm font-bold tracking-wider ${broadcast?.broadcastEnabled ? "text-destructive" : "text-muted-foreground"}`}>
                {broadcast?.broadcastEnabled ? "🔴 LIVE NOW" : "OFF AIR"}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {stationName.includes(" ") ? (
                <>
                  <span className="text-foreground">{stationName.split(" ")[0]}</span>
                  <br className="md:hidden" />
                  <span className="text-gradient">{" " + stationName.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <span className="text-gradient">{stationName}</span>
              )}
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
              {stationSlogan}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-7 text-lg rounded-full glow-primary relative overflow-hidden group">
                <Link to="/listen">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Headphones className="w-5 h-5 mr-2" />
                  Listen Live
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="liquid-glass font-semibold px-10 py-7 text-lg rounded-full hover:bg-primary/10 border-primary/20">
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
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Now Playing Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-brand-cyan/3 to-brand-pink/5" />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent absolute top-0 left-0 right-0" />
        <div className="h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent absolute bottom-0 left-0 right-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl liquid-glass-strong">
            <div className="flex items-center gap-4">
              {liveOnAir?.presenterImage ? (
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-primary/30 blur-md animate-pulse" />
                  <img src={liveOnAir.presenterImage} alt={liveOnAir.presenterName || ""} className="relative w-16 h-16 rounded-full object-cover border-2 border-primary/40" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center">
                  <Radio className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <p className="text-xs text-primary uppercase tracking-[0.2em] mb-1 font-bold">On Air Now</p>
                <h3 className="text-xl font-bold text-foreground">
                  {liveOnAir?.showName || featuredShows[0]?.name || "Live Radio"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {liveOnAir?.presenterName
                    ? `with ${liveOnAir.presenterName}`
                    : featuredShows[0]?.host ? `with ${featuredShows[0].host}` : "24/7 Streaming"}
                </p>
              </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-primary relative overflow-hidden group">
              <Link to="/listen">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
                Featured <span className="text-gradient">Shows</span>
              </h2>
              <p className="text-muted-foreground">Discover our most popular programs</p>
            </div>
            <Button asChild variant="outline" className="liquid-glass rounded-xl hover:bg-primary/10 border-primary/20">
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
                  id: show.id, name: show.name, host: show.host,
                  description: show.description || "", schedule: show.schedule || "",
                  time: show.time || "", imageUrl: show.image_url || undefined,
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
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-brand-cyan/3" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our <span className="text-gradient">Presenters</span>
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

      {/* Events & Billboard */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-brand-cyan/2 to-brand-pink/3" />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent absolute top-0 left-0 right-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Events Card */}
            <div className="liquid-glass liquid-glass-hover rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Upcoming Events</h3>
                  <p className="text-sm text-muted-foreground">{activeEvents.length} events coming up</p>
                </div>
              </div>
              {activeEvents.slice(0, 2).map(event => (
                <div key={event.id} className="mb-2 p-3 liquid-glass rounded-xl">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  {event.event_date && (
                    <p className="text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="mt-2 w-full liquid-glass rounded-xl border-primary/20 hover:bg-primary/10">
                <Link to="/events">View All Events</Link>
              </Button>
            </div>

            {/* Billboard Card */}
            <div className="liquid-glass liquid-glass-hover rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Billboard Advertising</h3>
                  <p className="text-sm text-muted-foreground">Reach thousands of listeners</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Promote your brand, music, or business to our engaged audience across Africa and beyond.
              </p>
              <Button asChild size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl glow-secondary">
                <Link to="/billboard">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Explore Billboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-brand">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "24/7", label: "Live Broadcasting", color: "text-primary", icon: Radio },
              { value: `${activeShows.length || "10"}+`, label: "Unique Shows", color: "text-secondary", icon: Sparkles },
              { value: "50K+", label: "Weekly Listeners", color: "text-brand-cyan", icon: Headphones },
              { value: `${activePresenters.length || "15"}+`, label: "Expert Hosts", color: "text-brand-pink", icon: Mic2 },
            ].map((stat, i) => (
              <div key={i} className="text-center p-5 rounded-2xl liquid-glass liquid-glass-hover">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Listen Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why <span className="text-gradient">{stationName.split(" ")[0]}</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're more than just a radio station. We're a cultural movement connecting Africa to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Mic2, title: "Authentic Voices", desc: "Real conversations with real people. Unfiltered, unscripted, and unapologetically African.", color: "primary" },
              { icon: Users, title: "Community First", desc: "Built by the community, for the community. Your voice matters here.", color: "brand-cyan" },
              { icon: Heart, title: "Culture & Music", desc: "From Afrobeats to highlife, from Amapiano to jùjú. We celebrate African music in all its forms.", color: "brand-pink" },
            ].map((item, i) => (
              <div key={i} className="group liquid-glass liquid-glass-hover rounded-2xl p-6 text-center">
                <div className={`w-14 h-14 rounded-full liquid-glass flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`w-7 h-7 text-${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-brand-cyan/3 to-brand-pink/5" />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent absolute top-0 left-0 right-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Partner With <span className="text-gradient">Us</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join hands with {stationName} to reach thousands of engaged listeners across Nigeria and beyond.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-primary relative overflow-hidden group">
                <Link to="/billboard">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Megaphone className="w-5 h-5 mr-2" />
                  Advertise With Us
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="liquid-glass rounded-xl border-primary/20 hover:bg-primary/10">
                <Link to="/contact">
                  Get In Touch
                  <ChevronRight className="w-5 h-5 ml-1" />
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
