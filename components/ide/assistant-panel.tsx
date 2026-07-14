"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
}

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
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
  "How was this site made?": `This portfolio was built with Next.js, TypeScript, and Tailwind CSS. The IDE-inspired design uses a component-based architecture with an activity bar, file explorer, assistant panel, terminal, and responsive mobile sheets.`,
  
  "Which projects are highlighted?": `Arielle's resume highlights three projects:\n\n- PathAI: a containerized academic advising web app built by a 5-person team with Next.js, TypeScript, FastAPI, PostgreSQL/Supabase, Upstash Vector, and a custom RAG pipeline.\n- Rent vs. Buy Housing Tool: a full-stack analytics tool using Bloomberg, Zillow, and FRED data in a financial model.\n- Schedule Sync: a PHP/MySQL course planning app serving 300+ students with University ID login, AJAX scheduling, interactive calendars, and JSON pipelines.`,
  
  "What are Arielle's strongest skills?": `Arielle's resume lists software, data, AI, and communication strengths:\n\n- Software: Python, R, C++, C, LaTeX, SQL, Assembly, JavaScript\n- Databases: MongoDB, Supabase, PostgreSQL, MySQL\n- Libraries/cloud: React, Node.js, AWS, Azure, Vercel\n- Tools: Bloomberg, WRDS, GitHub, Excel, Word, PowerPoint\n- AI tools: Codex, Claude, Gemini, Copilot\n- Interpersonal: detail-oriented work, public speaking, and technical writing`,
  
  "Tell me about her experience.": `Arielle has professional experience at Deloitte, RPI's Rensselaer Cybersecurity Collaboratory, and the Voorhees Computing Center.\n\nAt Deloitte, she is a Discovery II Intern in IT Assurance, working on IT systems and workflow audits, SAP risk/compliance analysis, SOD conflicts, change management, SM20 security audit logs, and an automated agent for risk and compliance anomaly detection. She previously completed Deloitte Discovery I in Risk & Financial Advisory. At the Collaboratory, she analyzed AI and cybersecurity education data. At the Help Desk, she resolves technical issues and documents support activity for students and staff.`,

  "What does Arielle do at Deloitte?": `Her updated resume lists two Deloitte roles:\n\n- Discovery II Intern - IT Assurance (June 2026-Present): IT systems and workflow audits for a Fortune 500 aerospace and defense client, SAP risk/compliance evaluation, SOD conflicts, change management frameworks, SM20 security audit logs, and an automated agent for unstructured audit data.\n- Discovery I Intern - Risk & Financial Advisory (July 2025-August 2025): financial analysis, market research, strategic analysis on 2 acquisition targets, an LLS software solution projected to increase engagement by 30%, and a 7-person integration roadmap team.`,
  
  "What leadership roles has she held?": `Arielle has led across technical, finance, service, and campus organizations:\n\n- President, ACM Women's Chapter\n- Head of Risk, James Fund\n- Director of Finance, Alpha Phi - Theta Tau Chapter\n- Vice President, Ski and Snowboard Club`,

  "What are Arielle's interests?": `Her listed interests are AI, skiing, reading, Marvel, weightlifting, Game of Thrones, and crocheting.`,
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
    return predefinedResponses["Which projects are highlighted?"];
  }
  if (lowerQuestion.includes("skill") || lowerQuestion.includes("strong")) {
    return predefinedResponses["What are Arielle's strongest skills?"];
  }
  if (lowerQuestion.includes("deloitte") || lowerQuestion.includes("audit") || lowerQuestion.includes("assurance") || lowerQuestion.includes("sap")) {
    return predefinedResponses["What does Arielle do at Deloitte?"];
  }
  if (lowerQuestion.includes("experience") || lowerQuestion.includes("background") || lowerQuestion.includes("history")) {
    return predefinedResponses["Tell me about her experience."];
  }
  if (lowerQuestion.includes("leadership") || lowerQuestion.includes("club") || lowerQuestion.includes("activity") || lowerQuestion.includes("activities")) {
    return predefinedResponses["What leadership roles has she held?"];
  }
  if (lowerQuestion.includes("interest") || lowerQuestion.includes("hobby") || lowerQuestion.includes("hobbies")) {
    return predefinedResponses["What are Arielle's interests?"];
  }
  
  // Default response
  return `Great question. I'm a guided portfolio assistant with preset responses, so I can answer best about Arielle's resume-backed projects, experience, skills, leadership, education, and interests.`;
}

export function AssistantPanel({ isOpen, onClose, onOpen }: AssistantPanelProps) {
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
    
    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 900));
    
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

  const handleOpen = () => {
    onOpen?.();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-accent-blue/70 bg-panel text-accent-blue shadow-[0_16px_44px_rgba(0,0,0,0.42)] ring-1 ring-accent-blue/25 transition-all hover:-translate-y-0.5 hover:border-accent-blue hover:text-accent-blue-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/70"
        aria-label="Open assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="w-80 max-w-[calc(100vw-3.5rem)] bg-panel border-l border-border flex flex-col h-full">
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
          onClick={handleClose}
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
