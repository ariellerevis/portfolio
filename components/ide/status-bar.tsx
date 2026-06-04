"use client";

import { GitBranch, Circle } from "lucide-react";

interface StatusBarProps {
  activeSection: string;
  activePath: string;
}

export function StatusBar({ activeSection, activePath }: StatusBarProps) {
  return (
    <div className="h-7 bg-activity-bar border-t border-border flex items-center justify-between px-3 text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </div>
        <div className="text-muted-foreground">
          <span className="text-accent-blue">arielle</span>
          <span className="text-muted-foreground/60">@portfolio</span>
          <span className="text-muted-foreground/60">:</span>
          <span className="text-foreground">{activePath}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
          <span className="text-muted-foreground">available for select projects</span>
        </div>
        <span className="text-muted-foreground">dark mode</span>
      </div>
    </div>
  );
}
