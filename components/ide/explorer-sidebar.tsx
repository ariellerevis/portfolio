"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FileTree, type FileItem } from "./file-tree";

interface ExplorerSidebarProps {
  activeFile: string | null;
  onFileClick: (fileId: string) => void;
  defaultCollapsed?: boolean;
  isCollapsed?: boolean;
  onCollapsedChange?: (isCollapsed: boolean) => void;
}

const portfolioTree: FileItem[] = [
  { id: "about", name: "about.md", type: "file", extension: "md" },
  {
    id: "projects",
    name: "projects",
    type: "folder",
    children: [
      { id: "project-workflow", name: "workflow-dashboard.tsx", type: "file", extension: "tsx" },
      { id: "project-automation", name: "automation-engine.tsx", type: "file", extension: "tsx" },
      { id: "project-design", name: "design-system.tsx", type: "file", extension: "tsx" },
      { id: "case-studies", name: "case-studies.json", type: "file", extension: "json" },
    ],
  },
  {
    id: "experience",
    name: "experience",
    type: "folder",
    children: [
      { id: "roles", name: "roles.md", type: "file", extension: "md" },
      { id: "impact", name: "impact.md", type: "file", extension: "md" },
    ],
  },
  {
    id: "skills",
    name: "skills",
    type: "folder",
    children: [
      { id: "skill-product", name: "product.ts", type: "file", extension: "ts" },
      { id: "skill-design", name: "design.css", type: "file", extension: "css" },
      { id: "skill-engineering", name: "engineering.js", type: "file", extension: "js" },
    ],
  },
  {
    id: "writing",
    name: "writing",
    type: "folder",
    children: [
      { id: "notes", name: "notes.md", type: "file", extension: "md" },
    ],
  },
  { id: "contact", name: "contact.md", type: "file", extension: "md" },
  { id: "resume", name: "resume.pdf", type: "file", extension: "pdf" },
];

export function ExplorerSidebar({
  activeFile,
  onFileClick,
  defaultCollapsed = true,
  isCollapsed,
  onCollapsedChange,
}: ExplorerSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsed = isCollapsed ?? internalCollapsed;

  useEffect(() => {
    const setCollapsed = (nextValue: boolean | ((current: boolean) => boolean)) => {
      if (isCollapsed === undefined) {
        setInternalCollapsed((current) => {
          const next = typeof nextValue === "function" ? nextValue(current) : nextValue;
          onCollapsedChange?.(next);
          return next;
        });
        return;
      }

      const next = typeof nextValue === "function" ? nextValue(isCollapsed) : nextValue;
      onCollapsedChange?.(next);
    };

    const handleToggle = () => setCollapsed((current) => !current);
    const handleOpen = () => setCollapsed(false);

    window.addEventListener("portfolio:toggle-explorer", handleToggle);
    window.addEventListener("portfolio:open-explorer", handleOpen);

    return () => {
      window.removeEventListener("portfolio:toggle-explorer", handleToggle);
      window.removeEventListener("portfolio:open-explorer", handleOpen);
    };
  }, [isCollapsed, onCollapsedChange]);

  if (collapsed) {
    return null;
  }

  return (
    <div className="w-56 bg-explorer border-r border-border flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border">
        <button
          onClick={() => onFileClick("about")}
          className="text-xs font-semibold uppercase tracking-wider text-accent-blue hover:text-accent-blue-bright transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60 rounded"
        >
          Portfolio
        </button>
        <button
          onClick={() => onCollapsedChange?.(true)}
          className="mt-3 flex items-center gap-2 rounded-md border border-accent-blue/25 bg-accent-blue-soft px-2 py-1.5 font-mono text-xs text-accent-blue transition-colors hover:border-accent-blue/45 hover:text-accent-blue-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60 lg:hidden"
          aria-pressed="true"
        >
          <span>explore folders</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <FileTree
          items={portfolioTree}
          activeFile={activeFile}
          onFileClick={onFileClick}
        />
      </div>
    </div>
  );
}
