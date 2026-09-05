import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import MetricCard from "@/components/MetricCard";
import MoneyVibeScore from "@/components/MoneyVibeScore";
import PeerBenchmark from "@/components/PeerBenchmark";
import { Wallet, TrendingUp, PiggyBank, Plus, ShoppingBag, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const transactionSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  type: z.enum(["expense", "income"]),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const categories = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Bills & Utilities",
  "Health & Fitness",
  "Travel",
  "Other",
];

export default function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: transactionsData } = useQuery<{ transactions: any[] }>({
    queryKey: ["/api/transactions"],
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
  const insights = insightsData || { summary: "", topSpendingCategories: [], advice: [] };

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      type: "expense",
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to log transaction");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Transaction logged!",
        description: "Your spending has been tracked.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to log transaction",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TransactionFormData) => {
    createTransactionMutation.mutate(data);
  };

  const totalExpenses = transactions
    .filter((tx: any) => tx.type === "expense")
    .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);

  const totalIncome = transactions
    .filter((tx: any) => tx.type === "income")
    .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);

  const netWorth = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-6 sticky top-0 bg-background/95 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-[hsl(260_70%_65%)] to-[hsl(250_70%_70%)] bg-clip-text text-transparent">
              Your Financial Snapshot
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track your money flow</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-log-transaction">
                <Plus className="w-4 h-4 mr-2" />
                Log Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a Transaction</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-transaction-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            data-testid="input-transaction-amount"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-transaction-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What was this for?"
                            {...field}
                            data-testid="input-transaction-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createTransactionMutation.isPending}
                    data-testid="button-submit-transaction"
                  >
                    {createTransactionMutation.isPending ? "Logging..." : "Log Transaction"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Net Balance"
            value={`$${netWorth.toFixed(2)}`}
            change={0}
            trend="neutral"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <MetricCard
            title="Total Income"
            value={`$${totalIncome.toFixed(2)}`}
            change={0}
            trend="up"
            icon={<Wallet className="w-5 h-5" />}
          />
          <MetricCard
            title="Total Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            change={0}
            trend="down"
            icon={<PiggyBank className="w-5 h-5" />}
          />
        </div>

        {insights.summary && (
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">AI Financial Insights</h3>
                <p className="text-muted-foreground">{insights.summary}</p>
              </div>
            </div>
            
            {insights.topSpendingCategories.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Top Spending Categories</h4>
                <div className="space-y-2">
                  {insights.topSpendingCategories.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <span className="text-sm">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-16 text-right">
                          ${cat.amount.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights.advice.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold">Personalized Advice</h4>
                </div>
                <ul className="space-y-2">
                  {insights.advice.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoneyVibeScore score={75} label="This Week's Money Vibe" />
          <PeerBenchmark
            userPercentile={68}
            metric="Savings Rate"
            comparisonGroup="Gen Z in your region (18-25)"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
          </div>
          
          {transactions.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-6">
                Start tracking your spending by logging your first transaction
              </p>
              <Button onClick={() => setIsDialogOpen(true)} data-testid="button-first-transaction">
                <Plus className="w-4 h-4 mr-2" />
                Log First Transaction
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((tx: any) => (
                <Card key={tx.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{tx.category}</p>
                      {tx.description && (
                        <p className="text-sm text-muted-foreground">{tx.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}>
                      {tx.type === "income" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setLocation("/")}
            data-testid="button-chat-about-this"
          >
            Talk to Budgety about this
          </Button>
        </div>
      </main>
    </div>
  );
}
