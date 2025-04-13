"use client";
import { useState } from 'react';

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput("");

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    });
    const { reply } = await res.json();

    setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
  };

  return (
    <div className="border rounded-lg p-4 max-w-md">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 my-1 rounded ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Ask about the HR app..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}