import { cn } from "@/lib/utils";
import { Radio, WifiOff } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface YouTubeLivePlayerProps {
  videoId: string;
  autoplay?: boolean;
  isLive?: boolean;
  offlineMessage?: string;
  className?: string;
}

function extractVideoId(input: string): string {
  if (!input) return "";
  // Already a plain ID (11 chars, no slashes/dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  // Extract from various YouTube URL formats
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

  if (!isLive || !id) {
    return (
      <div className={cn("relative rounded-2xl overflow-hidden", className)}>
        <div className="relative bg-card/30 backdrop-blur-2xl border border-border/50 rounded-2xl">
          <AspectRatio ratio={16 / 9}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-muted/50 to-card/80 p-8">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <WifiOff className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center text-sm max-w-md leading-relaxed">
                {offlineMessage}
              </p>
            </div>
          </AspectRatio>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${id}?${new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
  }).toString()}`;

  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      {/* Background glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative bg-card/30 backdrop-blur-2xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Live badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-destructive/90 backdrop-blur-lg rounded-full shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Live Broadcast</span>
        </div>

        <AspectRatio ratio={16 / 9}>
          <iframe
            src={embedUrl}
            title="Live Broadcast"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
        </AspectRatio>
      </div>
    </div>
  );
}
