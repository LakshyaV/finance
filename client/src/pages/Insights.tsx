import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Target, Wallet, ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { PersistentAvatar } from "@/components/PersistentAvatar";

export default function Insights() {
  const { data: transactionsData } = useQuery<{ transactions: any[] }>({
    queryKey: ["/api/transactions"],
  });

  const { data: goalsData } = useQuery<{ goals: any[] }>({
    queryKey: ["/api/goals"],
  });

  const { data: insightsData } = useQuery<{
    summary: string;
    topSpendingCategories: Array<{ category: string; amount: number; percentage: number }>;
    advice: string[];
  }>({
    queryKey: ["/api/insights"],
    enabled: !!transactionsData,
  });

  const transactions = transactionsData?.transactions || [];
  const goals = goalsData?.goals || [];
  const insights = insightsData || { summary: "", topSpendingCategories: [], advice: [] };

  const totalExpenses = transactions
    .filter((tx: any) => tx.type === "expense")
    .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);

  const totalIncome = transactions
    .filter((tx: any) => tx.type === "income")
    .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);

  const getProgressPercent = (goal: any) => {
    if (!goal.targetAmount || !goal.currentAmount) return 0;
    const target = parseFloat(goal.targetAmount);
    const current = parseFloat(goal.currentAmount);
    return Math.min(100, (current / target) * 100);
  };

  const activeGoals = goals.slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-6 sticky top-0 bg-background/95 backdrop-blur-xl z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Insights</h1>
              <p className="text-sm text-muted-foreground">Your financial snapshot</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Financial Overview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Financial Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Income</div>
              <div className="text-2xl font-bold text-foreground">${totalIncome.toFixed(2)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
              <div className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</div>
            </Card>
          </div>
        </div>

        {/* Top Spending Categories */}
        {insights.topSpendingCategories && insights.topSpendingCategories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Top Spending</h2>
            </div>
            <Card className="p-4 space-y-3">
              {insights.topSpendingCategories.slice(0, 3).map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{category.category}</span>
                    <span className="text-sm text-muted-foreground">${category.amount.toFixed(2)}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Active Goals</h2>
              </div>
              <Link href="/goals">
                <Button variant="ghost" size="sm" data-testid="button-view-all-goals">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <Card key={goal.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                    </div>
                    {goal.targetAmount && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          ${goal.currentAmount || 0} / ${goal.targetAmount}
                        </div>
                      </div>
                    )}
                  </div>
                  {goal.targetAmount && (
                    <Progress value={getProgressPercent(goal)} className="h-2 mt-2" />
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {insights.advice && insights.advice.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">AI Insights</h2>
            </div>
            <Card className="p-4 space-y-3">
              {insights.advice.slice(0, 3).map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full" data-testid="button-go-dashboard">
              Full Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/goals">
            <Button variant="outline" className="w-full" data-testid="button-go-goals">
              Manage Goals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <PersistentAvatar />
    </div>
  );
}
