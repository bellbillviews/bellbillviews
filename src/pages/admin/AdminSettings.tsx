import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/admin/FileUpload";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

  const getValue = (key: string) => {
    if (localSettings[key] !== undefined) return localSettings[key];
    return settings?.find((s) => s.setting_key === key)?.setting_value || "";
  };

  const getSettingId = (key: string) => {
    return settings?.find((s) => s.setting_key === key)?.id;
  };

  const handleChange = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    const id = getSettingId(key);
    if (!id) return;

    try {
      await updateSetting.mutateAsync({ id, setting_value: getValue(key) });
      toast({
        title: "Setting saved",
        description: `${key} has been updated.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save setting.",
      });
    }
  };

  const handleSaveAll = async () => {
    const keys = Object.keys(localSettings);
    for (const key of keys) {
      const id = getSettingId(key);
      if (id) {
        await updateSetting.mutateAsync({ id, setting_value: localSettings[key] });
      }
    }
    setLocalSettings({});
    toast({
      title: "All settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Site Settings">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings" description="Configure your radio station branding and settings">
      <div className="space-y-6 max-w-2xl">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Configure your station name, slogan, and logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Station Name</Label>
              <Input
                value={getValue("station_name")}
                onChange={(e) => handleChange("station_name", e.target.value)}
                placeholder="Bellbill Views"
              />
            </div>
            <div className="space-y-2">
              <Label>Station Slogan</Label>
              <Input
                value={getValue("station_slogan")}
                onChange={(e) => handleChange("station_slogan", e.target.value)}
                placeholder="The Sound of Culture, Voice, and Music"
              />
            </div>
            <FileUpload
              value={getValue("logo_url")}
              onChange={(url) => handleChange("logo_url", url)}
              label="Station Logo"
              folder="logos"
            />
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Colors</CardTitle>
            <CardDescription>Customize your brand colors (requires page reload)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={getValue("primary_color") || "#5435ac"}
                    onChange={(e) => handleChange("primary_color", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={getValue("primary_color") || "#5435ac"}
                    onChange={(e) => handleChange("primary_color", e.target.value)}
                    placeholder="#5435ac"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={getValue("secondary_color") || "#f7b322"}
                    onChange={(e) => handleChange("secondary_color", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={getValue("secondary_color") || "#f7b322"}
                    onChange={(e) => handleChange("secondary_color", e.target.value)}
                    placeholder="#f7b322"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stream URL */}
        <Card>
          <CardHeader>
            <CardTitle>Live Stream</CardTitle>
            <CardDescription>Configure your live audio stream URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Stream URL</Label>
              <Input
                value={getValue("stream_url")}
                onChange={(e) => handleChange("stream_url", e.target.value)}
                placeholder="https://stream.example.com/live.mp3"
              />
              <p className="text-xs text-muted-foreground">
                Enter your Icecast, Shoutcast, or other audio stream URL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Configure contact details for your station</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={getValue("contact_email")}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                placeholder="info@bellbillviews.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input
                value={getValue("contact_phone")}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input
                value={getValue("whatsapp_number")}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="+234 800 000 0000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSaveAll}
          disabled={updateSetting.isPending || Object.keys(localSettings).length === 0}
          className="w-full"
        >
          {updateSetting.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save All Changes
        </Button>
      </div>
    </AdminLayout>
  );
}
