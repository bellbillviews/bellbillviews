import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Mic2, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";
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

  // Post message to YouTube iframe
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
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 blur-xl" />
          <div className="relative bg-card/20 backdrop-blur-2xl border border-border/30 rounded-3xl p-8 shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="relative flex flex-col items-center gap-6 py-8">
              <div className="w-24 h-24 rounded-full bg-muted/30 backdrop-blur-lg border border-border/30 flex items-center justify-center">
                <Radio className="w-12 h-12 text-muted-foreground/60" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-foreground/80">Station Offline</p>
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                  {offlineMessage}
                </p>
              </div>
              {/* Subtle equalizer bars */}
              <div className="flex items-end gap-1 h-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-muted-foreground/20"
                    style={{ height: `${6 + Math.random() * 12}px` }}
                  />
                ))}
              </div>
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
      {/* Outer glow */}
      <div className={cn(
        "absolute -inset-6 rounded-[2rem] blur-3xl pointer-events-none transition-all duration-1000",
        isPlaying
          ? "bg-gradient-to-br from-primary/30 via-accent/15 to-primary/20"
          : "bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
      )} />

      {/* Main glass container */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Glass panel */}
        <div className="relative bg-card/15 backdrop-blur-2xl border border-border/30 rounded-3xl shadow-2xl overflow-hidden">
          {/* Inner glass reflection */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/3 pointer-events-none z-10" />

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

          {/* Custom Player UI (shown when video is hidden) */}
          {!showVideo && (
            <div className="relative z-20 p-6 sm:p-8">
              {/* Live Badge */}
              <div className="flex justify-center mb-6">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-lg transition-all duration-500",
                  isPlaying
                    ? "bg-destructive/20 border-destructive/40 shadow-[0_0_20px_hsl(0_84%_60%/0.3)]"
                    : "bg-muted/20 border-border/40"
                )}>
                  <span className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    isPlaying ? "bg-destructive animate-pulse" : "bg-muted-foreground/50"
                  )} />
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-widest",
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
                  isPlaying
                    ? "shadow-[0_0_60px_hsl(var(--primary)/0.5),0_0_120px_hsl(var(--primary)/0.15)]"
                    : "shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
                )}>
                  {/* Spinning outer ring */}
                  <div className={cn(
                    "absolute inset-0 rounded-full border-2 border-dashed transition-all duration-500",
                    isPlaying ? "border-primary/50 animate-[spin_10s_linear_infinite]" : "border-border/30"
                  )} />
                  {/* Second ring */}
                  <div className={cn(
                    "absolute inset-2 rounded-full border transition-all duration-500",
                    isPlaying ? "border-accent/30" : "border-border/20"
                  )} />
                  {/* Inner glass circle */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/15 via-card/40 to-accent/10 backdrop-blur-xl border border-primary/15" />
                  {/* Presenter image or icon */}
                  {liveOnAir?.presenterImage && isPlaying ? (
                    <img
                      src={liveOnAir.presenterImage}
                      alt={liveOnAir.presenterName || "Presenter"}
                      className="relative w-20 h-20 rounded-full object-cover border-2 border-primary/30 shadow-lg"
                    />
                  ) : (
                    <Radio className={cn(
                      "relative w-12 h-12 transition-all duration-500",
                      isPlaying ? "text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]" : "text-muted-foreground/60"
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
                        background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent)))`,
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
                      ? "bg-accent/80 hover:bg-accent/90 shadow-[0_0_40px_hsl(var(--accent)/0.5)]"
                      : "bg-primary/80 hover:bg-primary/90 shadow-[0_0_40px_hsl(var(--primary)/0.5)] animate-pulse-glow"
                  )}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                  {isPlaying ? (
                    <Pause className="w-10 h-10 relative z-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1 relative z-10" />
                  )}
                </Button>
              </div>

              {/* Volume & Controls */}
              <div className="flex items-center gap-3 px-4 py-3 bg-card/20 backdrop-blur-xl rounded-2xl border border-border/20">
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
                <div className="w-px h-5 bg-border/30" />
                <button
                  onClick={() => setShowVideo(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
                  className="w-10 h-10 rounded-full bg-card/30 backdrop-blur-lg border border-border/20 hover:bg-card/50"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                {/* Live badge */}
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

                <button
                  onClick={() => setShowVideo(false)}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                  title="Audio only"
                >
                  <EyeOff className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                  title="Fullscreen"
                >
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