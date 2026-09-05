import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, Target, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CheckinType = {
  id: string;
  icon: any;
  title: string;
  description: string;
  frequency: string;
  enabled: boolean;
};

export default function CheckinSettings() {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const [checkins, setCheckins] = useState<CheckinType[]>([
    {
      id: "daily-mood",
      icon: MessageCircle,
      title: "Daily Money Mood",
      description: "Quick check-in: How are you feeling about money today?",
      frequency: "Daily at 9 AM",
      enabled: false,
    },
    {
      id: "weekly-review",
      icon: TrendingUp,
      title: "Weekly Spending Review",
      description: "Let's reflect on how your week went financially",
      frequency: "Sundays at 6 PM",
      enabled: false,
    },
    {
      id: "goal-progress",
      icon: Target,
      title: "Goal Progress Nudges",
      description: "Celebrate wins and stay on track with your goals",
      frequency: "Fridays at 5 PM",
      enabled: false,
    },
  ]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      setNotificationsEnabled(true);
      toast({
        title: "Notifications enabled!",
        description: "You'll get friendly check-ins to help you stay on track",
      });
      
      new Notification("Budgety notifications are on! 🎉", {
        body: "We'll send you gentle reminders to check in about your money goals",
        icon: "/icon.png",
      });
    } else {
      toast({
        title: "Notifications blocked",
        description: "Enable notifications in your browser settings to get check-ins",
        variant: "destructive",
      });
    }
  };

  const toggleCheckin = (id: string) => {
    setCheckins(prev => 
      prev.map(checkin => 
        checkin.id === id 
          ? { ...checkin, enabled: !checkin.enabled }
          : checkin
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Enable Check-in Notifications</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get gentle nudges to reflect on your finances and celebrate progress
            </p>
            <Button 
              onClick={requestNotificationPermission}
              disabled={notificationsEnabled}
              data-testid="button-enable-notifications"
            >
              {notificationsEnabled ? "Notifications Enabled" : "Enable Notifications"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">Your Check-ins</h3>
        {checkins.map((checkin) => {
          const Icon = checkin.icon;
          return (
            <Card key={checkin.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{checkin.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{checkin.description}</p>
                      <p className="text-xs text-muted-foreground">{checkin.frequency}</p>
                    </div>
                    <Switch
                      checked={checkin.enabled}
                      onCheckedChange={() => toggleCheckin(checkin.id)}
                      disabled={!notificationsEnabled}
                      data-testid={`switch-${checkin.id}`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
