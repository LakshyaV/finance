import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getFinancialCoachResponse } from "./openai";
import { generateGoalSteps } from "./goals";
import { generateFinancialInsights } from "./insights";
import { z } from "zod";

const DEMO_USER_ID = "demo-user-001";

const sendMessageSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).optional().default([]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      const sessions = await storage.getChatSessions(DEMO_USER_ID);
      res.json({ sessions });
    } catch (error) {
      console.error("Failed to get chat sessions:", error);
      res.status(500).json({ error: "Failed to get chat sessions" });
    }
  });

  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const { title } = req.body;
      const session = await storage.createChatSession({
        userId: DEMO_USER_ID,
        title,
      });
      res.json({ session });
    } catch (error) {
      console.error("Failed to create chat session:", error);
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  app.delete("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      await storage.deleteChatSession(req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete chat session:", error);
      res.status(500).json({ error: "Failed to delete chat session" });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    try {
      const { sessionId } = req.query;
      const messages = await storage.getChatMessages(
        DEMO_USER_ID, 
        sessionId as string | undefined, 
        50
      );
      res.json({ messages });
    } catch (error) {
      console.error("Failed to get chat history:", error);
      res.status(500).json({ error: "Failed to get chat history" });
    }
  });

  app.delete("/api/chat/history", async (req, res) => {
    try {
      const { sessionId } = req.query;
      await storage.clearChatMessages(DEMO_USER_ID, sessionId as string | undefined);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      res.status(500).json({ error: "Failed to clear chat history" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, conversationHistory } = sendMessageSchema.parse(req.body);
      
      await storage.createChatMessage({
        userId: DEMO_USER_ID,
        sessionId,
        role: "user",
        content: message,
      });
      
      if (sessionId) {
        await storage.updateChatSession(sessionId, { updatedAt: new Date() });
      }
      
      const companionSettings = await storage.getCompanionSettings(DEMO_USER_ID);
      
      let aiResponse: string;
      try {
        aiResponse = await getFinancialCoachResponse(
          message, 
          conversationHistory,
          {
            name: companionSettings.name,
            personality: companionSettings.personality,
          }
        );
      } catch (aiError: any) {
        console.error("OpenAI error:", aiError);
        
        if (aiError?.status === 429 || aiError?.message?.includes('quota') || aiError?.message?.includes('rate_limit')) {
          aiResponse = "I'm experiencing high demand right now and need a moment to catch my breath! 😊 While you wait, feel free to share more about what's on your mind - I'll be back to my helpful self in just a bit!";
        } else {
          aiResponse = "Oops! I got a bit tongue-tied there. Mind repeating that? I'm all ears! 👂";
        }
      }
      
      await storage.createChatMessage({
        userId: DEMO_USER_ID,
        sessionId,
        role: "assistant",
        content: aiResponse,
      });
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to get response" });
    }
  });

  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals(DEMO_USER_ID);
      res.json({ goals });
    } catch (error) {
      console.error("Failed to get goals:", error);
      res.status(500).json({ error: "Failed to get goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const { title, description, targetAmount, deadline } = req.body;
      
      let aiSteps: string[] = [];
      try {
        aiSteps = await generateGoalSteps(title, description, targetAmount, deadline);
      } catch (aiError) {
        console.warn("AI step generation failed, continuing without AI steps:", aiError);
      }
      
      const goal = await storage.createGoal({
        userId: DEMO_USER_ID,
        title,
        description,
        targetAmount,
        currentAmount: "0",
        deadline: deadline ? new Date(deadline) : undefined,
        status: "active",
        aiSteps: aiSteps.length > 0 ? aiSteps : null,
      });
      
      res.json({ 
        goal,
        aiGenerationFailed: aiSteps.length === 0 
      });
    } catch (error) {
      console.error("Failed to create goal:", error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(DEMO_USER_ID);
      res.json({ transactions });
    } catch (error) {
      console.error("Failed to get transactions:", error);
      res.status(500).json({ error: "Failed to get transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const { amount, category, description, type } = req.body;
      
      const transaction = await storage.createTransaction({
        userId: DEMO_USER_ID,
        amount,
        category,
        description,
        type: type || "expense",
        date: new Date(),
      });
      
      res.json({ transaction });
    } catch (error) {
      console.error("Failed to create transaction:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.get("/api/insights", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(DEMO_USER_ID);
      const insights = await generateFinancialInsights(transactions);
      res.json(insights);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  app.get("/api/companion-settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = await storage.getCompanionSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Failed to get companion settings:", error);
      res.status(500).json({ error: "Failed to get companion settings" });
    }
  });

  app.post("/api/companion-settings", async (req, res) => {
    try {
      const { name, avatarStyle, emotion, personality } = req.body;
      const settings = await storage.updateCompanionSettings({
        userId: DEMO_USER_ID,
        name,
        avatarStyle,
        emotion,
        personality,
      });
      res.json(settings);
    } catch (error) {
      console.error("Failed to update companion settings:", error);
      res.status(500).json({ error: "Failed to update companion settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
