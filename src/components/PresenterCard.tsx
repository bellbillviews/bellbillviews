import { User } from "lucide-react";
import type { Presenter } from "@/hooks/useSiteData";

interface PresenterCardProps {
  presenter: Presenter;
}

export function PresenterCard({ presenter }: PresenterCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-card/20 backdrop-blur-xl border border-border/30 shadow-lg hover:border-primary/30 hover:shadow-[0_10px_40px_hsl(var(--primary)/0.15)]">
      {/* Glass reflection */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-10" />
      
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-muted">
        {presenter.image_url ? (
          <img
            src={presenter.image_url}
            alt={presenter.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 via-card/30 to-secondary/15 backdrop-blur-sm">
            <User className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="relative p-4 text-center z-10">
        <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
          {presenter.name}
        </h3>
        {presenter.bio && (
          <p className="text-muted-foreground text-sm line-clamp-2">{presenter.bio}</p>
        )}
      </div>
    </div>
  );
}