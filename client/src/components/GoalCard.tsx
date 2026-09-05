import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Calendar } from "lucide-react";

interface GoalCardProps {
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  category: "short-term" | "long-term";
}

export default function GoalCard({ title, currentAmount, targetAmount, deadline, category }: GoalCardProps) {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const remaining = targetAmount - currentAmount;

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-goal-${category}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {category.replace('-', ' ')}
              </span>
            </div>
            <h3 className="text-lg font-semibold" data-testid="text-goal-title">{title}</h3>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold tabular-nums">${currentAmount.toLocaleString()} / ${targetAmount.toLocaleString()}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% complete</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{deadline}</span>
          </div>
          <Button size="sm" variant="ghost" className="text-primary" data-testid="button-goal-details">
            ${remaining.toLocaleString()} to go
          </Button>
        </div>
      </div>
    </Card>
  );
}
