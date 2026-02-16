import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ThinkingAnimationProps {
  theme: 'light' | 'dark';
}

const THINKING_MESSAGES = [
  'Analyzing your question...',
  'Searching through data sources...',
  'Connecting to the warehouse...',
  'Preparing the query...',
  'Executing SQL query...',
  'Processing results...',
  'Generating insights...',
  'Crafting the perfect response...',
  'Almost there...',
  'Finalizing the answer...',
];

export function ThinkingAnimation({ theme }: ThinkingAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Animated Sparkles Icon */}
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#fe4110] flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-white animate-pulse" />
      </div>

      {/* Animated Text */}
      <div className="flex items-center gap-2">
        <span 
          className={`text-sm font-medium transition-opacity duration-300 ${
            theme === 'dark' ? 'text-[#A9B6CC]' : 'text-gray-600'
          }`}
          key={messageIndex}
        >
          {THINKING_MESSAGES[messageIndex]}
        </span>

        {/* Animated Dots */}
        <div className="flex gap-1">
          <div 
            className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
