import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PersistentAvatar } from "@/components/PersistentAvatar";
import BottomNav from "@/components/BottomNav";
import Chat from "@/pages/Chat";
import Insights from "@/pages/Insights";
import Dashboard from "@/pages/Dashboard";
import Goals from "@/pages/Goals";
import Onboarding from "@/pages/Onboarding";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Chat} />
      <Route path="/insights" component={Insights} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/goals" component={Goals} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const showBottomNav = ["/", "/insights"].includes(location);
  const showAvatar = !["/", "/insights", "/onboarding"].includes(location);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        {showBottomNav && <BottomNav />}
        {showAvatar && <PersistentAvatar />}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
