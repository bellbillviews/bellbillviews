import { useState } from "react";
import { Clock, User, Calendar, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card
        className={cn(
          "group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-lift cursor-pointer",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {/* Image */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {show.imageUrl ? (
            <img
              src={show.imageUrl}
              alt={show.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/40">
                {show.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {show.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm">Hosted by {show.host}</span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>{show.schedule}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-accent" />
              <span>{show.time}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {show.description}
          </p>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{show.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {show.imageUrl && (
              <img
                src={show.imageUrl}
                alt={show.name}
                className="w-full rounded-lg object-cover max-h-64"
              />
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">Hosted by {show.host}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 rounded-full">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>{show.schedule}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-full">
                <Clock className="w-4 h-4 text-accent" />
                <span>{show.time}</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {show.description || "No description available."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
