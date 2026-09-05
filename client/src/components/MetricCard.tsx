import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export default function MetricCard({ title, value, change, icon, trend = "neutral" }: MetricCardProps) {
  return (
    <Card className="p-6 hover-elevate" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold tabular-nums" data-testid={`text-metric-value`}>{value}</p>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === "up" ? "text-chart-2" : trend === "down" ? "text-chart-3" : "text-muted-foreground"
          )}>
            {trend === "up" && <TrendingUp className="w-4 h-4" />}
            {trend === "down" && <TrendingDown className="w-4 h-4" />}
            <span>{change > 0 ? "+" : ""}{change}% from last week</span>
          </div>
        )}
      </div>
    </Card>
  );
}
