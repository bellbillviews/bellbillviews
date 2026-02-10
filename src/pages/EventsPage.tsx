import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageAds } from "@/components/ads/PageAds";
import { useEvents } from "@/hooks/useAdminData";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { format, isPast, isFuture } from "date-fns";

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();
  const activeEvents = events?.filter(e => e.is_active) || [];
  const upcoming = activeEvents.filter(e => e.event_date && isFuture(new Date(e.event_date)));
  const past = activeEvents.filter(e => e.event_date && isPast(new Date(e.event_date)));
  const noDate = activeEvents.filter(e => !e.event_date);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-28 pb-16 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-6 animate-fade-in backdrop-blur-lg">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Events & Happenings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Upcoming <span className="text-gradient">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Join us at live shows, concerts, meetups and special broadcasts.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <PageAds placement="events" maxAds={1} />
      </div>

      {/* Events list */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted/30 backdrop-blur-lg border border-border/30 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-muted-foreground/60" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Events Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Check back soon for upcoming events and live shows!
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Upcoming */}
              {(upcoming.length > 0 || noDate.length > 0) && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Upcoming
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...upcoming, ...noDate].map((event, i) => (
                      <div
                        key={event.id}
                        className="group relative rounded-2xl overflow-hidden bg-card/20 backdrop-blur-xl border border-border/30 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {/* Glass reflection */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                        
                        {event.image_url && (
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          </div>
                        )}
                        <div className="relative p-5 space-y-3">
                          {event.event_date && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/15 backdrop-blur-lg rounded-full border border-accent/20">
                              <Clock className="w-3 h-3 text-accent" />
                              <span className="text-xs font-medium text-accent">
                                {format(new Date(event.event_date), "PPp")}
                              </span>
                            </div>
                          )}
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past events */}
              {past.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                    Past Events
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((event, i) => (
                      <div
                        key={event.id}
                        className="relative rounded-2xl overflow-hidden bg-card/10 backdrop-blur-lg border border-border/20 opacity-70 animate-fade-in"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {event.image_url && (
                          <div className="aspect-video overflow-hidden">
                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover grayscale" />
                          </div>
                        )}
                        <div className="p-5 space-y-2">
                          {event.event_date && (
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(event.event_date), "PPp")}
                            </p>
                          )}
                          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}