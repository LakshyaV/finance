import ChatInput from '../ChatInput';

export default function ChatInputExample() {
  const handleSend = (message: string) => {
    console.log('Message sent:', message);
  };

  return (
    <div className="w-full">
      <ChatInput onSend={handleSend} />
    </div>
  );
}
