"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, X, Send, Sparkles } from "lucide-react";

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
  "Which projects are highlighted?",
  "What are Arielle's strongest skills?",
  "Tell me about her experience.",
  "What does Arielle do at Deloitte?",
  "What leadership roles has she held?",
  "What are Arielle's interests?",
];

const predefinedResponses: Record<string, string> = {
  "How was this site made?": `This portfolio was built with Next.js, TypeScript, and Tailwind CSS. The IDE-inspired design uses an activity bar, file explorer, assistant panel, terminal, and responsive mobile sheets.`,
  
  "Which projects are highlighted?": `Arielle's resume highlights PathAI, a Rent vs. Buy Housing Tool, and Schedule Sync.\n\nPathAI is a containerized academic advising app. The housing tool uses Bloomberg, Zillow, and FRED data in a financial model. Schedule Sync is a PHP/MySQL course planning app serving 300+ students.`,
  
  "What are Arielle's strongest skills?": `Arielle's resume lists Python, R, C++, C, LaTeX, SQL, Assembly, JavaScript, React, Node.js, Bloomberg, WRDS, GitHub, Excel, Word, PowerPoint, MongoDB, Supabase, PostgreSQL, MySQL, AWS, Azure, Vercel, Codex, Claude, Gemini, and Copilot.`,
  
  "Tell me about her experience.": `Arielle has experience with Deloitte IT Assurance and Risk & Financial Advisory, the Rensselaer Cybersecurity Collaboratory, and the Voorhees Computing Center help desk.`,

  "What does Arielle do at Deloitte?": `Her updated resume lists Discovery II - IT Assurance work on IT systems and workflow audits, SAP risk/compliance analysis, SOD conflicts, change management, SM20 security audit logs, and an automated agent for risk and compliance anomaly detection. She also completed Discovery I - Risk & Financial Advisory in 2025.`,
  
  "What leadership roles has she held?": `Her leadership roles include ACM Women's Chapter President, James Fund Head of Risk, Alpha Phi Director of Finance, and Ski and Snowboard Club Vice President.`,

  "What are Arielle's interests?": `Her listed interests are AI, skiing, reading, Marvel, weightlifting, Game of Thrones, and crocheting.`,
};

function getResponse(question: string): string {
  if (predefinedResponses[question]) return predefinedResponses[question];
  
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes("site") || lowerQuestion.includes("built") || lowerQuestion.includes("made")) {
    return predefinedResponses["How was this site made?"];
  }
  if (lowerQuestion.includes("product") || lowerQuestion.includes("project")) {
    return predefinedResponses["Which projects are highlighted?"];
  }
  if (lowerQuestion.includes("skill") || lowerQuestion.includes("strong")) {
    return predefinedResponses["What are Arielle's strongest skills?"];
  }
  if (lowerQuestion.includes("deloitte") || lowerQuestion.includes("audit") || lowerQuestion.includes("assurance") || lowerQuestion.includes("sap")) {
    return predefinedResponses["What does Arielle do at Deloitte?"];
  }
  if (lowerQuestion.includes("experience") || lowerQuestion.includes("background")) {
    return predefinedResponses["Tell me about her experience."];
  }
  if (lowerQuestion.includes("leadership") || lowerQuestion.includes("club") || lowerQuestion.includes("activity")) {
    return predefinedResponses["What leadership roles has she held?"];
  }
  if (lowerQuestion.includes("interest") || lowerQuestion.includes("hobby")) {
    return predefinedResponses["What are Arielle's interests?"];
  }
  
  return `Great question. I'm a guided assistant with preset responses, so I can answer best about Arielle's resume-backed projects, experience, skills, leadership, education, and interests.`;
}

export function MobileAssistantContent({ onClose }: MobileAssistantContentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const createMessageId = (type: Message["type"]) => {
      nextMessageIdRef.current += 1;
      return `${type}-${nextMessageIdRef.current}`;
    };
    
    const userMessage: Message = {
      id: createMessageId("user"),
      type: "user",
      content: text,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    await new Promise((resolve) => setTimeout(resolve, 700));
    
    const response = getResponse(text);
    const assistantMessage: Message = {
      id: createMessageId("assistant"),
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
          <button
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-accent-blue/25 bg-accent-blue-soft px-2 py-1.5 font-mono text-xs text-accent-blue transition-colors hover:border-accent-blue/45 hover:text-accent-blue-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
            aria-pressed="true"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>ask questions</span>
          </button>
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
