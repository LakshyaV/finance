import { CohereClient } from "cohere-ai";
import type { Transaction } from "@shared/schema";

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function generateFinancialInsights(
  transactions: Transaction[]
): Promise<{
  summary: string;
  topSpendingCategories: Array<{ category: string; amount: number; percentage: number }>;
  advice: string[];
}> {
  if (transactions.length === 0) {
    return {
      summary: "Start tracking your transactions to get personalized insights!",
      topSpendingCategories: [],
      advice: ["Log your first transaction to begin your financial journey"],
    };
  }

  const expenses = transactions.filter(tx => tx.type === "expense");
  const totalExpenses = expenses.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  
  const categoryTotals = new Map<string, number>();
  expenses.forEach(tx => {
    const current = categoryTotals.get(tx.category) || 0;
    categoryTotals.set(tx.category, current + parseFloat(tx.amount));
  });

  const topSpendingCategories = Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  try {
    const transactionSummary = transactions.slice(0, 20).map(tx => 
      `${tx.type === "income" ? "+" : "-"}$${tx.amount} - ${tx.category}${tx.description ? `: ${tx.description}` : ""}`
    ).join("\n");

    const prompt = `You're a supportive financial wellness coach analyzing someone's spending. 

Recent transactions:
${transactionSummary}

Top spending categories:
${topSpendingCategories.map(cat => `${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`).join("\n")}

Provide:
1. A brief, friendly summary of their financial situation (2-3 sentences, supportive tone)
2. 3-4 specific, actionable pieces of advice

Return as JSON:
{
  "summary": "...",
  "advice": ["...", "...", "..."]
}`;

    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      responseFormat: {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            advice: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["summary", "advice"]
        }
      },
      maxTokens: 400,
    });

    const content = response.text;
    if (!content) {
      return {
        summary: "Keep tracking your transactions to build better financial habits!",
        topSpendingCategories,
        advice: ["Continue logging your transactions", "Review your spending weekly"],
      };
    }

    const result = JSON.parse(content);
    return {
      summary: result.summary || "Keep up the great work tracking your finances!",
      topSpendingCategories,
      advice: result.advice || [],
    };
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return {
      summary: "You're doing great tracking your spending! Keep it up to see patterns emerge.",
      topSpendingCategories,
      advice: [
        "Continue logging all your transactions",
        "Review your spending weekly",
        "Set realistic savings goals",
      ],
    };
  }
}
