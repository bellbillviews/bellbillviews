import { User } from "lucide-react";
import type { Presenter } from "@/hooks/useSiteData";

interface PresenterCardProps {
  presenter: Presenter;
}

export function PresenterCard({ presenter }: PresenterCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden liquid-glass liquid-glass-hover">
      {/* Shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />
      
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-muted">
        {presenter.image_url ? (
          <img
            src={presenter.image_url}
            alt={presenter.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 via-brand-cyan/10 to-brand-pink/15">
            <User className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="relative p-4 text-center">
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
