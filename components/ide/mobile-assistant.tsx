"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
}

interface MobileAssistantContentProps {
  onClose: () => void;
}

const suggestedQuestions = [
  "How was this site made?",
  "Which project shows Arielle's product thinking?",
  "What are Arielle's strongest skills?",
  "What kind of roles is Arielle looking for?",
  "Tell me about her experience.",
];

const predefinedResponses: Record<string, string> = {
  "How was this site made?": `This portfolio was built with Next.js 15, TypeScript, and Tailwind CSS. The IDE-inspired design uses a component-based architecture with an activity bar, file explorer, and responsive layout.`,
  
  "Which project shows Arielle's product thinking?": `The Workflow Intelligence Dashboard is a great example. Arielle designed and built an AI-powered dashboard that surfaces relevant information automatically, reducing context-switching time by 40%.`,
  
  "What are Arielle's strongest skills?": `Arielle excels at bridging product, design, and engineering:\n\n• Systems thinking\n• Full-stack development (React, TypeScript, Node.js)\n• Product sense\n• Design execution`,
  
  "What kind of roles is Arielle looking for?": `Product engineering, design engineering, or senior full-stack roles with high autonomy and direct impact on users. Open to both full-time and select freelance projects.`,
  
  "Tell me about her experience.": `Arielle has experience spanning product, design, and engineering:\n\n• Senior Product Engineer at TechCorp\n• Full Stack Developer at StartupXYZ\n• Started as a Product Designer`,
};

function getResponse(question: string): string {
  if (predefinedResponses[question]) return predefinedResponses[question];
  
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes("site") || lowerQuestion.includes("built") || lowerQuestion.includes("made")) {
    return predefinedResponses["How was this site made?"];
  }
  if (lowerQuestion.includes("product") || lowerQuestion.includes("project")) {
    return predefinedResponses["Which project shows Arielle's product thinking?"];
  }
  if (lowerQuestion.includes("skill") || lowerQuestion.includes("strong")) {
    return predefinedResponses["What are Arielle's strongest skills?"];
  }
  if (lowerQuestion.includes("role") || lowerQuestion.includes("looking") || lowerQuestion.includes("hire")) {
    return predefinedResponses["What kind of roles is Arielle looking for?"];
  }
  if (lowerQuestion.includes("experience") || lowerQuestion.includes("background")) {
    return predefinedResponses["Tell me about her experience."];
  }
  
  return `Great question! I'm a guided assistant with preset responses. Feel free to try one of the suggested questions above, or explore the portfolio sections using the menu!`;
}

export function MobileAssistantContent({ onClose }: MobileAssistantContentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 300));
    
    const response = getResponse(text);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: response,
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold">
            <span className="text-accent-blue">Hi,</span>
            <span className="text-foreground">{" I'm Arielle's Assistant."}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ask me about her projects, experience, or skills.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  className="text-sm px-4 py-2.5 rounded-full bg-elevated border border-border text-muted-foreground hover:text-foreground hover:border-accent-blue/30 transition-colors text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                  message.type === "user"
                    ? "ml-auto bg-accent-blue text-white"
                    : "bg-elevated text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="w-4 h-4 text-accent-blue animate-pulse" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-elevated rounded-lg border border-border focus-within:border-accent-blue/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type here..."
            className="flex-1 bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 mr-2 text-accent-blue hover:text-accent-blue-bright disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
