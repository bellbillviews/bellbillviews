import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Presenter } from "@/hooks/useSiteData";

interface PresenterCardProps {
  presenter: Presenter;
}

export function PresenterCard({ presenter }: PresenterCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          {presenter.image_url ? (
            <img
              src={presenter.image_url}
              alt={presenter.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <User className="w-16 h-16 text-muted-foreground/50" />
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="p-4 text-center">
          <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
            {presenter.name}
          </h3>
          {presenter.bio && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {presenter.bio}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
