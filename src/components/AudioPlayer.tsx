import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  streamUrl?: string;
  size?: "compact" | "large";
  showNowPlaying?: boolean;
  className?: string;
}

// Placeholder stream URL - replace with actual stream when available
const PLACEHOLDER_STREAM = "";

export function AudioPlayer({
  streamUrl = PLACEHOLDER_STREAM,
  size = "compact",
  showNowPlaying = true,
  className,
}: AudioPlayerProps) {
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  if (size === "large") {
    return (
      <div
        className={cn(
          "bg-card border border-border rounded-2xl p-8 max-w-md mx-auto",
          className
        )}
      >
        <audio ref={audioRef} src={streamUrl} preload="none" />

        {/* Station Branding */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Radio className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Bellbill Views</h2>
          <p className="text-muted-foreground mt-1">Live Radio</p>
        </div>

        {/* Play Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={togglePlay}
            size="lg"
            className={cn(
              "w-20 h-20 rounded-full transition-all duration-300",
              isPlaying
                ? "bg-accent hover:bg-accent/90"
                : "bg-primary hover:bg-primary/90 animate-pulse-glow"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-10 h-10" />
            ) : (
              <Play className="w-10 h-10 ml-1" />
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-4 px-4">
          <button
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMuted || volume[0] === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <Slider
            value={isMuted ? [0] : volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-8">
            {isMuted ? 0 : volume[0]}%
          </span>
        </div>

        {/* Now Playing */}
        {showNowPlaying && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Now Playing
            </p>
            <p className="text-sm text-foreground font-medium">
              {isPlaying ? "Live Broadcast" : "Press play to start listening"}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-center text-accent text-sm mt-4">{error}</p>
        )}

        {/* Sound Wave Animation */}
        {isPlaying && (
          <div className="flex items-center justify-center gap-1 mt-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-sound-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Compact size (default)
  return (
    <div
      className={cn(
        "bg-card/50 backdrop-blur-lg border border-border rounded-xl p-4 flex items-center gap-4",
        className
      )}
    >
      <audio ref={audioRef} src={streamUrl} preload="none" />

      {/* Play Button */}
      <Button
        onClick={togglePlay}
        size="icon"
        className={cn(
          "w-12 h-12 rounded-full flex-shrink-0 transition-all duration-300",
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

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          Bellbill Views Live
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {isPlaying ? "Now Playing" : "Click to listen"}
        </p>
      </div>

      {/* Sound Wave Animation */}
      {isPlaying && (
        <div className="hidden sm:flex items-center gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-primary rounded-full animate-sound-wave"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Volume Control */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted || volume[0] === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <Slider
          value={isMuted ? [0] : volume}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="w-20"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-accent">{error}</p>
      )}
    </div>
  );
}
