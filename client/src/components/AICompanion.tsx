import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { CompanionSettings } from "@shared/schema";

interface AICompanionProps {
  userId: string;
}

const avatarEmotions = {
  happy: "😊",
  excited: "✨",
  thoughtful: "🤔",
  caring: "💛",
  proud: "🌟",
  supportive: "🤗",
};

const avatarColors = {
  friendly: "bg-primary/20 border-primary",
  professional: "bg-accent/20 border-accent",
  playful: "bg-chart-2/20 border-chart-2",
  calm: "bg-chart-4/20 border-chart-4",
};

export function AICompanion({ userId }: AICompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emotion, setEmotion] = useState<keyof typeof avatarEmotions>("happy");

  const { data: settings } = useQuery<CompanionSettings>({
    queryKey: ["/api/companion-settings", userId],
  });

  const companionName = settings?.name || "Buddy";
  const avatarStyle = (settings?.avatarStyle || "friendly") as keyof typeof avatarColors;
  const currentEmotion = (settings?.emotion || "happy") as keyof typeof avatarEmotions;

  useEffect(() => {
    setEmotion(currentEmotion);
  }, [currentEmotion]);

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <>
      <motion.div
        className="fixed bottom-20 right-4 z-50 md:bottom-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div animate={pulseAnimation}>
          <Button
            size="icon"
            className={`h-16 w-16 rounded-full ${avatarColors[avatarStyle]} border-2 shadow-lg hover:shadow-xl transition-all relative`}
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-ai-companion-toggle"
          >
            <motion.div
              className="text-3xl"
              animate={{
                rotate: isOpen ? 0 : [0, -10, 10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: isOpen ? 0 : Infinity,
                repeatDelay: 3,
              }}
            >
              {avatarEmotions[emotion]}
            </motion.div>
            {!isOpen && (
              <motion.div
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            )}
          </Button>
        </motion.div>

        {!isOpen && (
          <motion.div
            className="absolute -top-12 right-0 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="text-sm font-medium">Hey! I'm {companionName} 👋</p>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:inset-auto md:bottom-24 md:right-4 md:w-96 md:h-[600px] md:rounded-xl md:shadow-2xl md:bg-card md:border md:border-border"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            data-testid="container-ai-companion-chat"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${avatarColors[avatarStyle]} border-2 flex items-center justify-center text-xl`}>
                    {avatarEmotions[emotion]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground" data-testid="text-companion-name">
                      {companionName}
                    </h3>
                    <p className="text-xs text-muted-foreground">Your AI Financial Coach</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-close-companion"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                <iframe
                  src="/chat"
                  className="w-full h-full border-0"
                  title="AI Companion Chat"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
