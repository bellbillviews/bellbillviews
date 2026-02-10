import { useState } from "react";
import { Clock, User, Calendar } from "lucide-react";
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
          "group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1",
          "bg-card/20 backdrop-blur-xl border border-border/30 shadow-lg",
          "hover:border-primary/30 hover:shadow-[0_10px_40px_hsl(var(--primary)/0.15)]",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {/* Glass reflection */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-10" />

        {/* Image */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {show.imageUrl ? (
            <img
              src={show.imageUrl}
              alt={show.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/15 via-card/30 to-accent/15 flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl font-bold text-primary/30">{show.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <div className="relative p-4 space-y-3 z-10">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {show.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm">Hosted by {show.host}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {show.schedule && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary/10 backdrop-blur-lg rounded-full border border-secondary/20">
                <Calendar className="w-3 h-3 text-secondary" />
                <span className="text-xs">{show.schedule}</span>
              </div>
            )}
            {show.time && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 backdrop-blur-lg rounded-full border border-accent/20">
                <Clock className="w-3 h-3 text-accent" />
                <span className="text-xs">{show.time}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{show.description}</p>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-2xl border border-border/30">
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
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 backdrop-blur-lg rounded-full border border-secondary/20">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>{show.schedule}</span>
                </div>
              )}
              {show.time && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 backdrop-blur-lg rounded-full border border-accent/20">
                  <Clock className="w-4 h-4 text-accent" />
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