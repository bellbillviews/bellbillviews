import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStreamSettings, useCreateStreamSetting, useUpdateStreamSetting, useDeleteStreamSetting, StreamSetting } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Video, Copy, Eye, EyeOff } from "lucide-react";

export default function AdminStream() {
  const { data: settings, isLoading } = useStreamSettings();
  const createSetting = useCreateStreamSetting();
  const updateSetting = useUpdateStreamSetting();
  const deleteSetting = useDeleteStreamSetting();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<StreamSetting | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: "",
    stream_type: "video",
    stream_url: "",
    stream_key: "",
    rtmp_url: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      stream_type: "video",
      stream_url: "",
      stream_key: "",
      rtmp_url: "",
      is_active: true,
    });
    setEditing(null);
  };

  const handleEdit = (setting: StreamSetting) => {
    setEditing(setting);
    setFormData({
      name: setting.name,
      stream_type: setting.stream_type,
      stream_url: setting.stream_url || "",
      stream_key: setting.stream_key || "",
      rtmp_url: setting.rtmp_url || "",
      is_active: setting.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editing) {
        await updateSetting.mutateAsync({ id: editing.id, ...formData });
        toast({ title: "Stream setting updated" });
      } else {
        await createSetting.mutateAsync(formData);
        toast({ title: "Stream setting added" });
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleDelete = async (setting: StreamSetting) => {
    if (!confirm(`Delete "${setting.name}"?`)) return;
    
    try {
      await deleteSetting.mutateAsync(setting.id);
      toast({ title: "Stream setting deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Stream Settings">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Stream Settings" description="Configure vMix, OBS, and other streaming software settings">
      {/* Info Card */}
      <Card className="mb-6 bg-primary/10 border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground mb-2">How to use with vMix/OBS</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Add a stream configuration below with your RTMP URL and Stream Key</li>
            <li>Copy the RTMP URL and paste it into vMix/OBS as the "Server" or "URL"</li>
            <li>Copy the Stream Key and paste it into the "Stream Key" field</li>
            <li>Start streaming from your software!</li>
          </ol>
        </CardContent>
      </Card>

      <div className="mb-6">
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Stream Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Stream Setting" : "Add Stream Configuration"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Configuration Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="vMix Main Stream"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Stream Type</Label>
                <Select
                  value={formData.stream_type}
                  onValueChange={(value) => setFormData({ ...formData, stream_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Stream</SelectItem>
                    <SelectItem value="audio">Audio Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>RTMP URL</Label>
                <Input
                  value={formData.rtmp_url}
                  onChange={(e) => setFormData({ ...formData, rtmp_url: e.target.value })}
                  placeholder="rtmp://live.example.com/live"
                />
                <p className="text-xs text-muted-foreground">The RTMP server URL (without stream key)</p>
              </div>
              <div className="space-y-2">
                <Label>Stream Key</Label>
                <Input
                  value={formData.stream_key}
                  onChange={(e) => setFormData({ ...formData, stream_key: e.target.value })}
                  placeholder="your-secret-stream-key"
                  type="password"
                />
                <p className="text-xs text-muted-foreground">Keep this secret! Only share with authorized broadcasters.</p>
              </div>
              <div className="space-y-2">
                <Label>Playback URL (optional)</Label>
                <Input
                  value={formData.stream_url}
                  onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                  placeholder="https://stream.example.com/live.m3u8"
                />
                <p className="text-xs text-muted-foreground">HLS/DASH URL for viewers</p>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createSetting.isPending || updateSetting.isPending}>
                {(createSetting.isPending || updateSetting.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? "Update" : "Add Configuration"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {settings && settings.length > 0 ? (
        <div className="space-y-4">
          {settings.map((setting) => (
            <Card key={setting.id} className={!setting.is_active ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{setting.name}</CardTitle>
                      <CardDescription className="capitalize">{setting.stream_type} stream</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(setting)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(setting)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {setting.rtmp_url && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">RTMP URL</p>
                      <p className="text-sm font-mono truncate">{setting.rtmp_url}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(setting.rtmp_url!, "RTMP URL")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {setting.stream_key && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Stream Key</p>
                      <p className="text-sm font-mono">
                        {showKeys[setting.id] ? setting.stream_key : "••••••••••••••••"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleShowKey(setting.id)}>
                      {showKeys[setting.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(setting.stream_key!, "Stream Key")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No stream configurations yet.</p>
            <p className="text-sm text-muted-foreground">Add your vMix, OBS, or other streaming settings.</p>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
