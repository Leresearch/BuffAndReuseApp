import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CorporateChatBotProps {
  onClose: () => void;
}

export function CorporateChatBot({ onClose }: CorporateChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Goodwill Corporate Analytics Assistant. I can help you with:\n\n• Cross-location performance analysis\n• Partnership strategies and recommendations\n• Staffing and resource optimization\n• Donation trends and forecasting\n• Revenue and efficiency metrics\n\nWhat would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Analytics and Performance
    if (lowerMessage.includes('perform') || lowerMessage.includes('metric') || lowerMessage.includes('analytic')) {
      return 'Based on current data:\n\n• Arlington is your top performer with 156 donations/day (+22% growth)\n• Greater Washington processes 127 donations/day with steady growth (+12%)\n• Falls Church needs attention with 98 donations/day (-5% decline)\n\nKey metrics: Total revenue $43K/day across all locations, 88% average processing efficiency. Would you like recommendations for improving underperforming locations?';
    }

    // Location-specific questions
    if (lowerMessage.includes('arlington') || lowerMessage.includes('glebe')) {
      return 'Arlington, Glebe Road Analysis:\n\n• Strongest performer: 156 donations/day\n• Specialization: Children\'s items (40% of inventory)\n• Revenue: $9,850/day (+28% growth)\n• Status: Operating at high capacity\n\nRecommendation: Add 2-3 staff during peak hours and deploy AI image recognition to maintain efficiency. This location\'s success strategies should be studied and replicated.';
    }

    if (lowerMessage.includes('falls church') || lowerMessage.includes('annandale rd')) {
      return 'West Falls Church Analysis:\n\n• Volume: 98 donations/day\n• Decline: -5% this week\n• Specialization: Furniture (39% of inventory)\n• Revenue: $6,730/day\n\nRecommendations:\n• Increase local marketing spend by $500-1000/month\n• Partner with 2-3 local community organizations\n• Review donation hours and accessibility\n• Consider reassigning 1-2 staff to higher-volume locations temporarily';
    }

    if (lowerMessage.includes('washington') || lowerMessage.includes('greater washington') || lowerMessage.includes('new york ave')) {
      return 'Goodwill of Greater Washington Analysis:\n\n• Volume: 127 donations/day\n• Growth: +12% (steady increase)\n• Balanced inventory across categories\n• Revenue: $8,420/day\n\nStrengths: Consistent performance, professional clothing demand. Operating efficiently with current resources.';
    }

    if (lowerMessage.includes('alexandria') || lowerMessage.includes('richmond')) {
      return 'Alexandria, Richmond Highway Analysis:\n\n• Volume: 142 donations/day\n• Growth: +18% (strong growth)\n• Specialization: Furniture (37% of inventory)\n• Revenue: $9,120/day\n\nStrengths: Solid performance in furniture donations. Well-staffed and operating efficiently.';
    }

    if (lowerMessage.includes('annandale') || lowerMessage.includes('columbia pike')) {
      return 'Annandale, Columbia Pike Analysis:\n\n• Volume: 108 donations/day\n• Growth: +8% (moderate growth)\n• Specialization: Electronics (39% of inventory)\n• Revenue: $7,340/day\n\nRecommendation: Focus on electronics expertise as a competitive advantage in the region.';
    }

    // Staffing questions
    if (lowerMessage.includes('staff') || lowerMessage.includes('hiring') || lowerMessage.includes('employee')) {
      return 'Staffing Optimization Insights:\n\n• Peak donation hours: 10am-2pm (42% of daily volume)\n• Arlington: Operating at 138% capacity - needs +2-3 staff\n• Falls Church: Operating at 84% capacity - can reassign -1-2 staff\n• Greater Washington: Optimal staffing levels\n\nRecommendation: Implement flexible cross-location staffing pool. Shift 2 Falls Church staff to Arlington Mon-Wed. Expected savings: $2.3K/month with 40% backlog reduction.';
    }

    // Partnership questions
    if (lowerMessage.includes('partner') || lowerMessage.includes('recycl') || lowerMessage.includes('reuse')) {
      return 'Partnership Strategy Overview:\n\n• Current: 4 recycling partners, 1 reuse partner\n• Gaps: 3 categories without partners (baby items, damaged furniture, auto parts)\n• Monthly diversion: 896 items from landfill\n• Environmental impact: ~75 tons CO₂ saved annually\n\nPriority actions:\n1. Secure damaged furniture partner (156 items/month)\n2. Establish baby safety items partnership (124 items/month)\n3. Strengthen data sharing with existing partners\n\nWould you like specific partner recommendations?';
    }

    // Optimization questions
    if (lowerMessage.includes('optim') || lowerMessage.includes('improve') || lowerMessage.includes('efficien')) {
      return 'Top Optimization Opportunities:\n\n1. **AI Sorting**: Deploy at Westside first (156/day volume), expect 35% time savings and $2,730/month ROI\n\n2. **Inventory Redistribution**: Transfer 30% of Westside children\'s items to Downtown; move Eastside furniture surplus to Westside\n\n3. **Smart Donor Routing**: Direct furniture donors to Eastside (39% specialization), children\'s items to Westside (40% specialization)\n\nExpected combined impact: 20% faster turnover, 18% revenue increase, 25% better customer satisfaction.';
    }

    // Trends and forecasting
    if (lowerMessage.includes('trend') || lowerMessage.includes('forecast') || lowerMessage.includes('predict')) {
      return '4-Week Trend Analysis:\n\n• Overall growth: +15% across all locations\n• Westside: Accelerating growth (510→624 donations)\n• Downtown: Steady upward trend (420→507)\n• Eastside: Fluctuating, slight decline (350→392)\n\nSeasonal forecast: Expect 20-25% increase in donations during fall/winter months (clothing, household items). Plan staffing and storage capacity accordingly.';
    }

    // Revenue questions
    if (lowerMessage.includes('revenue') || lowerMessage.includes('sales') || lowerMessage.includes('money')) {
      return 'Revenue Overview:\n\n• Total daily revenue: $25,000\n• Westside: $9,850/day (+28% growth) - Top performer\n• Downtown: $8,420/day (+18% growth)\n• Eastside: $6,730/day (-8% decline)\n\nRevenue drivers:\n• Children\'s items averaging $8-12 per item\n• Furniture averaging $45-80 per item\n• Professional clothing averaging $10-15 per item\n\nOpportunity: Implementing all recommended optimizations could add $4,500/day (+18% total revenue).';
    }

    // Distribution questions
    if (lowerMessage.includes('distribut') || lowerMessage.includes('transfer') || lowerMessage.includes('inventory')) {
      return 'Inventory Distribution Strategy:\n\n**Current Imbalances:**\n• Westside: 40% children\'s items (surplus)\n• Eastside: 39% furniture (surplus)\n• Downtown: Needs more children\'s items and professional clothing\n\n**Recommendations:**\n1. Weekly transfers: 20-30% of surplus categories\n2. Smart routing via donor app by item type\n3. Real-time inventory visibility across locations\n\nExpected impact: 20% faster turnover, reduced waste, better customer selection at all locations.';
    }

    // How-to questions
    if (lowerMessage.includes('how') && lowerMessage.includes('improve')) {
      return 'To improve overall performance:\n\n**Short-term (1-2 weeks):**\n• Adjust peak-hour staffing at all locations\n• Begin cross-location staff sharing\n• Launch targeted marketing for Eastside\n\n**Medium-term (1-2 months):**\n• Deploy AI sorting at Westside, then Downtown\n• Establish 2 new recycling partnerships\n• Implement inventory redistribution system\n\n**Long-term (3+ months):**\n• Full smart routing system in donor app\n• Complete optimization rollout\n• Measure and refine based on data\n\nExpected total impact: +25% efficiency, +18% revenue, 30% better donor experience.';
    }

    // Default response
    return 'I can provide insights on:\n\n• **Performance**: Compare metrics across locations\n• **Staffing**: Optimization and scheduling recommendations\n• **Partnerships**: Reuse and recycling strategies\n• **Trends**: Donation patterns and forecasts\n• **Revenue**: Financial performance analysis\n• **Inventory**: Distribution and balancing strategies\n\nWhat specific aspect would you like to explore?';
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

    await new Promise(resolve => setTimeout(resolve, 1200));

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

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 bg-[#8B4513] text-white rounded-full shadow-2xl p-4 cursor-pointer hover:bg-[#6b4423] transition-all"
        onClick={() => setIsMinimized(false)}
      >
        <Bot className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[480px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#8B4513] to-[#A0826D] text-white rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white">Corporate Analytics Assistant</h4>
            <p className="text-xs text-white/80">AI-powered insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20 rounded p-1.5 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded p-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e6f0f9]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-gray-600' : 'bg-[#8B4513]'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-line text-sm">{message.content}</p>
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
            <div className="w-8 h-8 bg-[#8B4513] rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#A0826D] rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-[#A0826D] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-[#A0826D] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about analytics, trends, or recommendations..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6b4423] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
