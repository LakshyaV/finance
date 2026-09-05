import PeerBenchmark from '../PeerBenchmark';

export default function PeerBenchmarkExample() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <PeerBenchmark 
        userPercentile={68}
        metric="Savings Rate"
        comparisonGroup="Gen Z in your region (18-25)"
      />
    </div>
  );
}
