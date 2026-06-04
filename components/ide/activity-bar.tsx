"use client";

import { Files, Search, FolderKanban, GitBranch, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityBarProps {
  activeIcon: string;
  onIconClick: (icon: string) => void;
}

const topIcons = [
  { id: "explorer", icon: Files, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "projects", icon: FolderKanban, label: "Projects" },
  { id: "github", icon: GitBranch, label: "GitHub" },
  { id: "profile", icon: User, label: "Contact" },
];

const bottomIcons = [
  { id: "settings", icon: Settings, label: "Settings" },
];

export function ActivityBar({ activeIcon, onIconClick }: ActivityBarProps) {
  return (
    <div className="w-14 bg-activity-bar flex flex-col items-center py-2 border-r border-border">
      <div className="flex flex-col gap-1 flex-1">
        {topIcons.map((item) => (
          <button
            key={item.id}
            onClick={() => onIconClick(item.id)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-150",
              "hover:bg-white/5",
              activeIcon === item.id
                ? "text-accent-blue border-l-2 border-accent-blue bg-accent-blue-soft"
                : "text-muted-foreground"
            )}
            aria-label={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {bottomIcons.map((item) => (
          <button
            key={item.id}
            onClick={() => onIconClick(item.id)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-150",
              "hover:bg-white/5",
              activeIcon === item.id
                ? "text-accent-blue"
                : "text-muted-foreground"
            )}
            aria-label={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
