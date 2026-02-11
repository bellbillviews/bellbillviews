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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useAdminData";
import { useBroadcastPlatforms, useCreateBroadcastPlatform, useUpdateBroadcastPlatform, useDeleteBroadcastPlatform, BroadcastPlatform } from "@/hooks/useAdminData";
import { useBroadcastQueue, useCreateQueueItem, useUpdateQueueItem, useDeleteQueueItem, useReorderQueue, BroadcastQueueItem } from "@/hooks/useBroadcastQueue";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Tv, Radio, Youtube, ArrowUp, ArrowDown, Music, Upload, ExternalLink, Eye } from "lucide-react";

function extractVideoId(input: string): string {
  if (!input) return "";
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return input.trim();
}

const platformTypes = ["mixlr", "youtube", "twitch", "facebook", "custom"];

export default function AdminBroadcast() {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const { data: platforms, isLoading: platformsLoading } = useBroadcastPlatforms();
  const createPlatform = useCreateBroadcastPlatform();
  const updatePlatform = useUpdateBroadcastPlatform();
  const deletePlatform = useDeleteBroadcastPlatform();
  const { data: queue } = useBroadcastQueue("broadcast");
  const createQueueItem = useCreateQueueItem();
  const updateQueueItem = useUpdateQueueItem();
  const deleteQueueItem = useDeleteQueueItem();
  const reorderQueue = useReorderQueue();
  const { toast } = useToast();

  const [platformDialogOpen, setPlatformDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<BroadcastPlatform | null>(null);
  const [platformForm, setPlatformForm] = useState({ name: "", platform_type: "mixlr", embed_code: "", stream_url: "", is_active: true, is_primary: false });

  const [queueDialogOpen, setQueueDialogOpen] = useState(false);
  const [queueForm, setQueueForm] = useState({ title: "", file_url: "", file_type: "audio" as string });

  const getSetting = (key: string) => settings?.find(s => s.setting_key === key);
  const getVal = (key: string) => getSetting(key)?.setting_value || "";

  const handleSettingUpdate = async (key: string, value: string) => {
    const setting = getSetting(key);
    if (!setting) return;
    try {
      await updateSetting.mutateAsync({ id: setting.id, setting_value: value });
      toast({ title: "Setting updated" });
    } catch {
      toast({ variant: "destructive", title: "Failed to update setting" });
    }
  };

  const videoId = extractVideoId(getVal("youtube_live_video_id"));
  const broadcastEnabled = getVal("broadcast_enabled") === "true";
  const autoplay = getVal("broadcast_autoplay") === "true";

  // Platform handlers
  const resetPlatformForm = () => {
    setPlatformForm({ name: "", platform_type: "mixlr", embed_code: "", stream_url: "", is_active: true, is_primary: false });
    setEditingPlatform(null);
  };
  const handleEditPlatform = (p: BroadcastPlatform) => {
    setEditingPlatform(p);
    setPlatformForm({ name: p.name, platform_type: p.platform_type, embed_code: p.embed_code || "", stream_url: p.stream_url || "", is_active: p.is_active, is_primary: p.is_primary });
    setPlatformDialogOpen(true);
  };
  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlatform) {
        await updatePlatform.mutateAsync({ id: editingPlatform.id, ...platformForm });
      } else {
        await createPlatform.mutateAsync(platformForm);
      }
      toast({ title: editingPlatform ? "Platform updated" : "Platform added" });
      setPlatformDialogOpen(false);
      resetPlatformForm();
    } catch { toast({ variant: "destructive", title: "Error" }); }
  };
  const handleDeletePlatform = async (p: BroadcastPlatform) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try { await deletePlatform.mutateAsync(p.id); toast({ title: "Deleted" }); } catch { toast({ variant: "destructive", title: "Error" }); }
  };

  // Queue handlers
  const handleAddQueueItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQueueItem.mutateAsync({
        title: queueForm.title,
        file_url: queueForm.file_url || null,
        file_type: queueForm.file_type,
        queue_type: "broadcast",
        duration_seconds: null,
        sort_order: (queue?.length || 0),
        is_active: true,
      });
      toast({ title: "Item added to queue" });
      setQueueDialogOpen(false);
      setQueueForm({ title: "", file_url: "", file_type: "audio" });
    } catch { toast({ variant: "destructive", title: "Error" }); }
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    if (!queue) return;
    const newQueue = [...queue];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newQueue.length) return;
    [newQueue[index], newQueue[swapIndex]] = [newQueue[swapIndex], newQueue[index]];
    await reorderQueue.mutateAsync(newQueue.map((item, i) => ({ id: item.id, sort_order: i })));
  };

  if (settingsLoading) {
    return (
      <AdminLayout title="Broadcast Management">
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Broadcast Management" description="Audio live streaming via YouTube Live, Restream, playlists & queue">
      <Tabs defaultValue="youtube" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="youtube"><Youtube className="w-4 h-4 mr-1.5" />YouTube Live</TabsTrigger>
          <TabsTrigger value="queue"><Music className="w-4 h-4 mr-1.5" />Queue</TabsTrigger>
          <TabsTrigger value="platforms"><Tv className="w-4 h-4 mr-1.5" />Platforms</TabsTrigger>
        </TabsList>

        {/* YouTube Live Tab */}
        <TabsContent value="youtube" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Youtube className="w-5 h-5 text-red-500" />YouTube Live Broadcast</CardTitle>
              <CardDescription>Stream audio via Restream → YouTube Live. Paste your YouTube Live Video ID here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                <div>
                  <Label className="text-base font-semibold">Live Broadcast</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Toggle ON when your stream is live</p>
                </div>
                <Switch
                  checked={broadcastEnabled}
                  onCheckedChange={(checked) => handleSettingUpdate("broadcast_enabled", checked ? "true" : "false")}
                />
              </div>

              {/* Video ID */}
              <div className="space-y-2">
                <Label>YouTube Live Video ID or URL</Label>
                <Input
                  value={getVal("youtube_live_video_id")}
                  onChange={(e) => {
                    const setting = getSetting("youtube_live_video_id");
                    if (setting) updateSetting.mutate({ id: setting.id, setting_value: e.target.value });
                  }}
                  placeholder="dQw4w9WgXcQ or https://youtube.com/live/..."
                />
                <p className="text-xs text-muted-foreground">Paste a video ID, watch URL, or live URL. The ID is extracted automatically.</p>
              </div>

              {/* YouTube Embed Code */}
              <div className="space-y-2">
                <Label>YouTube Embed Code (optional)</Label>
                <Textarea
                  value={getVal("youtube_embed_code")}
                  onChange={(e) => {
                    const setting = getSetting("youtube_embed_code");
                    if (setting) updateSetting.mutate({ id: setting.id, setting_value: e.target.value });
                  }}
                  placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Paste full YouTube embed code if preferred over Video ID.</p>
              </div>

              {/* Restream Direct URL */}
              <div className="space-y-2">
                <Label>Restream Direct Embed URL (optional)</Label>
                <Input
                  value={getVal("restream_embed_url")}
                  onChange={(e) => {
                    const setting = getSetting("restream_embed_url");
                    if (setting) updateSetting.mutate({ id: setting.id, setting_value: e.target.value });
                  }}
                  placeholder="https://player.restream.io/player/..."
                />
                <p className="text-xs text-muted-foreground">Direct Restream player URL for embedding.</p>
              </div>

              {/* Mixlr Stream Link */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Radio className="w-4 h-4 text-primary" />Mixlr Stream Link</Label>
                <Input
                  value={getVal("mixlr_stream_url")}
                  onChange={(e) => {
                    const setting = getSetting("mixlr_stream_url");
                    if (setting) updateSetting.mutate({ id: setting.id, setting_value: e.target.value });
                  }}
                  placeholder="https://mixlr.com/username"
                />
                <p className="text-xs text-muted-foreground">Your Mixlr stream page URL for audio-only broadcasts.</p>
              </div>

              {/* Mixlr Player Embed */}
              <div className="space-y-2">
                <Label>Mixlr Player Embed Code (optional)</Label>
                <Textarea
                  value={getVal("mixlr_embed_code")}
                  onChange={(e) => {
                    const setting = getSetting("mixlr_embed_code");
                    if (setting) updateSetting.mutate({ id: setting.id, setting_value: e.target.value });
                  }}
                  placeholder='<iframe src="https://mixlr.com/..." ...></iframe>'
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Paste the Mixlr embed code for inline player.</p>
              </div>

              {/* Autoplay */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autoplay</Label>
                  <p className="text-xs text-muted-foreground">Auto-start playback (muted by browser policy)</p>
                </div>
                <Switch
                  checked={autoplay}
                  onCheckedChange={(checked) => handleSettingUpdate("broadcast_autoplay", checked ? "true" : "false")}
                />
              </div>

              {/* Offline message */}
              <div className="space-y-2">
                <Label>Offline Message</Label>
                <Textarea
                  value={getVal("broadcast_offline_message")}
                  onChange={(e) => {
                    const setting = getSetting("broadcast_offline_message");
                    if (setting) updateSetting.mutate({ id: setting.id, setting_value: e.target.value });
                  }}
                  placeholder="We are currently offline..."
                  rows={2}
                />
              </div>

              {/* Playlist URL */}
              <div className="space-y-2">
                <Label>YouTube Playlist URL (fallback)</Label>
                <Input
                  value={getVal("youtube_playlist_url")}
                  onChange={(e) => {
                    const setting = getSetting("youtube_playlist_url");
                    if (setting) updateSetting.mutate({ id: setting.id, setting_value: e.target.value });
                  }}
                  placeholder="https://youtube.com/playlist?list=..."
                />
                <p className="text-xs text-muted-foreground">When not live, this playlist plays as a fallback.</p>
              </div>

              {/* Preview */}
              {videoId && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Eye className="w-4 h-4" />Live Preview</Label>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <AspectRatio ratio={16 / 9}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        className="w-full h-full"
                        title="Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        frameBorder="0"
                      />
                    </AspectRatio>
                  </div>
                </div>
              )}

              {/* How-to card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-2">🎙 Real-world workflow</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Start your stream in Restream (or OBS)</li>
                    <li>Restream sends audio → YouTube Live</li>
                    <li>Copy the YouTube Live Video ID from the URL</li>
                    <li>Paste it above and toggle <strong>Live Broadcast ON</strong></li>
                    <li>Your /listen page instantly plays it!</li>
                  </ol>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audio Queue</CardTitle>
                  <CardDescription>Add local audio/video files or URLs. Drag to reorder playback.</CardDescription>
                </div>
                <Dialog open={queueDialogOpen} onOpenChange={setQueueDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Item</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add to Queue</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddQueueItem} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input value={queueForm.title} onChange={(e) => setQueueForm({ ...queueForm, title: e.target.value })} placeholder="Track name" required />
                      </div>
                      <div className="space-y-2">
                        <Label>File URL</Label>
                        <Input value={queueForm.file_url} onChange={(e) => setQueueForm({ ...queueForm, file_url: e.target.value })} placeholder="https://... or upload via Media Library" />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={queueForm.file_type} onValueChange={(v) => setQueueForm({ ...queueForm, file_type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full" disabled={createQueueItem.isPending}>
                        {createQueueItem.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Add to Queue
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {queue && queue.length > 0 ? (
                <div className="space-y-2">
                  {queue.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <span className="text-xs text-muted-foreground font-mono w-6 text-center">{index + 1}</span>
                      <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Music className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.file_type}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(index, "up")} disabled={index === 0}>
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(index, "down")} disabled={index === queue.length - 1}>
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Remove?")) deleteQueueItem.mutate(item.id); }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No items in queue. Add audio or video files above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="mb-4">
            <Dialog open={platformDialogOpen} onOpenChange={(open) => { setPlatformDialogOpen(open); if (!open) resetPlatformForm(); }}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" />Add Platform</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingPlatform ? "Edit Platform" : "Add Broadcast Platform"}</DialogTitle></DialogHeader>
                <form onSubmit={handlePlatformSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform Name *</Label>
                    <Input value={platformForm.name} onChange={(e) => setPlatformForm({ ...platformForm, name: e.target.value })} placeholder="Mixlr Live" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Platform Type</Label>
                    <Select value={platformForm.platform_type} onValueChange={(v) => setPlatformForm({ ...platformForm, platform_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{platformTypes.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stream URL</Label>
                    <Input value={platformForm.stream_url} onChange={(e) => setPlatformForm({ ...platformForm, stream_url: e.target.value })} placeholder="https://mixlr.com/username" />
                  </div>
                  <div className="space-y-2">
                    <Label>Embed Code</Label>
                    <Textarea value={platformForm.embed_code} onChange={(e) => setPlatformForm({ ...platformForm, embed_code: e.target.value })} placeholder='<iframe src="..." ...></iframe>' rows={4} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch checked={platformForm.is_active} onCheckedChange={(c) => setPlatformForm({ ...platformForm, is_active: c })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Primary</Label>
                    <Switch checked={platformForm.is_primary} onCheckedChange={(c) => setPlatformForm({ ...platformForm, is_primary: c })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={createPlatform.isPending || updatePlatform.isPending}>
                    {(createPlatform.isPending || updatePlatform.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingPlatform ? "Update" : "Add Platform"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {platformsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : platforms && platforms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((p) => (
                <Card key={p.id} className={!p.is_active ? "opacity-60" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Tv className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{p.name}</CardTitle>
                          <CardDescription className="capitalize">{p.platform_type}</CardDescription>
                        </div>
                      </div>
                      {p.is_primary && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Primary</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {p.stream_url && <p className="text-sm text-muted-foreground mb-2 truncate">{p.stream_url}</p>}
                    {p.embed_code && <p className="text-xs text-muted-foreground mb-3">Embed configured ✓</p>}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditPlatform(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeletePlatform(p)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No platforms configured. Add Mixlr, YouTube, Twitch, etc.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
