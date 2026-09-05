import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export default function ChatInput({ onSend, placeholder = "Share what's on your mind..." }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useVoiceInput();
  const { toast } = useToast();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
      resetTranscript();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    if (!isSupported) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast({
        title: "Listening...",
        description: "Speak naturally about your money thoughts",
      });
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-background/95 backdrop-blur-sm border-t pointer-events-auto">
      <div className="flex items-end gap-3 w-full">
        <Button
          onClick={toggleVoiceInput}
          size="icon"
          variant="outline"
          className={`rounded-full h-12 w-12 shrink-0 shadow-sm ${
            isListening ? "bg-primary text-primary-foreground animate-pulse border-primary" : ""
          }`}
          data-testid="button-voice"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : placeholder}
          className="min-h-[52px] max-h-[120px] resize-none rounded-2xl px-5 py-3.5 text-base focus-visible:ring-2 focus-visible:ring-primary shadow-sm border-2 flex-1"
          data-testid="input-chat"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-full h-12 w-12 shrink-0 shadow-sm bg-primary"
          disabled={!message.trim()}
          data-testid="button-send"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
