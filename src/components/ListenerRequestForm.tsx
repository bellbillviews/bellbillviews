import { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const nameExamples = ["Ola", "Ayomide", "Seun", "Mariam", "Maria", "Chidi", "Emeka", "Fatima", "Kofi", "Amara"];
const locationExamples = ["Lagos", "Accra", "Texas", "Ibadan", "London", "Chicago", "Abuja", "New York", "Nairobi", "Dubai"];
const messageExamples = [
  "What's on your mind?",
  "Request a song...",
  "Answer a question...",
  "Send a shoutout...",
  "Share your thoughts...",
  "Dedicate a song to someone...",
];

export function ListenerRequestForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [namePlaceholder, setNamePlaceholder] = useState(nameExamples[0]);
  const [locationPlaceholder, setLocationPlaceholder] = useState(locationExamples[0]);
  const [messagePlaceholder, setMessagePlaceholder] = useState(messageExamples[0]);

  // Animate placeholders
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Name placeholder animation
    let nameIndex = 0;
    intervals.push(
      setInterval(() => {
        nameIndex = (nameIndex + 1) % nameExamples.length;
        setNamePlaceholder(nameExamples[nameIndex]);
      }, 2000)
    );

    // Location placeholder animation
    let locationIndex = 0;
    intervals.push(
      setInterval(() => {
        locationIndex = (locationIndex + 1) % locationExamples.length;
        setLocationPlaceholder(locationExamples[locationIndex]);
      }, 2500)
    );

    // Message placeholder animation
    let messageIndex = 0;
    intervals.push(
      setInterval(() => {
        messageIndex = (messageIndex + 1) % messageExamples.length;
        setMessagePlaceholder(messageExamples[messageIndex]);
      }, 3000)
    );

    return () => intervals.forEach(clearInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("listener_requests").insert({
        name: name.trim(),
        location: location.trim(),
        message: message.trim(),
      });

      if (error) throw error;

      toast.success("Your request has been sent! 🎵");
      setName("");
      setLocation("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border border-primary/20">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Request a <span className="text-gradient">Song</span>
        </h3>
        <p className="text-muted-foreground text-sm">
          Send us your song requests, shoutouts, or just say hello!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="request-name" className="text-foreground">
              Your Name
            </Label>
            <Input
              id="request-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={namePlaceholder}
              className="bg-muted/50 border-border focus:border-primary transition-all duration-300"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-location" className="text-foreground">
              Location
            </Label>
            <Input
              id="request-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={locationPlaceholder}
              className="bg-muted/50 border-border focus:border-primary transition-all duration-300"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="request-message" className="text-foreground">
            Your Message
          </Label>
          <Textarea
            id="request-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messagePlaceholder}
            rows={4}
            className="bg-muted/50 border-border focus:border-primary transition-all duration-300 resize-none"
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-glow"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
