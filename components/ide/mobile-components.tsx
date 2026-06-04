"use client";

import { Menu, MessageCircle, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onAssistantClick: () => void;
  onTerminalClick: () => void;
  menuOpen: boolean;
}

export function MobileHeader({ onMenuClick, onAssistantClick, onTerminalClick, menuOpen }: MobileHeaderProps) {
  return (
    <header className="h-14 bg-activity-bar border-b border-border flex items-center justify-between px-4 lg:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      <div className="font-bold text-lg">
        <span className="text-accent-blue">~/</span>
        <span className="text-foreground">arielle</span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={onTerminalClick}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Open terminal"
        >
          <Terminal className="w-5 h-5" />
        </button>
        <button
          onClick={onAssistantClick}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Open assistant"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-14 bottom-0 w-72 bg-explorer border-r border-border z-50 lg:hidden transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {children}
      </div>
    </>
  );
}

interface MobileAssistantSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileAssistantSheet({ isOpen, onClose, children }: MobileAssistantSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-14 bg-panel border-t border-border z-50 lg:hidden transition-transform duration-200 flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {children}
      </div>
    </>
  );
}
