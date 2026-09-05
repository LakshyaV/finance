import GoalCard from '../GoalCard';

export default function GoalCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 max-w-4xl mx-auto">
      <GoalCard 
        title="Europe Trip"
        currentAmount={1850}
        targetAmount={3500}
        deadline="June 2025"
        category="short-term"
      />
      <GoalCard 
        title="Emergency Fund"
        currentAmount={4200}
        targetAmount={10000}
        deadline="Dec 2025"
        category="long-term"
      />
    </div>
  );
}
