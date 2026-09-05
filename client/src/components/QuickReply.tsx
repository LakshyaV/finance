import { Button } from "@/components/ui/button";

interface QuickReplyProps {
  options: string[];
  onSelect: (option: string) => void;
}

export default function QuickReply({ options, onSelect }: QuickReplyProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="rounded-full whitespace-nowrap shrink-0 border-primary/30 hover:border-primary"
          onClick={() => onSelect(option)}
          data-testid={`quick-reply-${index}`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
