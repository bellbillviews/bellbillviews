import { Link } from "react-router-dom";
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check, Waves } from "lucide-react";
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

export default function ListenPage() {
  const [copied, setCopied] = useState(false);
  const { data: settings } = useSiteSettings();
  const { data: broadcast } = useBroadcastSettings();

  const getSetting = (key: string) => settings?.find(s => s.setting_key === key)?.setting_value || "";
  const stationName = getSetting("station_name") || "Bellbill Views";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `🎧 Tune in to ${stationName} - The Sound of Culture, Voice, and Music!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = [
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, color: "hover:text-green-400 hover:shadow-[0_0_20px_hsl(142_70%_45%/0.3)]" },
    { name: "Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, color: "hover:text-sky-400 hover:shadow-[0_0_20px_hsl(200_90%_55%/0.3)]" },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: "hover:text-blue-400 hover:shadow-[0_0_20px_hsl(220_90%_55%/0.3)]" },
  ];

  const isYouTubeLive = broadcast?.broadcastEnabled && broadcast?.youtubeVideoId;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-20 pb-24 md:pb-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center animate-fade-in">
              <p className="text-sm text-primary font-bold uppercase tracking-[0.2em] mb-4">Welcome to</p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {stationName.includes(" ") ? (
                  <><span className="text-foreground">{stationName.split(" ")[0]}</span><span className="text-gradient">{" " + stationName.split(" ").slice(1).join(" ")}</span></>
                ) : (
                  <span className="text-gradient">{stationName}</span>
                )} Live
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Experience the rhythm of Nigeria. Stream our live broadcast 24/7.
              </p>
            </div>

            {/* YouTube Live Player or Audio Player */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {isYouTubeLive ? (
                <YouTubeLivePlayer
                  videoId={broadcast.youtubeVideoId}
                  autoplay={broadcast.autoplay}
                  isLive={broadcast.broadcastEnabled}
                  offlineMessage={broadcast.offlineMessage}
                />
              ) : (
                <>
                  {broadcast && !broadcast.broadcastEnabled ? (
                    <YouTubeLivePlayer
                      videoId=""
                      isLive={false}
                      offlineMessage={broadcast.offlineMessage}
                    />
                  ) : (
                    <AudioPlayer size="large" showNowPlaying />
                  )}
                </>
              )}
            </div>

            {/* Share Section */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share with friends
              </p>
              <div className="flex items-center justify-center gap-3">
                {shareLinks.map((link) => (
                  <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full liquid-glass text-muted-foreground transition-all duration-300 ${link.color}`} aria-label={`Share on ${link.name}`}>
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
                <button onClick={copyToClipboard} className={`p-3 rounded-full liquid-glass text-muted-foreground transition-all duration-300 ${copied ? "text-primary glow-primary" : "hover:text-foreground"}`} aria-label="Copy link">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button asChild variant="outline" className="liquid-glass border-primary/20 hover:bg-primary/10 rounded-xl">
                <Link to="/shows">View Our Shows</Link>
              </Button>
            </div>

            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <DynamicSocialLinks iconSize="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Listen Page Ads */}
      <div className="container mx-auto px-4 py-6">
        <PageAds placement="listen" maxAds={2} />
      </div>

      {/* Song Request Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-brand-cyan/2 to-brand-pink/3" />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent absolute top-0 left-0 right-0" />
        <div className="h-px bg-gradient-to-r from-transparent via-brand-cyan/15 to-transparent absolute bottom-0 left-0 right-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl mx-auto">
            <ListenerRequestForm />
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center liquid-glass-strong rounded-3xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              About Our <span className="text-gradient">Broadcast</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
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
