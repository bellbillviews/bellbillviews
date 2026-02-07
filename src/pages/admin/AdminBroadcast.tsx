import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBroadcastPlatforms, useCreateBroadcastPlatform, useUpdateBroadcastPlatform, useDeleteBroadcastPlatform, BroadcastPlatform } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Tv, Radio } from "lucide-react";

const platformTypes = ["mixlr", "youtube", "twitch", "facebook", "custom"];

export default function AdminBroadcast() {
  const { data: platforms, isLoading } = useBroadcastPlatforms();
  const createPlatform = useCreateBroadcastPlatform();
  const updatePlatform = useUpdateBroadcastPlatform();
  const deletePlatform = useDeleteBroadcastPlatform();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BroadcastPlatform | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    platform_type: "mixlr",
    embed_code: "",
    stream_url: "",
    is_active: true,
    is_primary: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      platform_type: "mixlr",
      embed_code: "",
      stream_url: "",
      is_active: true,
      is_primary: false,
    });
    setEditing(null);
  };

  const handleEdit = (platform: BroadcastPlatform) => {
    setEditing(platform);
    setFormData({
      name: platform.name,
      platform_type: platform.platform_type,
      embed_code: platform.embed_code || "",
      stream_url: platform.stream_url || "",
      is_active: platform.is_active,
      is_primary: platform.is_primary,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editing) {
        await updatePlatform.mutateAsync({ id: editing.id, ...formData });
        toast({ title: "Platform updated" });
      } else {
        await createPlatform.mutateAsync(formData);
        toast({ title: "Platform added" });
      }
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleDelete = async (platform: BroadcastPlatform) => {
    if (!confirm(`Delete "${platform.name}"?`)) return;
    
    try {
      await deletePlatform.mutateAsync(platform.id);
      toast({ title: "Platform deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Broadcast Platforms">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Broadcast Platforms" description="Configure embed codes for Mixlr, YouTube, and other platforms">
      <div className="mb-6">
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Platform" : "Add Broadcast Platform"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Platform Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mixlr Live Stream"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Platform Type</Label>
                <Select
                  value={formData.platform_type}
                  onValueChange={(value) => setFormData({ ...formData, platform_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platformTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stream URL</Label>
                <Input
                  value={formData.stream_url}
                  onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                  placeholder="https://mixlr.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label>Embed Code</Label>
                <Textarea
                  value={formData.embed_code}
                  onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                  placeholder='<iframe src="..." ...></iframe>'
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full embed code from your broadcast platform
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Primary Platform</Label>
                <Switch
                  checked={formData.is_primary}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_primary: checked })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createPlatform.isPending || updatePlatform.isPending}>
                {(createPlatform.isPending || updatePlatform.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? "Update" : "Add Platform"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {platforms && platforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => (
            <Card key={platform.id} className={!platform.is_active ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Tv className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription className="capitalize">{platform.platform_type}</CardDescription>
                    </div>
                  </div>
                  {platform.is_primary && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Primary</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {platform.stream_url && (
                  <p className="text-sm text-muted-foreground mb-2 truncate">{platform.stream_url}</p>
                )}
                {platform.embed_code && (
                  <p className="text-xs text-muted-foreground mb-4">Embed code configured ✓</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(platform)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(platform)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No broadcast platforms configured yet.</p>
            <p className="text-sm text-muted-foreground">Add platforms like Mixlr, YouTube Live, etc.</p>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
