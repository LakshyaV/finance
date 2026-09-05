import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { Sparkles, Target, TrendingUp, Heart } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "What brings you here?",
    subtitle: "Tell me what's on your mind",
    options: [
      { label: "I want to save for something specific", icon: Target },
      { label: "I need to understand my spending better", icon: TrendingUp },
      { label: "I want to build financial security", icon: Heart },
      { label: "Just exploring and curious", icon: Sparkles }
    ]
  },
  {
    id: 2,
    title: "How would you describe yourself?",
    subtitle: "No judgment, just getting to know you",
    options: [
      { label: "Conservative - I like to play it safe" },
      { label: "Balanced - A bit of both" },
      { label: "Adventurous - I'm willing to take risks" },
      { label: "Not sure yet" }
    ]
  },
  {
    id: 3,
    title: "What's your biggest priority?",
    subtitle: "We'll tailor everything to what matters most to you",
    options: [
      { label: "Travel & experiences" },
      { label: "Moving out / independence" },
      { label: "Supporting family" },
      { label: "Career & education" }
    ]
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [selections, setSelections] = useState<string[]>([]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  const handleSelect = (option: string) => {
    const newSelections = [...selections, option];
    setSelections(newSelections);

    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      //todo: remove mock functionality - Save user preferences
      setTimeout(() => setLocation("/"), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[hsl(250_70%_65%)]">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">First Date with Budgety</h1>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <Card className="p-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
            <p className="text-muted-foreground">{step.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {step.options.map((option, index) => {
              const Icon = 'icon' in option ? option.icon : null;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className="h-auto py-4 justify-start gap-3 text-left hover-elevate"
                  onClick={() => handleSelect(option.label)}
                  data-testid={`button-option-${index}`}
                >
                  {Icon && <Icon className="w-5 h-5 text-primary shrink-0" />}
                  <span className="flex-1">{option.label}</span>
                </Button>
              );
            })}
          </div>

          {currentStep > 0 && (
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setCurrentStep(currentStep - 1)}
              data-testid="button-back"
            >
              ← Back
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
