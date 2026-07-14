"use client";

import { MessageCircle } from "lucide-react";
import { ResumeAssistantChat } from "./resume-assistant-chat";

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export function AssistantPanel({ isOpen, onClose, onOpen }: AssistantPanelProps) {
  const handleOpen = () => {
    onOpen?.();
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
      <ResumeAssistantChat onClose={onClose} variant="desktop" />
    </div>
  );
}
