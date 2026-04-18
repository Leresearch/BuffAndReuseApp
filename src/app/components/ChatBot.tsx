import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your Goodwill donation assistant. I can help you with:\n\n• Donation guidelines and policies\n• Item categorization and pricing\n• Inventory questions\n• Donor information\n• Location-specific needs\n\nWhat can I help you with today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('accept') || lowerMessage.includes('guideline') || lowerMessage.includes('donate')) {
      return 'We accept gently used clothing, furniture, household items, electronics, and books. We cannot accept items that are broken, heavily stained, or don\'t meet safety standards. For specific items, let me know what you\'d like to ask about!';
    }
    if (lowerMessage.includes('furniture')) {
      return 'For furniture donations: We accept tables, chairs, dressers, and sofas in good condition. Items must be clean, functional, and free of major damage. Large furniture may require special pickup - would you like information about scheduling?';
    }
    if (lowerMessage.includes('clothing') || lowerMessage.includes('clothes')) {
      return 'Clothing donations should be clean, gently used, and free of stains or tears. We accept all seasons and sizes. Please bag or box clothing separately from other items for easier processing.';
    }
    if (lowerMessage.includes('electronics')) {
      return 'Electronics must be in working condition with all necessary cords and accessories. We accept: computers, tablets, TVs (flat screen only), small appliances. We cannot accept CRT monitors or TVs due to disposal costs.';
    }
    if (lowerMessage.includes('location') || lowerMessage.includes('need')) {
      return 'Each location has different inventory needs. Currently, most locations need: winter coats, professional clothing, and household essentials. Would you like me to check specific location needs?';
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('value')) {
      return 'Pricing is determined by our pricing team based on condition, brand, and demand. General guidelines: clothing $3-15, furniture $20-200, electronics $10-100. Final prices may vary by location and item specifics.';
    }

    return 'I can help you with donation guidelines, item acceptance policies, pricing information, and location-specific needs. Could you please provide more details about what you\'d like to know?';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(userMessage.content),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-t border-[#e6f0f9] flex flex-col h-full">
        {/* Header */}
        <div className="p-4 bg-[#0053A0] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-base font-semibold">Donation Assistant</h3>
              <p className="text-xs text-white">Ask about donations</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scroll-container p-4 space-y-4 bg-[#e6f0f9]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-gray-600' : 'bg-[#0053A0]'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#0053A0] rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 safe-bottom">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about donations, guidelines, or policies..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0053A0]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-[#0053A0] text-white rounded-lg hover:bg-[#003d7a] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
