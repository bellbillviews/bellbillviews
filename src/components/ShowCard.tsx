import { useState } from "react";
import { Clock, User, Calendar, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface Show {
  id: string;
  name: string;
  host: string;
  description: string;
  schedule: string;
  time: string;
  imageUrl?: string;
}

interface ShowCardProps {
  show: Show;
  className?: string;
}

export function ShowCard({ show, className }: ShowCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "group relative rounded-2xl overflow-hidden cursor-pointer liquid-glass liquid-glass-hover",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />

        {/* Image */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {show.imageUrl ? (
            <img
              src={show.imageUrl}
              alt={show.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/15 via-brand-cyan/10 to-brand-pink/15 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/20">{show.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>

        <div className="relative p-5 space-y-3">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {show.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm">Hosted by {show.host}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {show.schedule && (
              <div className="flex items-center gap-1 px-2.5 py-1 liquid-glass rounded-full">
                <Calendar className="w-3 h-3 text-secondary" />
                <span className="text-xs">{show.schedule}</span>
              </div>
            )}
            {show.time && (
              <div className="flex items-center gap-1 px-2.5 py-1 liquid-glass rounded-full">
                <Clock className="w-3 h-3 text-brand-cyan" />
                <span className="text-xs">{show.time}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{show.description}</p>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto liquid-glass-strong rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{show.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {show.imageUrl && (
              <img src={show.imageUrl} alt={show.name} className="w-full rounded-xl object-cover max-h-64" />
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">Hosted by {show.host}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {show.schedule && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 liquid-glass rounded-full">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>{show.schedule}</span>
                </div>
              )}
              {show.time && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 liquid-glass rounded-full">
                  <Clock className="w-4 h-4 text-brand-cyan" />
                  <span>{show.time}</span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">{show.description || "No description available."}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
