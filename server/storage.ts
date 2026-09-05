import { type User, type InsertUser, type ChatSession, type InsertChatSession, type ChatMessage, type InsertChatMessage, type Goal, type InsertGoal, type Transaction, type InsertTransaction, type CompanionSettings, type InsertCompanionSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getChatSessions(userId: string): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<void>;
  
  getChatMessages(userId: string, sessionId?: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearChatMessages(userId: string, sessionId?: string): Promise<void>;
  
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined>;
  
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  getCompanionSettings(userId: string): Promise<CompanionSettings>;
  updateCompanionSettings(settings: InsertCompanionSettings): Promise<CompanionSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatSessions: Map<string, ChatSession>;
  private chatMessages: Map<string, ChatMessage>;
  private goals: Map<string, Goal>;
  private transactions: Map<string, Transaction>;
  private companionSettings: Map<string, CompanionSettings>;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.goals = new Map();
    this.transactions = new Map();
    this.companionSettings = new Map();
    
    // Initialize with dummy transactions for demo user
    this.initializeDummyData();
  }

  private initializeDummyData() {
    const demoUserId = "demo-user-001";
    const now = new Date();
    
    // Add recent transactions to give AI context for financial discussions
    const dummyTransactions: InsertTransaction[] = [
      { userId: demoUserId, amount: "-45.50", category: "Food & Dining", description: "Brunch at cafe", date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "-120.00", category: "Shopping", description: "New shoes", date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "-15.99", category: "Subscriptions", description: "Spotify Premium", date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "2500.00", category: "Income", description: "Monthly paycheck", date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), type: "income" },
      { userId: demoUserId, amount: "-850.00", category: "Housing", description: "Rent payment", date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "-32.50", category: "Food & Dining", description: "Groceries", date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "-75.00", category: "Entertainment", description: "Concert tickets", date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "-50.00", category: "Transportation", description: "Gas", date: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "-12.99", category: "Subscriptions", description: "Netflix", date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), type: "expense" },
      { userId: demoUserId, amount: "-28.00", category: "Food & Dining", description: "Coffee shop", date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), type: "expense" },
    ];

    dummyTransactions.forEach(tx => {
      const id = randomUUID();
      const transaction: Transaction = { 
        ...tx, 
        id, 
        description: tx.description || null,
        date: tx.date || new Date(),
        type: tx.type || "expense",
        createdAt: new Date() 
      };
      this.transactions.set(id, transaction);
    });

    // Add a sample financial goal
    const goalId = randomUUID();
    const sampleGoal: Goal = {
      id: goalId,
      userId: demoUserId,
      title: "Emergency Fund",
      description: "Build 3 months of expenses",
      targetAmount: "5000",
      currentAmount: "1200",
      deadline: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
      status: "in_progress",
      aiSteps: null,
      createdAt: new Date()
    };
    this.goals.set(goalId, sampleGoal);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      title: insertSession.title || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteChatSession(id: string): Promise<void> {
    this.chatSessions.delete(id);
    const messagesToDelete = Array.from(this.chatMessages.entries())
      .filter(([_, msg]) => msg.sessionId === id)
      .map(([msgId]) => msgId);
    messagesToDelete.forEach(msgId => this.chatMessages.delete(msgId));
  }

  async getChatMessages(userId: string, sessionId?: string, limit: number = 100): Promise<ChatMessage[]> {
    let userMessages = Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId);
    
    if (sessionId) {
      userMessages = userMessages.filter(msg => msg.sessionId === sessionId);
    }
    
    return userMessages
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      sessionId: insertMessage.sessionId || null,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async clearChatMessages(userId: string, sessionId?: string): Promise<void> {
    const messagesToDelete = Array.from(this.chatMessages.entries())
      .filter(([_, msg]) => {
        if (sessionId) {
          return msg.userId === userId && msg.sessionId === sessionId;
        }
        return msg.userId === userId;
      })
      .map(([id]) => id);
    
    messagesToDelete.forEach(id => this.chatMessages.delete(id));
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = {
      ...insertGoal,
      id,
      status: insertGoal.status || "active",
      description: insertGoal.description || null,
      targetAmount: insertGoal.targetAmount || null,
      currentAmount: insertGoal.currentAmount || null,
      deadline: insertGoal.deadline || null,
      aiSteps: insertGoal.aiSteps || null,
      createdAt: new Date(),
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async getTransactions(userId: string, limit?: number): Promise<Transaction[]> {
    const userTransactions = Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  async createTransaction(insertTx: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTx,
      id,
      type: insertTx.type || "expense",
      date: insertTx.date || new Date(),
      description: insertTx.description || null,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getCompanionSettings(userId: string): Promise<CompanionSettings> {
    const existing = Array.from(this.companionSettings.values()).find(
      (s) => s.userId === userId
    );
    
    if (existing) return existing;
    
    const defaultSettings: CompanionSettings = {
      id: randomUUID(),
      userId,
      name: "Buddy",
      avatarStyle: "friendly",
      emotion: "😊",
      personality: "supportive",
      updatedAt: new Date(),
    };
    
    this.companionSettings.set(defaultSettings.id, defaultSettings);
    return defaultSettings;
  }

  async updateCompanionSettings(insertSettings: InsertCompanionSettings): Promise<CompanionSettings> {
    const existing = Array.from(this.companionSettings.values()).find(
      (s) => s.userId === insertSettings.userId
    );
    
    if (existing) {
      const updated: CompanionSettings = {
        ...existing,
        ...insertSettings,
        updatedAt: new Date(),
      };
      this.companionSettings.set(existing.id, updated);
      return updated;
    }
    
    const id = randomUUID();
    const settings: CompanionSettings = {
      id,
      userId: insertSettings.userId,
      name: insertSettings.name || "Buddy",
      avatarStyle: insertSettings.avatarStyle || "friendly",
      emotion: insertSettings.emotion || "😊",
      personality: insertSettings.personality || "supportive",
      updatedAt: new Date(),
    };
    this.companionSettings.set(id, settings);
    return settings;
  }
}

export const storage = new MemStorage();
