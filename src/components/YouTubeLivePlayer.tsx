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
  for (const p of patterns) { const m = input.match(p); if (m) return m[1]; }
  return input.trim();
}

export function YouTubeLivePlayer({ videoId, autoplay = false, isLive = true, offlineMessage = "We are currently offline. Check back soon!", className }: YouTubeLivePlayerProps) {
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
    const handler = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      try { const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data; if (data.event === "onStateChange") setIsPlaying(data.info === 1); } catch {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [id, isLive]);

  const togglePlay = () => {
    if (isPlaying) { postMessage({ event: "command", func: "pauseVideo" }); setIsPlaying(false); }
    else { postMessage({ event: "command", func: "playVideo" }); setIsPlaying(true); }
  };

  const toggleMute = () => {
    if (isMuted) { postMessage({ event: "command", func: "unMute" }); setIsMuted(false); }
    else { postMessage({ event: "command", func: "mute" }); setIsMuted(true); }
  };

  const handleVolumeChange = (val: number[]) => {
    setVolume(val);
    postMessage({ event: "command", func: "setVolume", args: [val[0]] });
    if (val[0] > 0 && isMuted) { postMessage({ event: "command", func: "unMute" }); setIsMuted(false); }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) { containerRef.current.requestFullscreen?.(); setIsFullscreen(true); }
    else { document.exitFullscreen?.(); setIsFullscreen(false); }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!isLive || !id) {
    return (
      <div className={cn("relative max-w-lg mx-auto", className)}>
        <div className="relative glass-dark rounded-3xl p-8 border border-white/10">
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Radio className="w-12 h-12 text-white/20" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-white/80 font-display">Station Offline</p>
              <p className="text-white/40 text-sm max-w-sm leading-relaxed">{offlineMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${id}?${new URLSearchParams({
    autoplay: autoplay ? "1" : "0", mute: autoplay ? "1" : "0",
    controls: "0", modestbranding: "1", rel: "0", playsinline: "1",
    enablejsapi: "1", origin: window.location.origin, showinfo: "0", iv_load_policy: "3",
  }).toString()}`;

  return (
    <div ref={containerRef} className={cn("relative max-w-lg mx-auto", className)}>
      <div className={cn("absolute -inset-4 rounded-[2rem] blur-2xl pointer-events-none transition-all duration-1000",
        isPlaying ? "bg-primary/15 animate-pulse-slow" : "bg-primary/5"
      )} />

      <div className="relative rounded-3xl overflow-hidden glass-dark border border-white/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />

        {/* Hidden/visible YouTube iframe */}
        <div className={cn("transition-all duration-500 relative", showVideo ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none")}>
          <AspectRatio ratio={16 / 9}>
            <iframe ref={iframeRef} src={embedUrl} title="Live Broadcast" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen frameBorder="0" />
          </AspectRatio>
        </div>

        {/* Custom Player UI (audio mode) */}
        {!showVideo && (
          <div className="relative z-20 p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <div className={cn("inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 transition-all duration-500", isPlaying && "glow-gold-sm")}>
                <span className={cn("w-2.5 h-2.5 rounded-full", isPlaying ? "bg-red-500 animate-pulse" : "bg-white/30")} />
                <span className={cn("text-xs font-bold uppercase tracking-[0.2em]", isPlaying ? "text-red-400" : "text-white/40")}>{isPlaying ? "🔴 Live" : "Ready"}</span>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className={cn("relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-700", isPlaying && "glow-gold")}>
                <div className={cn("absolute inset-0 rounded-full border-2 border-dashed transition-all duration-500", isPlaying ? "border-primary/50 animate-[spin_10s_linear_infinite]" : "border-white/10")} />
                <div className={cn("absolute inset-2 rounded-full border", isPlaying ? "border-primary/20" : "border-white/5")} />
                <div className="absolute inset-4 rounded-full bg-white/5 border border-white/10" />
                {liveOnAir?.presenterImage && isPlaying ? (
                  <img src={liveOnAir.presenterImage} alt="" className="relative w-20 h-20 rounded-full object-cover border-2 border-primary/50" />
                ) : (
                  <Radio className={cn("relative w-12 h-12", isPlaying ? "text-primary" : "text-white/20")} />
                )}
              </div>
            </div>

            <div className="text-center mb-5 space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">{liveOnAir?.showName || "Live Radio"}</h2>
              {liveOnAir?.presenterName && <p className="text-sm text-primary font-medium flex items-center justify-center gap-1.5"><Mic2 className="w-3.5 h-3.5" />{liveOnAir.presenterName}</p>}
              <p className="text-xs text-white/40">{isPlaying ? "Streaming Live" : "Press play"}</p>
            </div>

            {isPlaying && (
              <div className="flex items-center justify-center gap-1 mb-5">
                {[...Array(9)].map((_, i) => <div key={i} className="w-1 rounded-full bg-primary animate-sound-wave" style={{ animationDelay: `${i * 0.07}s` }} />)}
              </div>
            )}

            <div className="flex justify-center mb-5">
              <Button onClick={togglePlay} size="lg" className={cn("w-20 h-20 rounded-full border-0 relative overflow-hidden",
                isPlaying ? "bg-primary/80 hover:bg-primary/90 glow-gold" : "bg-primary/80 hover:bg-primary/90 glow-gold animate-pulse-glow"
              )}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                {isPlaying ? <Pause className="w-10 h-10 relative z-10" /> : <Play className="w-10 h-10 ml-1 relative z-10" />}
              </Button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
              <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
                {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <Slider value={isMuted ? [0] : volume} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
              <span className="text-xs text-white/40 w-8 text-right font-mono">{isMuted ? 0 : volume[0]}</span>
              <div className="w-px h-5 bg-white/10" />
              <button onClick={() => setShowVideo(true)} className="text-white/40 hover:text-primary transition-colors" title="Show video">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Video overlay controls */}
        {showVideo && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="flex items-center gap-3">
              <Button onClick={togglePlay} size="icon" variant="ghost" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20">
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 ml-0.5 text-white" />}
              </Button>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-400 uppercase">Live</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{liveOnAir?.showName || "Live Broadcast"}</p>
              </div>
              <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setShowVideo(false)} className="text-white/70 hover:text-white transition-colors" title="Audio only">
                <EyeOff className="w-4 h-4" />
              </button>
              <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors" title="Fullscreen">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
