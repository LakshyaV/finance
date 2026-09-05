import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 p-4">
      <ChatMessage 
        type="ai" 
        content="Hey! I'm Budgety, your AI financial coach. Ready to take control of your money? Let's start with the basics - what's your biggest financial goal right now?" 
        timestamp="2:34 PM"
      />
      <ChatMessage 
        type="user" 
        content="I want to save up for a trip to Europe this summer" 
        timestamp="2:35 PM"
      />
      <ChatMessage 
        type="ai" 
        content="Love it! Europe is calling your name. Let's break this down - when are you planning to go and what's your budget looking like?" 
        timestamp="2:35 PM"
      />
    </div>
  );
}
