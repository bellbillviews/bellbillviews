import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, X, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyPlayerProps {
  streamUrl?: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export function StickyPlayer({ streamUrl = "", isVisible = true, onClose }: StickyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (!streamUrl) {
      setError("Stream coming soon!");
      return;
    }

    setError(null);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        setError("Unable to play");
        console.error("Playback error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <audio ref={audioRef} src={streamUrl} preload="none" />
      
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Radio Icon */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Radio className="w-5 h-5 text-primary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            Bellbill Views
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {error || (isPlaying ? "Live Now" : "Tap to listen")}
          </p>
        </div>

        {/* Sound Wave Animation */}
        {isPlaying && (
          <div className="flex items-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-primary rounded-full animate-sound-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        {/* Play Button */}
        <Button
          onClick={togglePlay}
          size="icon"
          className={cn(
            "w-10 h-10 rounded-full",
            isPlaying
              ? "bg-accent hover:bg-accent/90"
              : "bg-primary hover:bg-primary/90"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
