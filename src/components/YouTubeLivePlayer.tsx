import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Mic2, Eye, EyeOff, Maximize2, Minimize2, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLiveOnAir } from "@/hooks/useLiveOnAir";

interface YouTubeLivePlayerProps {
  videoId: string;
  autoplay?: boolean;
  isLive?: boolean;
  offlineMessage?: string;
  className?: string;
}

function extractVideoId(input: string): string {
  if (!input) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input.trim();
}

export function YouTubeLivePlayer({
  videoId,
  autoplay = false,
  isLive = true,
  offlineMessage = "We are currently offline. Check back soon!",
  className,
}: YouTubeLivePlayerProps) {
  const id = extractVideoId(videoId);
  const { data: liveOnAir } = useLiveOnAir();
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(autoplay);
  const [showVideo, setShowVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const postMessage = useCallback((data: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(data), "*");
  }, []);

  useEffect(() => {
    if (!id || !isLive) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "onStateChange") {
          setIsPlaying(data.info === 1);
        }
      } catch { /* ignore */ }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [id, isLive]);

  const togglePlay = () => {
    if (isPlaying) {
      postMessage({ event: "command", func: "pauseVideo" });
      setIsPlaying(false);
    } else {
      postMessage({ event: "command", func: "playVideo" });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      postMessage({ event: "command", func: "unMute" });
      setIsMuted(false);
    } else {
      postMessage({ event: "command", func: "mute" });
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (val: number[]) => {
    setVolume(val);
    postMessage({ event: "command", func: "setVolume", args: [val[0]] });
    if (val[0] > 0 && isMuted) {
      postMessage({ event: "command", func: "unMute" });
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Offline state
  if (!isLive || !id) {
    return (
      <div className={cn("relative max-w-lg mx-auto", className)}>
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-brand-cyan/5 to-brand-pink/10 blur-2xl pointer-events-none" />
        <div className="relative liquid-glass-strong rounded-3xl p-8">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-brand-cyan/5 pointer-events-none" />
          <div className="relative flex flex-col items-center gap-6 py-8">
            <div className="w-24 h-24 rounded-full liquid-glass flex items-center justify-center">
              <Radio className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground/80">Station Offline</p>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{offlineMessage}</p>
            </div>
            <div className="flex items-end gap-1 h-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 rounded-full bg-muted-foreground/15" style={{ height: `${6 + Math.random() * 12}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${id}?${new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: autoplay ? "1" : "0",
    controls: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    enablejsapi: "1",
    origin: window.location.origin,
    showinfo: "0",
    iv_load_policy: "3",
  }).toString()}`;

  return (
    <div ref={containerRef} className={cn("relative max-w-lg mx-auto", className)}>
      {/* Multi-color outer glow */}
      <div className={cn(
        "absolute -inset-6 rounded-[2.5rem] blur-3xl pointer-events-none transition-all duration-1000",
        isPlaying
          ? "bg-gradient-to-br from-primary/35 via-brand-cyan/20 to-brand-pink/25 animate-pulse-slow"
          : "bg-gradient-to-br from-primary/10 via-transparent to-brand-cyan/8"
      )} />

      {/* Main glass container */}
      <div className="relative rounded-3xl overflow-hidden">
        <div className="relative liquid-glass-strong rounded-3xl overflow-hidden">
          {/* Liquid shimmer */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/8 via-transparent to-brand-cyan/6 pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />

          {/* Hidden/visible YouTube iframe */}
          <div className={cn(
            "transition-all duration-500 relative",
            showVideo ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
          )}>
            <AspectRatio ratio={16 / 9}>
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title="Live Broadcast"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </AspectRatio>
          </div>

          {/* Custom Player UI (audio mode) */}
          {!showVideo && (
            <div className="relative z-20 p-6 sm:p-8">
              {/* Live Badge */}
              <div className="flex justify-center mb-6">
                <div className={cn(
                  "inline-flex items-center gap-2 px-5 py-2 rounded-full liquid-glass transition-all duration-500",
                  isPlaying && "glow-primary"
                )}>
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors",
                    isPlaying ? "bg-destructive animate-pulse" : "bg-muted-foreground/50"
                  )} />
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-[0.2em]",
                    isPlaying ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {isPlaying ? "🔴 Live" : "Ready"}
                  </span>
                </div>
              </div>

              {/* Radio Dial */}
              <div className="flex justify-center mb-6">
                <div className={cn(
                  "relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-700",
                  isPlaying && "glow-primary"
                )}>
                  {/* Spinning outer ring */}
                  <div className={cn(
                    "absolute inset-0 rounded-full border-2 border-dashed transition-all duration-500",
                    isPlaying ? "border-primary/50 animate-[spin_10s_linear_infinite]" : "border-border/20"
                  )} />
                  {/* Second ring */}
                  <div className={cn(
                    "absolute inset-2 rounded-full border transition-all duration-500",
                    isPlaying ? "border-brand-cyan/30" : "border-border/10"
                  )} />
                  {/* Inner glass circle */}
                  <div className="absolute inset-4 rounded-full liquid-glass" />
                  {/* Presenter image or icon */}
                  {liveOnAir?.presenterImage && isPlaying ? (
                    <img
                      src={liveOnAir.presenterImage}
                      alt={liveOnAir.presenterName || "Presenter"}
                      className="relative w-20 h-20 rounded-full object-cover border-2 border-primary/40 shadow-lg"
                    />
                  ) : (
                    <Radio className={cn(
                      "relative w-12 h-12 transition-all duration-500",
                      isPlaying ? "text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]" : "text-muted-foreground/40"
                    )} />
                  )}
                </div>
              </div>

              {/* Now Playing Info */}
              <div className="text-center mb-5 space-y-1.5">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {liveOnAir?.showName || "Live Radio"}
                </h2>
                {liveOnAir?.presenterName && (
                  <p className="text-sm text-primary font-medium flex items-center justify-center gap-1.5">
                    <Mic2 className="w-3.5 h-3.5" />
                    {liveOnAir.presenterName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {isPlaying ? "Streaming Live" : "Press play to start listening"}
                </p>
              </div>

              {/* Sound Wave Animation */}
              {isPlaying && (
                <div className="flex items-center justify-center gap-1 mb-5">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full animate-sound-wave"
                      style={{
                        animationDelay: `${i * 0.07}s`,
                        background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--brand-cyan)))`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Play Button */}
              <div className="flex justify-center mb-5">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className={cn(
                    "w-20 h-20 rounded-full transition-all duration-500 border-0 relative overflow-hidden",
                    isPlaying
                      ? "bg-brand-cyan/80 hover:bg-brand-cyan/90 glow-cyan"
                      : "bg-primary/80 hover:bg-primary/90 glow-primary animate-pulse-glow"
                  )}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                  {isPlaying ? (
                    <Pause className="w-10 h-10 relative z-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1 relative z-10" />
                  )}
                </Button>
              </div>

              {/* Volume & Controls */}
              <div className="flex items-center gap-3 px-4 py-3 liquid-glass rounded-2xl">
                <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
                  {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8 text-right font-mono">
                  {isMuted ? 0 : volume[0]}
                </span>
                <div className="w-px h-5 bg-primary/15" />
                <button
                  onClick={() => setShowVideo(true)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Show video"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Video mode overlay controls */}
          {showVideo && (
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
              <div className="flex items-center gap-3">
                <Button
                  onClick={togglePlay}
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 rounded-full liquid-glass hover:bg-primary/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                <div className="flex items-center gap-1.5 px-2 py-1 bg-destructive/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  <span className="text-[10px] font-bold text-destructive uppercase">Live</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {liveOnAir?.showName || "Live Broadcast"}
                  </p>
                  {liveOnAir?.presenterName && (
                    <p className="text-xs text-muted-foreground truncate">with {liveOnAir.presenterName}</p>
                  )}
                </div>

                <button onClick={toggleMute} className="text-foreground/70 hover:text-foreground transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button onClick={() => setShowVideo(false)} className="text-foreground/70 hover:text-foreground transition-colors" title="Audio only">
                  <EyeOff className="w-4 h-4" />
                </button>

                <button onClick={toggleFullscreen} className="text-foreground/70 hover:text-foreground transition-colors" title="Fullscreen">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
