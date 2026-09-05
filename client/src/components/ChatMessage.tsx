import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ChatMessageProps {
  type: "ai" | "user";
  content: string;
  timestamp?: string;
}

export default function ChatMessage({ type, content, timestamp }: ChatMessageProps) {
  const isAI = type === "ai";

  return (
    <div className={cn("flex mb-4", isAI ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-5 py-3.5 animate-in slide-in-from-bottom-2 duration-300",
        isAI 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "bg-card text-card-foreground shadow-sm border border-border"
      )}>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-2 opacity-60",
            isAI ? "text-primary-foreground" : "text-muted-foreground"
          )}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
