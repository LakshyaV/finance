import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar, DollarSign, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const goalSchema = z.object({
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  targetAmount: z.string().optional(),
  deadline: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

export default function Goals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: goalsData } = useQuery<{ goals: any[] }>({
    queryKey: ["/api/goals"],
  });

  const goals = goalsData?.goals || [];

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      targetAmount: "",
      deadline: "",
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create goal");
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setIsDialogOpen(false);
      form.reset();
      
      if (data.aiGenerationFailed) {
        toast({
          title: "Goal created!",
          description: "Your goal is saved. AI step generation is temporarily unavailable.",
        });
      } else {
        toast({
          title: "Goal created!",
          description: "AI has broken down your goal into actionable steps!",
        });
      }
    },
    onError: () => {
      toast({
        title: "Failed to create goal",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GoalFormData) => {
    createGoalMutation.mutate(data);
  };

  const getProgressPercent = (goal: any) => {
    if (!goal.targetAmount || !goal.currentAmount) return 0;
    const target = parseFloat(goal.targetAmount);
    const current = parseFloat(goal.currentAmount);
    return Math.min(100, (current / target) * 100);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-6 sticky top-0 bg-background/95 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Financial Goals</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your dreams and celebrate progress</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-goal">
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Goal</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's your goal?</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Save for Europe trip" {...field} data-testid="input-goal-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell me more (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What would achieving this mean to you?"
                            {...field}
                            data-testid="input-goal-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Amount (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="3000"
                            {...field}
                            data-testid="input-goal-amount"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field}
                            data-testid="input-goal-deadline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={createGoalMutation.isPending} data-testid="button-create-goal">
                    {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {goals.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by setting a financial goal - big or small. I'll help you break it down into doable steps.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-first-goal">
              <Plus className="w-4 h-4 mr-2" />
              Set Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal: any) => (
              <Card key={goal.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {goal.targetAmount && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        ${goal.currentAmount} / ${goal.targetAmount}
                      </span>
                    </div>
                    <Progress value={getProgressPercent(goal)} />
                  </div>
                )}

                {goal.deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                )}

                {goal.aiSteps && goal.aiSteps.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">AI-Suggested Steps</span>
                    </div>
                    <ul className="space-y-2">
                      {goal.aiSteps.slice(0, 3).map((step: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
