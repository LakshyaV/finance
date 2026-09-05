import MetricCard from '../MetricCard';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <MetricCard 
        title="Net Worth" 
        value="$12,450" 
        change={8.5}
        trend="up"
        icon={<TrendingUp className="w-5 h-5" />}
      />
      <MetricCard 
        title="Weekly Spending" 
        value="$287" 
        change={-12}
        trend="down"
        icon={<Wallet className="w-5 h-5" />}
      />
      <MetricCard 
        title="Savings Goal" 
        value="$3,200" 
        change={15}
        trend="up"
        icon={<DollarSign className="w-5 h-5" />}
      />
    </div>
  );
}
