import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { CompanionSettings } from "@shared/schema";

const DEMO_USER_ID = "demo-user-001";

const avatarEmotions = [
  { value: "happy", label: "Happy 😊", emoji: "😊" },
  { value: "excited", label: "Excited ✨", emoji: "✨" },
  { value: "thoughtful", label: "Thoughtful 🤔", emoji: "🤔" },
  { value: "caring", label: "Caring 💛", emoji: "💛" },
  { value: "proud", label: "Proud 🌟", emoji: "🌟" },
  { value: "supportive", label: "Supportive 🤗", emoji: "🤗" },
];

const avatarStyles = [
  { value: "friendly", label: "Friendly", color: "bg-primary/20 border-primary" },
  { value: "professional", label: "Professional", color: "bg-accent/20 border-accent" },
  { value: "playful", label: "Playful", color: "bg-chart-2/20 border-chart-2" },
  { value: "calm", label: "Calm", color: "bg-chart-4/20 border-chart-4" },
];

const personalities = [
  { value: "supportive", label: "Supportive & Encouraging" },
  { value: "direct", label: "Direct & No-Nonsense" },
  { value: "humorous", label: "Playful & Fun" },
  { value: "analytical", label: "Analytical & Detailed" },
];

export default function CompanionCustomization() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [avatarStyle, setAvatarStyle] = useState("friendly");
  const [emotion, setEmotion] = useState("happy");
  const [personality, setPersonality] = useState("supportive");

  const { data: settings } = useQuery<CompanionSettings>({
    queryKey: ["/api/companion-settings", DEMO_USER_ID],
  });

  useEffect(() => {
    if (settings) {
      setName(settings.name);
      setAvatarStyle(settings.avatarStyle);
      setEmotion(settings.emotion);
      setPersonality(settings.personality);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/companion-settings", {
        method: "POST",
        body: JSON.stringify({
          name,
          avatarStyle,
          emotion,
          personality,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companion-settings", DEMO_USER_ID] });
      toast({
        title: "Saved!",
        description: "Your AI companion has been updated 🎉",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update companion settings",
        variant: "destructive",
      });
    },
  });

  const selectedStyle = avatarStyles.find((s) => s.value === avatarStyle) || avatarStyles[0];
  const selectedEmotion = avatarEmotions.find((e) => e.value === emotion) || avatarEmotions[0];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Companion</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className={`h-16 w-16 rounded-full ${selectedStyle.color} border-2 flex items-center justify-center text-3xl flex-shrink-0`}>
            {selectedEmotion.emoji}
          </div>
          <div className="flex-1">
            <Label htmlFor="companion-name">Name</Label>
            <Input
              id="companion-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Buddy"
              className="mt-1"
              data-testid="input-companion-name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="avatar-style">Avatar Style</Label>
          <Select value={avatarStyle} onValueChange={setAvatarStyle}>
            <SelectTrigger id="avatar-style" className="mt-1" data-testid="select-avatar-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {avatarStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="emotion">Emotion</Label>
          <Select value={emotion} onValueChange={setEmotion}>
            <SelectTrigger id="emotion" className="mt-1" data-testid="select-emotion">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {avatarEmotions.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="personality">Personality</Label>
          <Select value={personality} onValueChange={setPersonality}>
            <SelectTrigger id="personality" className="mt-1" data-testid="select-personality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {personalities.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={() => updateMutation.mutate()} 
          disabled={updateMutation.isPending}
          className="w-full"
          data-testid="button-save-companion"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}
