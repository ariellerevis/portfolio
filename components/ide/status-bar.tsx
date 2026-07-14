"use client";

import { GitBranch, Circle } from "lucide-react";

interface StatusBarProps {
  activeSection: string;
  activePath: string;
}

export function StatusBar({ activeSection, activePath }: StatusBarProps) {
  return (
    <div className="h-7 overflow-hidden bg-activity-bar border-t border-border flex items-center justify-between px-3 text-xs">
      <div className="flex min-w-0 items-center gap-4">
        <div className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </div>
        <div className="min-w-0 truncate text-muted-foreground">
          <span className="text-accent-blue">arielle</span>
          <span className="text-muted-foreground">@portfolio</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-foreground">{activePath}</span>
        </div>
      </div>
      <div className="hidden items-center gap-4 sm:flex">
        <div className="flex items-center gap-1.5">
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
          <span className="text-muted-foreground">RPI Class of 2028</span>
        </div>
        <span className="text-muted-foreground">dark mode</span>
      </div>
    </div>
  );
}
