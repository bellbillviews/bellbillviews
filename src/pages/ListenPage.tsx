import { Link } from "react-router-dom";
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check, Headphones, Tv, Radio, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { YouTubeLivePlayer } from "@/components/YouTubeLivePlayer";
import { StickyPlayer } from "@/components/StickyPlayer";
import { DynamicSocialLinks } from "@/components/DynamicSocialLinks";
import { ListenerRequestForm } from "@/components/ListenerRequestForm";
import { PageAds } from "@/components/ads/PageAds";
import { useSiteSettings } from "@/hooks/useSiteData";
import { useBroadcastSettings } from "@/hooks/useBroadcastSettings";
import { useBroadcastQueue } from "@/hooks/useBroadcastQueue";

export default function ListenPage() {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"audio" | "video">("audio");
  const { data: settings } = useSiteSettings();
  const { data: broadcast } = useBroadcastSettings();
  const { data: queue } = useBroadcastQueue("broadcast");

  const getSetting = (key: string) => settings?.find(s => s.setting_key === key)?.setting_value || "";
  const stationName = getSetting("station_name") || "Bellbill Radio";
  const mixlrEmbed = getSetting("mixlr_embed_code");
  const mixlrUrl = getSetting("mixlr_stream_url");
  const listenBg = getSetting("bg_image_listen") || "/images/bg-listen.jpg";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `🎧 Tune in to ${stationName} Live!`;

  const copyToClipboard = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const shareLinks = [
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
    { name: "Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

  const isYouTubeLive = broadcast?.broadcastEnabled && broadcast?.youtubeVideoId;
  const hasMixlr = !!(mixlrEmbed || mixlrUrl);

  // Determine if we should show fallback queue
  const audioOffline = !hasMixlr;
  const videoOffline = !isYouTubeLive;
  const activeQueue = queue?.filter(q => q.is_active) || [];
  const audioQueue = activeQueue.filter(q => q.file_type === "audio");
  const videoQueue = activeQueue.filter(q => q.file_type === "video");
  const showFallback = (mode === "audio" && audioOffline) || (mode === "video" && videoOffline);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 md:pb-0">
        <div className="absolute inset-0 z-0">
          <img src={listenBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center animate-fade-in">
              <p className="text-sm text-primary font-bold uppercase tracking-[0.2em] mb-4">Welcome to</p>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                <span className="text-gold-shimmer">{stationName}</span> <span className="text-white">Live</span>
              </h1>
              <p className="text-lg text-white/60 max-w-md mx-auto">
                Experience the rhythm of Nigeria. Stream our live broadcast 24/7.
              </p>
            </div>

            {/* Audio / Video Toggle */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <div className="inline-flex items-center gap-1 p-1.5 glass-dark rounded-full">
                <button
                  onClick={() => setMode("audio")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    mode === "audio" ? "bg-primary text-primary-foreground glow-gold-sm" : "text-white/50 hover:text-white"
                  }`}
                >
                  <Headphones className="w-4 h-4" />Audio
                </button>
                <button
                  onClick={() => setMode("video")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    mode === "video" ? "bg-primary text-primary-foreground glow-gold-sm" : "text-white/50 hover:text-white"
                  }`}
                >
                  <Tv className="w-4 h-4" />Video
                </button>
              </div>
            </div>

            {/* Player */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {showFallback ? (
                /* FALLBACK: Queue items */
                <div className="glass-dark rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Radio className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-white font-display">
                      {mode === "audio" ? "Audio" : "Video"} — Offline Fallback
                    </h3>
                  </div>
                  {(mode === "audio" ? audioQueue : videoQueue).length > 0 ? (
                    <div className="space-y-2">
                      {(mode === "audio" ? audioQueue : videoQueue).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                          {mode === "audio" ? <Headphones className="w-4 h-4 text-primary flex-shrink-0" /> : <Tv className="w-4 h-4 text-primary flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.title}</p>
                          </div>
                          {item.file_url && (
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Play</a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Radio className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">No {mode} content available right now. Check back soon!</p>
                    </div>
                  )}
                  {activeQueue.length === 0 && (
                    <div className="text-center py-8">
                      <Radio className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">Station is currently offline. Check back soon!</p>
                    </div>
                  )}
                </div>
              ) : mode === "video" ? (
                /* VIDEO MODE: YouTube Live only */
                <YouTubeLivePlayer
                  videoId={broadcast?.youtubeVideoId || ""}
                  autoplay={broadcast?.autoplay}
                  isLive={broadcast?.broadcastEnabled}
                  offlineMessage={broadcast?.offlineMessage}
                />
              ) : (
                /* AUDIO MODE: Mixlr only */
                <div className="relative max-w-lg mx-auto">
                  <div className="absolute -inset-4 rounded-[2rem] blur-2xl pointer-events-none bg-primary/10 animate-pulse-slow" />
                  <div className="relative glass-dark rounded-3xl overflow-hidden border border-white/10">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    {/* Live badge */}
                    <div className="flex justify-center py-4">
                      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 glow-gold-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">🔴 Live Audio</span>
                      </div>
                    </div>
                    {mixlrEmbed ? (
                      <div className="w-full rounded-2xl overflow-hidden px-4 pb-4" dangerouslySetInnerHTML={{ __html: mixlrEmbed }} />
                    ) : mixlrUrl ? (
                      <div className="aspect-video rounded-2xl overflow-hidden mx-4 mb-4">
                        <iframe src={mixlrUrl} title="Mixlr Audio Stream" className="w-full h-full border-0" allow="autoplay" />
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Share */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm text-white/40 mb-4 flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />Share with friends
              </p>
              <div className="flex items-center justify-center gap-3">
                {shareLinks.map((link) => (
                  <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                    className="p-3 rounded-full glass-dark text-white/50 hover:text-primary hover:border-primary/30 transition-all duration-300"
                    aria-label={`Share on ${link.name}`}>
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
                <button onClick={copyToClipboard}
                  className={`p-3 rounded-full glass-dark transition-all duration-300 ${copied ? "text-primary glow-gold-sm" : "text-white/50 hover:text-white"}`}
                  aria-label="Copy link">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button asChild variant="outline" className="glass-dark text-white border-white/20 hover:bg-white/10 rounded-full">
                <Link to="/shows">View Our Shows</Link>
              </Button>
            </div>

            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <DynamicSocialLinks iconSize="md" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6"><PageAds placement="listen" maxAds={2} /></div>

      {/* Song Request */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto"><ListenerRequestForm /></div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-10 border border-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-display">
              About Our <span className="text-gold-shimmer">Broadcast</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {stationName} is Nigeria's premier digital radio station, broadcasting 24/7 from the heart of Lagos.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're in Lagos, London, or Los Angeles, tune in and feel the vibe.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <StickyPlayer />
    </div>
  );
}
