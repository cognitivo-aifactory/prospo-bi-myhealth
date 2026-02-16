import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { Send, Sparkles, User, Bot, TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { genieApi } from '../services/genieApi';
import { ChatMessage } from '../types/chat.types';
import { ThinkingAnimation } from './ThinkingAnimation';

const SAMPLE_QUESTIONS = [
  { icon: TrendingUp, text: 'What is our appointment attendance rate this quarter?' },
  { icon: DollarSign, text: 'Show me the revenue breakdown by clinic location' },
  { icon: Calendar, text: 'How many no-shows did we have last month?' },
];

export function GenieAI() {
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Genie AI, your intelligent assistant for MyHealth analytics. I can help you analyze data from your dashboards, answer questions about appointments, revenue, practitioner performance, and more. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if API is configured
  useEffect(() => {
    if (!genieApi.isConfigured()) {
      setError(
        'Databricks credentials not configured. Please set up your .env file with DATABRICKS_HOST, DATABRICKS_TOKEN, and GENIE_SPACE_ID.'
      );
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call Genie API
      const response = await genieApi.sendMessage({
        message: input,
        conversationId,
      });

      // Update conversation ID if this is the first message
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: response.id,
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        suggestedQuestions: response.suggestedQuestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while sending the message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className={`mb-6 pb-4 border-b ${
        theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF7A00] to-[#fe4110]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Genie AI</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>
              Your intelligent dashboard assistant
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`mb-4 p-4 rounded-lg border flex items-start gap-3 ${
          theme === 'dark' 
            ? 'bg-red-900/20 border-red-800 text-red-200' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className={`text-sm underline mt-2 ${
                theme === 'dark' ? 'text-red-300' : 'text-red-600'
              }`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`}>
            Try asking:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q.text)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  theme === 'dark'
                    ? 'border-[#24324A] bg-[#111A2E] hover:bg-[rgba(255,122,0,0.10)] text-[#E6EDF7]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <q.icon className="w-4 h-4 text-[#FF7A00] flex-shrink-0" />
                <span className="text-sm">{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#fe4110] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-[#FF7A00] text-white'
                  : theme === 'dark'
                  ? 'bg-[#111A2E] text-[#E6EDF7] border border-[#24324A]'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              
              {/* Suggested Questions */}
              {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-opacity-20">
                  <p className="text-xs font-medium mb-2 opacity-75">Suggested questions:</p>
                  <div className="space-y-1">
                    {message.suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(question)}
                        className={`block text-xs p-2 rounded border text-left w-full transition-colors ${
                          theme === 'dark'
                            ? 'border-[#24324A] hover:bg-[rgba(255,122,0,0.10)]'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user'
                    ? 'text-orange-100'
                    : theme === 'dark'
                    ? 'text-[#7F90AA]'
                    : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('en-AU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {message.role === 'user' && (
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-[#111A2E] border border-[#24324A]' : 'bg-gray-200'
              }`}>
                <User className={`w-5 h-5 ${theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'}`} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className={`px-4 py-2 rounded-lg ${
            theme === 'dark' 
              ? 'bg-[#111A2E]/50 border border-[#24324A]' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <ThinkingAnimation theme={theme} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className={`border-t pt-4 ${
          theme === 'dark' ? 'border-[#24324A]' : 'border-gray-200'
        }`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your dashboard data..."
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-opacity-50 ${
              theme === 'dark'
                ? 'bg-[#16223A] border-[#24324A] text-[#E6EDF7] placeholder-[#7F90AA]'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              input.trim() && !isLoading
                ? 'bg-[#FF7A00] hover:bg-[#FF8F2B] text-white'
                : theme === 'dark'
                ? 'bg-[#111A2E] text-[#7F90AA] cursor-not-allowed border border-[#24324A]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Sending...' : 'Send'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}