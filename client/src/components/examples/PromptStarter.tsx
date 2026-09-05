import PromptStarter from '../PromptStarter';
import { TrendingUp, Target, DollarSign } from 'lucide-react';

export default function PromptStarterExample() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      <PromptStarter 
        icon={TrendingUp}
        title="Weekly reflection"
        description="How did my spending look this week?"
        onClick={() => console.log('Weekly reflection clicked')}
      />
      <PromptStarter 
        icon={Target}
        title="Dream a little"
        description="I've been thinking about..."
        onClick={() => console.log('Dream clicked')}
      />
      <PromptStarter 
        icon={DollarSign}
        title="Quick check-in"
        description="Where am I financially compared to my goals?"
        onClick={() => console.log('Check-in clicked')}
      />
    </div>
  );
}
