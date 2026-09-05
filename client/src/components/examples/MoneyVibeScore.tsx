import MoneyVibeScore from '../MoneyVibeScore';

export default function MoneyVibeScoreExample() {
  return (
    <div className="max-w-md mx-auto p-4">
      <MoneyVibeScore score={75} label="This Week's Money Vibe" />
    </div>
  );
}
