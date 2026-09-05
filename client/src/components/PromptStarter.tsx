import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PromptStarterProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export default function PromptStarter({ icon: Icon, title, description, onClick }: PromptStarterProps) {
  return (
    <Card 
      className="p-4 hover-elevate cursor-pointer transition-all" 
      onClick={onClick}
      data-testid={`starter-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}
