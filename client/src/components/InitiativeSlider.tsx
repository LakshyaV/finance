import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface InitiativeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const modes = [
  { emoji: "😎", label: "Chill", desc: "I'll check in when you need me" },
  { emoji: "🤝", label: "Balanced", desc: "Regular tips and reminders" },
  { emoji: "💪", label: "Coach", desc: "Let's crush those goals together!" }
];

export default function InitiativeSlider({ value, onChange }: InitiativeSliderProps) {
  const currentMode = modes[Math.floor(value / 34)] || modes[0];

  return (
    <Card className="p-6" data-testid="card-initiative">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">How proactive should I be?</h3>
          <p className="text-sm text-muted-foreground">Adjust how often Budgety checks in with you</p>
        </div>
        
        <div className="text-center py-4">
          <span className="text-6xl mb-2 block">{currentMode.emoji}</span>
          <p className="text-xl font-bold">{currentMode.label} Mode</p>
          <p className="text-sm text-muted-foreground mt-1">{currentMode.desc}</p>
        </div>

        <Slider
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          max={100}
          step={1}
          className="w-full"
          data-testid="slider-initiative"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Minimal</span>
          <span>Proactive</span>
        </div>
      </div>
    </Card>
  );
}
