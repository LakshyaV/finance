import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { CompanionSettings } from "@shared/schema";

const DEMO_USER_ID = "demo-user-001";

const avatarStyleColors = {
  friendly: "bg-primary/20 border-primary",
  professional: "bg-accent/20 border-accent",
  playful: "bg-chart-2/20 border-chart-2",
  calm: "bg-chart-4/20 border-chart-4"
};

export function PersistentAvatar() {
  const { data: companionSettings } = useQuery<CompanionSettings>({
    queryKey: ['/api/companion-settings', DEMO_USER_ID],
  });

  const avatarColor = avatarStyleColors[companionSettings?.avatarStyle as keyof typeof avatarStyleColors] || avatarStyleColors.friendly;
  const companionEmotion = companionSettings?.emotion || "😊";

  return (
    <Link href="/">
      <button 
        className={`fixed bottom-20 right-6 z-[60] flex items-center justify-center w-16 h-16 rounded-full border-2 ${avatarColor} transition-all hover:scale-105 active:scale-95 shadow-lg`}
        data-testid="button-persistent-avatar"
        aria-label="Return to chat"
      >
        <span className="text-3xl animate-pulse">{companionEmotion}</span>
      </button>
    </Link>
  );
}
