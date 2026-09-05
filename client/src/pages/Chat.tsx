import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Menu, LayoutDashboard, Target as GoalIcon, Settings as SettingsIcon, MessageCircle, CalendarDays, TrendingUp, GraduationCap, Sparkles, PlusCircle, History } from "lucide-react";
import type { CompanionSettings } from "@shared/schema";

type Message = {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: string;
};

type ChatSession = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

function ChatHistoryList({ currentSessionId, onSelectSession }: { currentSessionId: string | null; onSelectSession: (id: string | null) => void }) {
  const { data: sessionsData } = useQuery<{ sessions: ChatSession[] }>({
    queryKey: ['/api/chat/sessions'],
  });

  const sessions = sessionsData?.sessions || [];

  return (
    <div className="mt-6 space-y-2">
      <Button
        variant={currentSessionId === null ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => onSelectSession(null)}
        data-testid="button-current-session"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Current Session
      </Button>
      
      {sessions.length > 0 && (
        <div className="space-y-2 mt-4">
          <div className="text-sm font-semibold text-muted-foreground px-2">Past Conversations</div>
          {sessions.map((session) => (
            <Button
              key={session.id}
              variant={currentSessionId === session.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => onSelectSession(session.id)}
              data-testid={`button-session-${session.id}`}
            >
              <History className="h-4 w-4 mr-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="truncate">{session.title || 'Untitled Chat'}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}

      {sessions.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No past conversations yet
        </div>
      )}
    </div>
  );
}

const promptCategories = {
  general: {
    aiPrompt: "Hey! How's your day been? Anything on your mind about money or finances?",
    examples: [
      "I'm feeling stressed about money lately",
      "How can I start building better financial habits?",
      "I want to understand my spending patterns",
      "What should I focus on financially right now?",
      "How do I balance saving and enjoying life?",
      "Did you make a big purchase today?",
    ],
  },
  planning: {
    aiPrompt: "Let's plan ahead! What financial goals or upcoming expenses are you thinking about?",
    examples: [
      "I need help creating a budget for next month",
      "How should I plan for an upcoming expense?",
      "I want to set up a savings plan",
      "Help me prioritize my financial goals",
      "How can I prepare for unexpected costs?",
      "What's the best way to save for a trip?",
    ],
  },
  tracking: {
    aiPrompt: "How did this week go financially? I'd love to hear about your spending, saving, or any wins!",
    examples: [
      "I spent more than I planned this week",
      "Let me share what I spent money on recently",
      "I made some good financial choices this week",
      "I resisted a big purchase today",
      "Here's how my week went financially",
      "I stayed within budget this week!",
    ],
  },
  learning: {
    aiPrompt: "What would you like to learn about? I can help you understand any financial topic!",
    examples: [
      "Teach me about investing basics",
      "What are credit scores and why do they matter?",
      "How does compound interest work?",
      "Explain different types of savings accounts",
      "What should I know about taxes?",
      "How do I start building credit?",
    ],
  },
};

const getCategoryPrompts = () => {
  const shuffleArray = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);
  
  return {
    general: {
      aiPrompt: promptCategories.general.aiPrompt,
      examples: shuffleArray(promptCategories.general.examples).slice(0, 2),
    },
    planning: {
      aiPrompt: promptCategories.planning.aiPrompt,
      examples: shuffleArray(promptCategories.planning.examples).slice(0, 2),
    },
    tracking: {
      aiPrompt: promptCategories.tracking.aiPrompt,
      examples: shuffleArray(promptCategories.tracking.examples).slice(0, 2),
    },
    learning: {
      aiPrompt: promptCategories.learning.aiPrompt,
      examples: shuffleArray(promptCategories.learning.examples).slice(0, 2),
    },
  };
};

const DEMO_USER_ID = "demo-user-001";

const avatarStyleColors = {
  friendly: "bg-primary/20 border-primary",
  professional: "bg-accent/20 border-accent",
  playful: "bg-chart-2/20 border-chart-2",
  calm: "bg-chart-4/20 border-chart-4"
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showStarters, setShowStarters] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [categoryPrompts] = useState(getCategoryPrompts());

  const { data: companionSettings } = useQuery<CompanionSettings>({
    queryKey: ['/api/companion-settings', DEMO_USER_ID],
  });

  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const url = currentSessionId 
          ? `/api/chat/history?sessionId=${currentSessionId}` 
          : "/api/chat/history";
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
          const formattedMessages = data.messages.map((msg: any) => ({
            id: msg.id,
            type: msg.role === "user" ? "user" as const : "ai" as const,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }));
          
          setMessages(formattedMessages);
          setShowStarters(false);
        } else {
          const greetingMessage: Message = {
            id: "greeting",
            type: "ai",
            content: "Hey - what's on your mind about money?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages([greetingMessage]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        const greetingMessage: Message = {
          id: "greeting",
          type: "ai",
          content: "Hey - what's on your mind about money?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([greetingMessage]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [currentSessionId]);

  const handleSend = async (content: string) => {
    setShowStarters(false);
    
    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Auto-create a session if one doesn't exist
      let sessionId = currentSessionId;
      if (!sessionId) {
        const sessionResponse = await fetch("/api/chat/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: `Chat ${new Date().toLocaleDateString()}` }),
        });
        const sessionData = await sessionResponse.json();
        sessionId = sessionData.session.id;
        setCurrentSessionId(sessionId);
        queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
      }

      const conversationHistory = messages
        .filter(m => m.id !== "greeting")
        .map(m => ({
          role: m.type === "user" ? "user" as const : "assistant" as const,
          content: m.content
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: content,
          sessionId,
          conversationHistory 
        }),
      });

      const data = await response.json();
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleStarterClick = (categoryPrompt: string) => {
    setShowStarters(false);
    
    // Replace greeting with the category-specific AI prompt
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: "ai",
      content: categoryPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([aiMessage]);
  };

  const startNewChat = async () => {
    try {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `Chat ${new Date().toLocaleDateString()}` }),
      });
      const data = await response.json();
      setCurrentSessionId(data.session.id);
      setMessages([{
        id: "greeting",
        type: "ai",
        content: "Hey - what's on your mind about money?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setShowStarters(true);
      
      // Invalidate sessions query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
    } catch (error) {
      console.error("Failed to create new chat session:", error);
    }
  };

  const avatarColor = avatarStyleColors[companionSettings?.avatarStyle as keyof typeof avatarStyleColors] || avatarStyleColors.friendly;
  const companionName = companionSettings?.name || "Buddy";
  const companionEmotion = companionSettings?.emotion || "😊";

  return (
    <div className="flex flex-col h-screen bg-background pb-16">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/goals">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-goals">
                    <GoalIcon className="h-4 w-4 mr-2" />
                    Goals
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-settings">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl ${avatarColor}`}>
              {companionEmotion}
            </div>
            <div>
              <div className="font-bold text-foreground" data-testid="text-companion-name">{companionName}</div>
              <div className="text-xs text-muted-foreground">Your AI financial coach</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && !showStarters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={startNewChat}
              data-testid="button-new-chat"
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-history">
                <History className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Chat History</SheetTitle>
              </SheetHeader>
              <ChatHistoryList currentSessionId={currentSessionId} onSelectSession={setCurrentSessionId} />
            </SheetContent>
          </Sheet>
          <div className="text-xs text-muted-foreground hidden sm:block">Powered by Interac</div>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}

            {showStarters && messages.length <= 1 && (
              <div className="space-y-6 mt-8">
                {/* Fun decorative elements */}
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <p className="text-sm text-muted-foreground">Pick a conversation starter or type your own!</p>
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>

                {/* 2x2 Grid of Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* General Conversations */}
                  <button
                    onClick={() => handleStarterClick(categoryPrompts.general.aiPrompt)}
                    className="p-4 rounded-2xl bg-card border-2 border-border hover-elevate active-elevate-2 transition-all text-left group"
                    data-testid="button-category-general"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[hsl(52_100%_71%)] flex items-center justify-center shadow-lg shrink-0">
                        <MessageCircle className="w-6 h-6 text-[hsl(52_10%_10%)]" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">What do you want to talk about?</h3>
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Examples:</p>
                      <p className="text-sm text-muted-foreground/80">
                        • {categoryPrompts.general.examples[0]}
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        • {categoryPrompts.general.examples[1]}
                      </p>
                    </div>
                  </button>

                  {/* Planning & Budgeting */}
                  <button
                    onClick={() => handleStarterClick(categoryPrompts.planning.aiPrompt)}
                    className="p-4 rounded-2xl bg-card border-2 border-border hover-elevate active-elevate-2 transition-all text-left group"
                    data-testid="button-category-planning"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[hsl(45_90%_65%)] flex items-center justify-center shadow-lg shrink-0">
                        <CalendarDays className="w-6 h-6 text-[hsl(45_10%_10%)]" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">Planning & Budgeting</h3>
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Examples:</p>
                      <p className="text-sm text-muted-foreground/80">
                        • {categoryPrompts.planning.examples[0]}
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        • {categoryPrompts.planning.examples[1]}
                      </p>
                    </div>
                  </button>

                  {/* What did you do this week? */}
                  <button
                    onClick={() => handleStarterClick(categoryPrompts.tracking.aiPrompt)}
                    className="p-4 rounded-2xl bg-card border-2 border-border hover-elevate active-elevate-2 transition-all text-left group"
                    data-testid="button-category-tracking"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[hsl(52_90%_60%)] flex items-center justify-center shadow-lg shrink-0">
                        <TrendingUp className="w-6 h-6 text-[hsl(52_10%_10%)]" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">What did you do this week?</h3>
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Examples:</p>
                      <p className="text-sm text-muted-foreground/80">
                        • {categoryPrompts.tracking.examples[0]}
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        • {categoryPrompts.tracking.examples[1]}
                      </p>
                    </div>
                  </button>

                  {/* Learning Topics */}
                  <button
                    onClick={() => handleStarterClick(categoryPrompts.learning.aiPrompt)}
                    className="p-4 rounded-2xl bg-card border-2 border-border hover-elevate active-elevate-2 transition-all text-left group"
                    data-testid="button-category-learning"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[hsl(45_85%_55%)] flex items-center justify-center shadow-lg shrink-0">
                        <GraduationCap className="w-6 h-6 text-[hsl(45_10%_10%)]" />
                      </div>
                      <h3 className="font-bold text-base text-foreground">Learning Topics</h3>
                    </div>
                    <div className="space-y-1.5 pl-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Examples:</p>
                      <p className="text-sm text-muted-foreground/80">
                        • {categoryPrompts.learning.examples[0]}
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        • {categoryPrompts.learning.examples[1]}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Fun bottom decoration */}
                <div className="flex items-center justify-center pt-2">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} placeholder="Type your message..." />
    </div>
  );
}
