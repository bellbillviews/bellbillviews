import { Link } from "react-router-dom";
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { StickyPlayer } from "@/components/StickyPlayer";
import { DynamicSocialLinks } from "@/components/DynamicSocialLinks";
import { ListenerRequestForm } from "@/components/ListenerRequestForm";
import { useSiteSettings } from "@/hooks/useSiteData";

export default function ListenPage() {
  const [copied, setCopied] = useState(false);
  const { data: settings } = useSiteSettings();

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
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "hover:bg-green-500/20 hover:text-green-500",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-sky-500/20 hover:text-sky-400",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-500/20 hover:text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-20 pb-24 md:pb-0">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Welcome Message */}
            <div className="text-center animate-fade-in">
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-4">
                Welcome to
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {stationName.includes(" ") ? (
                  <>
                    {stationName.split(" ")[0]}<span className="text-gradient">{stationName.split(" ").slice(1).join(" ")}</span>
                  </>
                ) : (
                  <span className="text-gradient">{stationName}</span>
                )} Live
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Experience the rhythm of Nigeria. Stream our live broadcast 24/7 and immerse yourself in culture, conversation, and music.
              </p>
            </div>

            {/* Main Player */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <AudioPlayer size="large" showNowPlaying />
            </div>

            {/* Share Section */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share with friends
              </p>
              <div className="flex items-center justify-center gap-3">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-muted text-muted-foreground transition-all duration-300 ${link.color}`}
                    aria-label={`Share on ${link.name}`}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
                <button
                  onClick={copyToClipboard}
                  className={`p-3 rounded-full bg-muted text-muted-foreground transition-all duration-300 ${
                    copied ? "bg-primary/20 text-primary" : "hover:bg-muted/80"
                  }`}
                  aria-label="Copy link"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button asChild variant="outline" className="border-border hover:bg-muted">
                <Link to="/shows">View Our Shows</Link>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <DynamicSocialLinks iconSize="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Song Request Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <ListenerRequestForm />
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              About Our <span className="text-primary">Broadcast</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {stationName} is Nigeria's premier digital radio station, broadcasting 24/7 from the heart of Lagos. We bring you the best in African music, insightful conversations, and cultural programming that connects you to the pulse of the continent.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're in Lagos, London, or Los Angeles, tune in and feel the vibe. Our diverse lineup of shows covers everything from morning motivation to late-night grooves, with expert hosts who bring passion and authenticity to every broadcast.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Mobile Sticky Player */}
      <StickyPlayer />
    </div>
  );
}
