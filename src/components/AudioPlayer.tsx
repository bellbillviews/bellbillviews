import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Loader2, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useStreamUrl } from "@/hooks/useStreamUrl";
import { useLiveOnAir } from "@/hooks/useLiveOnAir";

interface AudioPlayerProps {
  streamUrl?: string;
  size?: "compact" | "large";
  showNowPlaying?: boolean;
  className?: string;
}

export function AudioPlayer({
  streamUrl: propStreamUrl,
  size = "compact",
  showNowPlaying = true,
  className,
}: AudioPlayerProps) {
  const { data: dbStreamUrl } = useStreamUrl();
  const streamUrl = propStreamUrl || dbStreamUrl || "";
  const { data: liveOnAir } = useLiveOnAir();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (!streamUrl) {
      setError("Stream not available. Coming soon!");
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
        setError("Unable to play stream. Please try again.");
        console.error("Playback error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (value[0] > 0 && isMuted) setIsMuted(false);
  };

  if (size === "large") {
    return (
      <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
        <audio ref={audioRef} src={streamUrl} preload="none" />
        
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {/* Background glow effects */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/10 to-accent/20 blur-xl" />
            <div className={cn(
              "absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl transition-all duration-1000",
              isPlaying ? "bg-primary/40 animate-pulse" : "bg-primary/15"
            )} />
            <div className={cn(
              "absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl transition-all duration-1000",
              isPlaying ? "bg-accent/30 animate-pulse" : "bg-accent/10"
            )} style={{ animationDelay: "0.5s" }} />
          
            {/* Glass panel */}
            <div className="absolute inset-0 bg-card/30 backdrop-blur-2xl border border-border/50 rounded-3xl flex flex-col items-center justify-center p-6">
              {/* Inner glass reflection */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/0 pointer-events-none" />
              
              {/* Live Badge */}
              <div className="mb-4">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500",
                  isPlaying
                    ? "bg-accent/20 border-accent/40 shadow-[0_0_20px_hsl(var(--accent)/0.3)]"
                    : "bg-muted/30 border-border/50"
                )}>
                  <span className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    isPlaying ? "bg-accent animate-pulse" : "bg-muted-foreground/50"
                  )} />
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-widest",
                    isPlaying ? "text-accent" : "text-muted-foreground"
                  )}>
                    {isPlaying ? "On Air" : "Off Air"}
                  </span>
                </div>
              </div>

              {/* Radio Dial */}
              <div className="mb-4">
                <div className={cn(
                  "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-700",
                  isPlaying && "shadow-[0_0_60px_hsl(var(--primary)/0.5)]"
                )}>
                  <div className={cn(
                    "absolute inset-0 rounded-full border-2 transition-all duration-500",
                    isPlaying ? "border-primary/60 animate-[spin_8s_linear_infinite]" : "border-border/40"
                  )} style={{ borderStyle: "dashed" }} />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 via-card/60 to-primary/10 backdrop-blur-lg border border-primary/20" />
                  {liveOnAir?.presenterImage && isPlaying ? (
                    <img src={liveOnAir.presenterImage} alt={liveOnAir.presenterName || "Presenter"} className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-primary/40" />
                  ) : (
                    <Radio className={cn("relative w-10 h-10 transition-colors duration-500", isPlaying ? "text-primary" : "text-muted-foreground")} />
                  )}
                </div>
              </div>

              {/* Now Playing Info */}
              <div className="text-center mb-3 space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">{liveOnAir?.showName || "Live Radio"}</h2>
                {liveOnAir?.presenterName && (
                  <p className="text-sm text-primary font-medium flex items-center justify-center gap-1.5">
                    <Mic2 className="w-3.5 h-3.5" />{liveOnAir.presenterName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{isPlaying ? "Streaming Live" : "Press play to start listening"}</p>
              </div>

              {/* Sound Wave */}
              {isPlaying && (
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-1 rounded-full animate-sound-wave" style={{ animationDelay: `${i * 0.08}s`, background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent)))` }} />
                  ))}
                </div>
              )}

              {/* Play Button */}
              <div className="mb-4">
                <Button onClick={togglePlay} size="lg" className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-500 border-0",
                  isPlaying
                    ? "bg-accent/80 hover:bg-accent/90 backdrop-blur shadow-[0_0_30px_hsl(var(--accent)/0.5)]"
                    : "bg-primary/80 hover:bg-primary/90 backdrop-blur shadow-[0_0_30px_hsl(var(--primary)/0.5)] animate-pulse-glow"
                )} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4 w-full max-w-xs px-4 py-2.5 bg-card/30 backdrop-blur-lg rounded-2xl border border-border/30">
                <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
                  {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <Slider value={isMuted ? [0] : volume} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
                <span className="text-sm text-muted-foreground w-8 text-right">{isMuted ? 0 : volume[0]}%</span>
              </div>

              {error && <p className="text-center text-accent text-sm mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact size - also 16:9 aspect
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-card/40 to-accent/10 blur-sm" />
        <div className="relative bg-card/30 backdrop-blur-2xl border border-border/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
          <audio ref={audioRef} src={streamUrl} preload="none" />

          <Button onClick={togglePlay} size="icon" className={cn(
            "w-12 h-12 rounded-full flex-shrink-0 transition-all duration-300 border-0",
            isPlaying
              ? "bg-accent/70 hover:bg-accent/90 backdrop-blur shadow-[0_0_15px_hsl(var(--accent)/0.4)]"
              : "bg-primary/70 hover:bg-primary/90 backdrop-blur shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
          )} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{liveOnAir?.showName || "Live Radio"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {isPlaying ? (liveOnAir?.presenterName ? `🎙 ${liveOnAir.presenterName}` : "Now Playing") : "Click to listen"}
            </p>
          </div>

          {isPlaying && (
            <div className="hidden sm:flex items-center gap-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-0.5 rounded-full animate-sound-wave" style={{ animationDelay: `${i * 0.1}s`, background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent)))` }} />
              ))}
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
              {isMuted || volume[0] === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <Slider value={isMuted ? [0] : volume} onValueChange={handleVolumeChange} max={100} step={1} className="w-20" />
          </div>

          {error && <p className="text-xs text-accent">{error}</p>}
        </div>
      </div>
    </div>
  );
}
