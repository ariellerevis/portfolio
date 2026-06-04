"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
}

interface AssistantPanelProps {
  isOpen: boolean;
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
  "How was this site made?": `This portfolio was built with Next.js 15, TypeScript, and Tailwind CSS. The IDE-inspired design uses a component-based architecture with an activity bar, file explorer, and responsive layout. The site is fully responsive and works great on mobile too!`,
  
  "Which project shows Arielle's product thinking?": `The Workflow Intelligence Dashboard is a great example. Arielle identified that teams were losing time switching between tools to find context. She designed and built an AI-powered dashboard that surfaces relevant information automatically, reducing context-switching time by 40%.`,
  
  "What are Arielle's strongest skills?": `Arielle excels at bridging product, design, and engineering. Key strengths include:\n\n• Systems thinking - seeing the big picture while handling details\n• Full-stack development - React, TypeScript, Node.js, PostgreSQL\n• Product sense - framing problems and prioritizing solutions\n• Design execution - turning ideas into polished interfaces`,
  
  "What kind of roles is Arielle looking for?": `Arielle is interested in product engineering, design engineering, or senior full-stack roles where she can own outcomes end-to-end. She thrives in environments with high autonomy, interesting technical challenges, and direct impact on users. She's open to both full-time and select freelance projects.`,
  
  "Tell me about her experience.": `Arielle has a diverse background spanning product, design, and engineering:\n\n• Currently a Senior Product Engineer at TechCorp, leading internal tools development\n• Previously Full Stack Developer at StartupXYZ, scaling the platform to 50k users\n• Started as a Product Designer, bringing user-centered thinking to every project\n\nThis cross-functional experience gives her a unique perspective on building products.`,
};

function getResponse(question: string): string {
  // Check for exact matches
  if (predefinedResponses[question]) {
    return predefinedResponses[question];
  }
  
  // Check for partial matches
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
  if (lowerQuestion.includes("role") || lowerQuestion.includes("looking") || lowerQuestion.includes("hire") || lowerQuestion.includes("work")) {
    return predefinedResponses["What kind of roles is Arielle looking for?"];
  }
  if (lowerQuestion.includes("experience") || lowerQuestion.includes("background") || lowerQuestion.includes("history")) {
    return predefinedResponses["Tell me about her experience."];
  }
  
  // Default response
  return `Great question! While I'm a guided portfolio assistant with pre-set responses, I can tell you that Arielle is a systems-minded builder who combines product thinking, design intuition, and technical execution. Feel free to explore the portfolio sections using the file tree, or try one of the suggested questions above!`;
}

export function AssistantPanel({ isOpen, onClose }: AssistantPanelProps) {
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
    
    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));
    
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

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-panel border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            <span className="text-accent-blue">Hi,</span>
            <span className="text-foreground">{" I'm Arielle's Assistant."}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ask me about her projects, experience, or skills.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 rounded transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  className="text-xs px-3 py-2 rounded-full bg-elevated border border-border text-muted-foreground hover:text-foreground hover:border-accent-blue/30 transition-colors text-left"
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
                className={cn(
                  "max-w-[90%] rounded-lg px-3 py-2 text-sm",
                  message.type === "user"
                    ? "ml-auto bg-accent-blue text-white"
                    : "bg-elevated text-foreground"
                )}
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

      {/* Suggested chips when there are messages */}
      {messages.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestedQuestions.slice(0, 3).map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                className="text-xs px-3 py-1.5 rounded-full bg-elevated border border-border text-muted-foreground hover:text-foreground hover:border-accent-blue/30 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-elevated rounded-lg border border-border focus-within:border-accent-blue/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type here..."
            className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 mr-2 text-accent-blue hover:text-accent-blue-bright disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This is a guided portfolio assistant with preset responses
        </p>
      </form>
    </div>
  );
}
