"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, BookOpenCheck, Send, Sparkles, X } from "lucide-react";
import {
  RESUME_SUGGESTED_QUESTIONS,
  type AssistantApiResponse,
  type AssistantMode,
  type AssistantSource,
} from "@/lib/resume-assistant";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  mode?: AssistantMode;
  sources?: AssistantSource[];
  retryAfter?: string;
  fallbackQuestions?: string[];
}

interface ResumeAssistantChatProps {
  onClose: () => void;
  variant: "desktop" | "mobile";
}

const MAX_MESSAGE_CHARS = 500;

const modeLabel: Record<AssistantMode, string> = {
  rag: "resume RAG",
  static: "preanswered from resume",
  refusal: "resume-only boundary",
  quota_fallback: "free quota fallback",
};

const modeClass: Record<AssistantMode, string> = {
  rag: "border-accent-blue/35 bg-accent-blue-soft text-accent-blue-bright",
  static: "border-green-400/25 bg-green-500/10 text-green-300",
  refusal: "border-amber-300/25 bg-amber-400/10 text-amber-200",
  quota_fallback: "border-amber-300/25 bg-amber-400/10 text-amber-200",
};

function createFallbackResponse(): AssistantApiResponse {
  return {
    answer:
      "I could not reach the resume assistant service. You can still use the preanswered resume questions below without any models.",
    sources: [],
    mode: "quota_fallback",
    retryAfter: "later today or within 24 hours",
    fallbackQuestions: RESUME_SUGGESTED_QUESTIONS,
  };
}

function uniqueSources(sources: AssistantSource[]) {
  const seen = new Set<string>();

  return sources.filter((source) => {
    const key = `${source.section}:${source.sourceUrl}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function ResumeAssistantChat({ onClose, variant }: ResumeAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(0);
  const isMobile = variant === "mobile";

  const createMessageId = (type: Message["type"]) => {
    nextMessageIdRef.current += 1;
    return `${type}-${nextMessageIdRef.current}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const boundedText = trimmed.slice(0, MAX_MESSAGE_CHARS);

    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId("user"),
        type: "user",
        content: boundedText,
      },
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: boundedText }),
      });

      const data = (await response.json().catch(createFallbackResponse)) as AssistantApiResponse;

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId("assistant"),
          type: "assistant",
          content: data.answer,
          mode: data.mode,
          sources: data.sources,
          retryAfter: data.retryAfter,
          fallbackQuestions: data.fallbackQuestions,
        },
      ]);
    } catch {
      const fallback = createFallbackResponse();
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId("assistant"),
          type: "assistant",
          content: fallback.answer,
          mode: fallback.mode,
          sources: fallback.sources,
          retryAfter: fallback.retryAfter,
          fallbackQuestions: fallback.fallbackQuestions,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSend(input);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-shrink-0 items-start justify-between border-b border-border p-4">
        <div>
          <h2 className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>
            <span className="text-accent-blue">Resume</span>
            <span className="text-foreground"> assistant</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask about Arielle&apos;s resume. LinkedIn and GitHub are not indexed yet.
          </p>
          {isMobile && (
            <button
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-2 rounded-md border border-accent-blue/25 bg-accent-blue-soft px-2 py-1.5 font-mono text-xs text-accent-blue transition-colors hover:border-accent-blue/45 hover:text-accent-blue-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
              aria-pressed="true"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ask questions</span>
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
          aria-label="Close assistant"
        >
          <X className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <BookOpenCheck className="h-3.5 w-3.5 text-accent-blue" />
              <span>Resume-only suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {RESUME_SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  className={cn(
                    "rounded-full border border-border bg-elevated text-left text-muted-foreground transition-colors hover:border-accent-blue/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60",
                    isMobile ? "px-4 py-2.5 text-sm" : "px-3 py-2 text-xs",
                  )}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[90%] rounded-lg px-3 py-2 text-sm",
                  message.type === "user"
                    ? "ml-auto bg-accent-blue text-white"
                    : "bg-elevated text-foreground",
                  isMobile && "max-w-[85%] px-4 py-3",
                )}
              >
                {message.mode && (
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wide",
                        modeClass[message.mode],
                      )}
                    >
                      {message.mode === "quota_fallback" && <AlertCircle className="h-3 w-3" />}
                      {modeLabel[message.mode]}
                    </span>
                    {message.retryAfter && message.mode === "quota_fallback" && (
                      <span className="font-mono text-[0.68rem] text-muted-foreground">
                        {message.retryAfter}
                      </span>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-2">
                    {uniqueSources(message.sources).map((source) => (
                      <span
                        key={`${source.section}-${source.sourceUrl}`}
                        className="rounded bg-secondary px-2 py-1 font-mono text-[0.68rem] text-muted-foreground"
                      >
                        {source.section}
                      </span>
                    ))}
                  </div>
                )}
                {message.fallbackQuestions && message.fallbackQuestions.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    <p className="font-mono text-[0.68rem] uppercase tracking-wide text-muted-foreground">
                      Use without models
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.fallbackQuestions.slice(0, 4).map((question) => (
                        <button
                          key={question}
                          onClick={() => handleSend(question)}
                          disabled={isTyping}
                          className="rounded-full border border-border bg-panel px-2.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-accent-blue/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse text-accent-blue" />
                <span className="text-sm">Checking the resume...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {RESUME_SUGGESTED_QUESTIONS.slice(0, 4).map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                disabled={isTyping}
                className="flex-shrink-0 whitespace-nowrap rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent-blue/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-shrink-0 border-t border-border p-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-elevated transition-colors focus-within:border-accent-blue/50">
          <label className="sr-only" htmlFor={`resume-assistant-input-${variant}`}>
            Ask a resume question
          </label>
          <input
            id={`resume-assistant-input-${variant}`}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, MAX_MESSAGE_CHARS))}
            placeholder="ask about the resume..."
            maxLength={MAX_MESSAGE_CHARS}
            className={cn(
              "min-w-0 flex-1 bg-transparent px-4 text-foreground placeholder:text-muted-foreground focus:outline-none font-mono",
              isMobile ? "py-3.5 text-base" : "py-3 text-sm",
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "mr-2 text-accent-blue transition-colors hover:text-accent-blue-bright disabled:cursor-not-allowed disabled:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60",
              isMobile ? "p-3" : "p-2",
            )}
            aria-label="Send message"
          >
            <Send className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Custom answers use resume RAG when free AI quota is available.
        </p>
      </form>
    </div>
  );
}
