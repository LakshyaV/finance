import InitiativeSlider from "@/components/InitiativeSlider";
import CheckinSettings from "@/components/CheckinSettings";
import CompanionCustomization from "@/components/CompanionCustomization";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, LogOut } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [initiativeLevel, setInitiativeLevel] = useState(50);

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b px-4 py-6 sticky top-0 bg-background/95 backdrop-blur-xl z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize your Budgety experience</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <CompanionCustomization />
        
        <CheckinSettings />
        
        <InitiativeSlider value={initiativeLevel} onChange={setInitiativeLevel} />

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" data-testid="button-edit-profile">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-data-privacy">
              <Shield className="w-4 h-4 mr-2" />
              Data & Privacy
            </Button>
          </div>
        </Card>

        <Button variant="outline" className="w-full text-destructive hover:text-destructive" data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </main>
    </div>
  );
}
