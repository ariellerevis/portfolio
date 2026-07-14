"use client";

import { ResumeAssistantChat } from "./resume-assistant-chat";

interface MobileAssistantContentProps {
  onClose: () => void;
}

export function MobileAssistantContent({ onClose }: MobileAssistantContentProps) {
  return <ResumeAssistantChat onClose={onClose} variant="mobile" />;
}
