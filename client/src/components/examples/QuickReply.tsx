import QuickReply from '../QuickReply';

export default function QuickReplyExample() {
  const handleSelect = (option: string) => {
    console.log('Selected:', option);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <QuickReply 
        options={[
          "How am I doing?",
          "Plan a trip",
          "Weekly check-in",
          "Save for a goal",
          "Split my paycheck"
        ]}
        onSelect={handleSelect}
      />
    </div>
  );
}
