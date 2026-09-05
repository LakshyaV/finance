import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeerBenchmarkProps {
  userPercentile: number;
  metric: string;
  comparisonGroup: string;
}

export default function PeerBenchmark({ userPercentile, metric, comparisonGroup }: PeerBenchmarkProps) {
  const getPerformanceLabel = (percentile: number) => {
    if (percentile >= 75) return { label: "Top 25%", color: "text-chart-2" };
    if (percentile >= 50) return { label: "Above Average", color: "text-chart-1" };
    if (percentile >= 25) return { label: "Average", color: "text-muted-foreground" };
    return { label: "Below Average", color: "text-chart-3" };
  };

  const performance = getPerformanceLabel(userPercentile);

  return (
    <Card className="p-6 hover-elevate" data-testid="card-peer-benchmark">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{metric}</h3>
          <p className="text-sm text-muted-foreground">{comparisonGroup}</p>
        </div>
        <Users className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-chart-3 via-chart-1 to-chart-2 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-lg transition-all duration-500"
            style={{ left: `${userPercentile}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">You're at</span>
          <span className={cn("font-semibold", performance.color)} data-testid="text-benchmark-label">
            {performance.label}
          </span>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          You're doing better than {userPercentile}% of {comparisonGroup.toLowerCase()}
        </p>
      </div>
    </Card>
  );
}
