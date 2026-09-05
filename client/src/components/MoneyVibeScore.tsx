import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MoneyVibeScoreProps {
  score: number;
  label: string;
}

const getVibeEmoji = (score: number) => {
  if (score >= 80) return { emoji: "🔥", color: "from-chart-2 to-chart-2/70", text: "On fire!" };
  if (score >= 60) return { emoji: "😊", color: "from-chart-1 to-chart-1/70", text: "Looking good" };
  if (score >= 40) return { emoji: "😐", color: "from-chart-3 to-chart-3/70", text: "Could be better" };
  return { emoji: "😰", color: "from-destructive to-destructive/70", text: "Need help?" };
};

export default function MoneyVibeScore({ score, label }: MoneyVibeScoreProps) {
  const vibe = getVibeEmoji(score);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="p-6 hover-elevate" data-testid="card-money-vibe">
      <h3 className="text-sm font-medium text-muted-foreground mb-6">{label}</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={cn("stop-color-chart-1")} />
                <stop offset="100%" className={cn("stop-color-chart-2")} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl mb-1">{vibe.emoji}</span>
            <span className="text-2xl font-bold tabular-nums" data-testid="text-vibe-score">{score}</span>
          </div>
        </div>
        <p className={cn("mt-4 text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent", vibe.color)}>
          {vibe.text}
        </p>
      </div>
    </Card>
  );
}
