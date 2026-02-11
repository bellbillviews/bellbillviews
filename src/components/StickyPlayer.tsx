import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, X, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStreamUrl } from "@/hooks/useStreamUrl";
import { useLiveOnAir } from "@/hooks/useLiveOnAir";

interface StickyPlayerProps {
  streamUrl?: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export function StickyPlayer({ streamUrl: propStreamUrl, isVisible = true, onClose }: StickyPlayerProps) {
  const { data: dbStreamUrl } = useStreamUrl();
  const streamUrl = propStreamUrl || dbStreamUrl || "";
  const { data: liveOnAir } = useLiveOnAir();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (!streamUrl) { setError("Stream coming soon!"); return; }
    setError(null);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try { await audioRef.current.play(); setIsPlaying(true); }
      catch (err) { setError("Unable to play"); console.error("Playback error:", err); }
      finally { setIsLoading(false); }
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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Top glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="liquid-glass-strong safe-area-bottom">
        <audio ref={audioRef} src={streamUrl} preload="none" />
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Presenter avatar or icon */}
          <div className="relative flex-shrink-0">
            {isPlaying && <div className="absolute -inset-1 rounded-full bg-primary/30 blur-md animate-pulse" />}
            <div className="relative w-10 h-10 rounded-full liquid-glass flex items-center justify-center overflow-hidden">
              {liveOnAir?.presenterImage ? (
                <img src={liveOnAir.presenterImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <Radio className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {liveOnAir?.showName || "Live Radio"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {error || (isPlaying ? (liveOnAir?.presenterName ? `🎙 ${liveOnAir.presenterName}` : "Live Now") : "Tap to listen")}
            </p>
          </div>

          {/* Sound Wave */}
          {isPlaying && (
            <div className="flex items-center gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full animate-sound-wave"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--brand-cyan)))`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Mute */}
          <button onClick={toggleMute} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Play */}
          <Button
            onClick={togglePlay}
            size="icon"
            className={cn(
              "w-10 h-10 rounded-full border-0 relative overflow-hidden",
              isPlaying
                ? "bg-brand-cyan/80 hover:bg-brand-cyan/90 glow-cyan"
                : "bg-primary/80 hover:bg-primary/90 glow-primary"
            )}
            disabled={isLoading}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          {onClose && (
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
