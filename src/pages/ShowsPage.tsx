import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ShowCard } from "@/components/ShowCard";
import { PageAds } from "@/components/ads/PageAds";
import { useShows } from "@/hooks/useAdminData";
import { Radio, Loader2 } from "lucide-react";

export default function ShowsPage() {
  const { data: shows, isLoading } = useShows();
  const activeShows = shows?.filter(show => show.is_active) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-28 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-6 animate-fade-in">
              <Radio className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Programs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Radio <span className="text-gradient">Shows</span>
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Discover our lineup of engaging programs.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <PageAds placement="shows" maxAds={1} />
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeShows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeShows.map((show, index) => (
                <div key={show.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ShowCard show={{
                    id: show.id,
                    name: show.name,
                    host: show.host,
                    description: show.description || "",
                    schedule: show.schedule || "",
                    time: show.time || "",
                    imageUrl: show.image_url || undefined,
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Radio className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Shows Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're preparing an exciting lineup of shows for you.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">Programming Schedule</h3>
            <p className="text-muted-foreground">
              All times are displayed in West Africa Time (WAT). Want to be a guest? <a href="/contact" className="text-primary hover:underline">Contact us</a>!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
