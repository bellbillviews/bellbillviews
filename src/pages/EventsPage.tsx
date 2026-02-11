import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageAds } from "@/components/ads/PageAds";
import { useEvents } from "@/hooks/useAdminData";
import { Calendar, Clock, Loader2 } from "lucide-react";
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
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/12 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-cyan/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 liquid-glass rounded-full mb-6 animate-fade-in">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary tracking-wider">Events & Happenings</span>
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
              <div className="w-20 h-20 rounded-full liquid-glass flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-muted-foreground/40" />
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
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Upcoming
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...upcoming, ...noDate].map((event, i) => (
                      <div
                        key={event.id}
                        className="group liquid-glass liquid-glass-hover rounded-2xl overflow-hidden animate-fade-in"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {/* Shimmer */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />
                        
                        {event.image_url && (
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                          </div>
                        )}
                        <div className="relative p-5 space-y-3">
                          {event.event_date && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 liquid-glass rounded-full">
                              <Clock className="w-3 h-3 text-brand-cyan" />
                              <span className="text-xs font-medium text-brand-cyan">
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
                        className="rounded-2xl overflow-hidden liquid-glass opacity-60 animate-fade-in"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {event.image_url && (
                          <div className="aspect-video overflow-hidden">
                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover grayscale" />
                          </div>
                        )}
                        <div className="p-5 space-y-2">
                          {event.event_date && (
                            <p className="text-xs text-muted-foreground">{format(new Date(event.event_date), "PPp")}</p>
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
